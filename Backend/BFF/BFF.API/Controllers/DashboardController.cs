using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using BFF.API.Models;
using BFF.Cache;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace BFF.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ICacheService _cacheService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IHttpClientFactory httpClientFactory,
            ICacheService cacheService,
            ILogger<DashboardController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _cacheService = cacheService;
            _logger = logger;
        }

        [HttpGet("cliente")]
        [Authorize(Roles = "CLIENTE,GERENTE")]
        public async Task<IActionResult> GetClienteDashboard()
        {
            try
            {
                // Obtém o ID do usuário logado
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Usuário não identificado" });
                }

                // Tenta obter do cache primeiro
                var cacheKey = $"dashboard_cliente_{userId}";
                var cachedResult = await _cacheService.GetAsync<ClienteDashboardDto>(cacheKey);

                if (cachedResult != null)
                {
                    return Ok(cachedResult);
                }

                // Buscar informações do usuário
                var peopleClient = _httpClientFactory.CreateClient("PeopleApi");
                var userResponse = await peopleClient.GetAsync($"api/usuarios/{userId}");

                if (!userResponse.IsSuccessStatusCode)
                {
                    return StatusCode((int)userResponse.StatusCode, new { message = "Erro ao obter dados do usuário" });
                }

                var usuario = await userResponse.Content.ReadFromJsonAsync<UserDto>();

                // Buscar contas do usuário
                var accountClient = _httpClientFactory.CreateClient("AccountApi");
                var contasResponse = await accountClient.GetAsync($"api/contas/usuario/{userId}");

                if (!contasResponse.IsSuccessStatusCode)
                {
                    return StatusCode((int)contasResponse.StatusCode, new { message = "Erro ao obter contas do usuário" });
                }

                var contas = await contasResponse.Content.ReadFromJsonAsync<List<ContaDto>>();

                // Calcular saldo total
                decimal saldoTotal = contas?.Sum(c => c.Saldo) ?? 0;

                // Buscar movimentações recentes (últimos 30 dias)
                var transactionClient = _httpClientFactory.CreateClient("TransactionApi");
                var hoje = DateTime.UtcNow;
                var ultimoMes = hoje.AddDays(-30);

                List<MovimentacaoDto> movimentacoesRecentes = new List<MovimentacaoDto>();

                foreach (var conta in contas ?? Enumerable.Empty<ContaDto>())
                {
                    var movsResponse = await transactionClient.GetAsync(
                        $"api/movimentacoes/extrato/{conta.Id}?de={ultimoMes:o}&ate={hoje:o}");

                    if (movsResponse.IsSuccessStatusCode)
                    {
                        var movsDaConta = await movsResponse.Content.ReadFromJsonAsync<List<MovimentacaoDto>>();
                        if (movsDaConta != null)
                        {
                            movimentacoesRecentes.AddRange(movsDaConta);
                        }
                    }
                }

                // Ordenar por data mais recente
                movimentacoesRecentes = movimentacoesRecentes
                    .OrderByDescending(m => m.Data)
                    .Take(10)  // Limitar a 10 movimentações mais recentes
                    .ToList();

                // Montar o DTO do dashboard
                var dashboard = new ClienteDashboardDto
                {
                    Usuario = usuario ?? new UserDto(),
                    Contas = contas ?? new List<ContaDto>(),
                    SaldoTotal = saldoTotal,
                    MovimentacoesRecentes = movimentacoesRecentes
                };

                // Armazenar no cache por 2 minutos (atualização frequente)
                await _cacheService.SetAsync(cacheKey, dashboard, 2);

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar solicitação de dashboard do cliente");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpGet("gerente")]
        [Authorize(Roles = "GERENTE")]
        public async Task<IActionResult> GetGerenteDashboard()
        {
            try
            {
                // Tenta obter do cache primeiro
                var cacheKey = "dashboard_gerente";
                var cachedResult = await _cacheService.GetAsync<GerenteDashboardDto>(cacheKey);

                if (cachedResult != null)
                {
                    return Ok(cachedResult);
                }

                // Buscar todos os usuários
                var peopleClient = _httpClientFactory.CreateClient("PeopleApi");
                var usuariosResponse = await peopleClient.GetAsync("api/usuarios");

                if (!usuariosResponse.IsSuccessStatusCode)
                {
                    return StatusCode((int)usuariosResponse.StatusCode, new { message = "Erro ao obter usuários" });
                }

                var usuarios = await usuariosResponse.Content.ReadFromJsonAsync<List<UserDto>>();

                // Buscar todas as contas
                var accountClient = _httpClientFactory.CreateClient("AccountApi");
                var contasResponse = await accountClient.GetAsync("api/contas");

                if (!contasResponse.IsSuccessStatusCode)
                {
                    return StatusCode((int)contasResponse.StatusCode, new { message = "Erro ao obter contas" });
                }

                var contas = await contasResponse.Content.ReadFromJsonAsync<List<ContaDto>>();

                // Estatísticas
                var totalClientes = usuarios?.Count(u => u.Perfil == "CLIENTE") ?? 0;
                var totalContas = contas?.Count ?? 0;
                var contasAtivas = contas?.Count(c => c.Status == "ATIVA") ?? 0;
                var contasInativas = contas?.Count(c => c.Status == "INATIVA") ?? 0;
                var saldoTotal = contas?.Sum(c => c.Saldo) ?? 0;

                // Buscar movimentações recentes (últimos 7 dias)
                var transactionClient = _httpClientFactory.CreateClient("TransactionApi");
                var hoje = DateTime.UtcNow;
                var ultimaSemana = hoje.AddDays(-7);

                // Obter todas as movimentações recentes
                var movsResponse = await transactionClient.GetAsync(
                    $"api/movimentacoes/recentes?de={ultimaSemana:o}&ate={hoje:o}");

                List<MovimentacaoDto> movimentacoesRecentes = new List<MovimentacaoDto>();

                if (movsResponse.IsSuccessStatusCode)
                {
                    var movs = await movsResponse.Content.ReadFromJsonAsync<List<MovimentacaoDto>>();
                    if (movs != null)
                    {
                        movimentacoesRecentes = movs
                            .OrderByDescending(m => m.Data)
                            .Take(20)  // Limitar a 20 movimentações mais recentes
                            .ToList();
                    }
                }

                // Montar o DTO do dashboard
                var dashboard = new GerenteDashboardDto
                {
                    TotalClientes = totalClientes,
                    TotalContas = totalContas,
                    ContasAtivas = contasAtivas,
                    ContasInativas = contasInativas,
                    SaldoTotal = saldoTotal,
                    Clientes = usuarios?.Where(u => u.Perfil == "CLIENTE").ToList() ?? new List<UserDto>(),
                    MovimentacoesRecentes = movimentacoesRecentes
                };

                // Armazenar no cache por 2 minutos (atualização frequente)
                await _cacheService.SetAsync(cacheKey, dashboard, 2);

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar solicitação de dashboard do gerente");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
    }

    // DTOs específicos para os dashboards
    public class ClienteDashboardDto
    {
        public UserDto Usuario { get; set; } = new UserDto();
        public List<ContaDto> Contas { get; set; } = new List<ContaDto>();
        public decimal SaldoTotal { get; set; }
        public List<MovimentacaoDto> MovimentacoesRecentes { get; set; } = new List<MovimentacaoDto>();
    }

    public class GerenteDashboardDto
    {
        public int TotalClientes { get; set; }
        public int TotalContas { get; set; }
        public int ContasAtivas { get; set; }
        public int ContasInativas { get; set; }
        public decimal SaldoTotal { get; set; }
        public List<UserDto> Clientes { get; set; } = new List<UserDto>();
        public List<MovimentacaoDto> MovimentacoesRecentes { get; set; } = new List<MovimentacaoDto>();
    }
}
