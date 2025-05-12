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

namespace BFF.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ICacheService _cacheService;
        private readonly ILogger<UsuariosController> _logger;

        public UsuariosController(
            IHttpClientFactory httpClientFactory,
            ICacheService cacheService,
            ILogger<UsuariosController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _cacheService = cacheService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "GERENTE")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Tenta obter do cache primeiro
                var cacheKey = "usuarios_all";
                var cachedResult = await _cacheService.GetAsync<List<UserDto>>(cacheKey);

                if (cachedResult != null)
                {
                    return Ok(cachedResult);
                }

                // Se não estiver no cache, busca da API
                var client = _httpClientFactory.CreateClient("PeopleApi");
                var response = await client.GetAsync("api/usuarios");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Erro ao obter usuários: {StatusCode}", response.StatusCode);
                    return StatusCode((int)response.StatusCode, new { message = "Erro ao obter usuários" });
                }

                var usuarios = await response.Content.ReadFromJsonAsync<List<UserDto>>();

                // Armazena no cache por 5 minutos
                await _cacheService.SetAsync(cacheKey, usuarios, 5);

                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar solicitação de lista de usuários");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                // Verificar se o usuário atual pode acessar este perfil
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
                var userRole = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

                if (userId != id.ToString() && userRole != "GERENTE")
                {
                    return Forbid();
                }

                // Tenta obter do cache primeiro
                var cacheKey = $"usuario_{id}";
                var cachedResult = await _cacheService.GetAsync<UserDto>(cacheKey);

                if (cachedResult != null)
                {
                    return Ok(cachedResult);
                }

                // Se não estiver no cache, busca da API
                var client = _httpClientFactory.CreateClient("PeopleApi");
                var response = await client.GetAsync($"api/usuarios/{id}");

                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Erro ao obter usuário {Id}: {StatusCode}", id, response.StatusCode);
                    return StatusCode((int)response.StatusCode, new { message = "Erro ao obter detalhes do usuário" });
                }

                var usuario = await response.Content.ReadFromJsonAsync<UserDto>();

                // Armazena no cache por 5 minutos
                await _cacheService.SetAsync(cacheKey, usuario, 5);

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar solicitação de detalhes do usuário {Id}", id);
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "GERENTE")]
        public async Task<IActionResult> Criar([FromBody] CriarUsuarioRequest request)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("PeopleApi");
                var response = await client.PostAsJsonAsync("api/usuarios", request);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Erro ao criar usuário: {StatusCode}, {Error}", response.StatusCode, error);
                    return StatusCode((int)response.StatusCode, new { message = "Erro ao criar usuário", error });
                }

                var result = await response.Content.ReadFromJsonAsync<UserDto>();

                // Invalidar cache
                await _cacheService.RemoveAsync("usuarios_all");

                return Created($"/api/usuarios/{result?.Id}", result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar solicitação de criação de usuário");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
    }

    public class CriarUsuarioRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string Perfil { get; set; } = string.Empty;
    }
}
