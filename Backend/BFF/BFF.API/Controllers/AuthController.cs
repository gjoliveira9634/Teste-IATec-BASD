using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BFF.API.Models;
using BFF.Cache;
using Microsoft.Extensions.Logging;
using System;

namespace BFF.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ICacheService _cacheService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IHttpClientFactory httpClientFactory,
            ICacheService cacheService,
            ILogger<AuthController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _cacheService = cacheService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("PeopleApi");
                var response = await client.PostAsJsonAsync("api/auth/login", req);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Falha de login para {Email}. StatusCode: {StatusCode}",
                        req.Email, response.StatusCode);
                    return Unauthorized(new { message = "Email ou senha inválidos" });
                }

                var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();

                if (loginResponse == null)
                {
                    _logger.LogError("Resposta de login nula ou inválida para {Email}", req.Email);
                    return StatusCode(500, new { message = "Erro ao processar resposta de login" });
                }

                // Armazena o token no cache com o userId como chave
                var cacheKey = $"user_token_{loginResponse.User.Id}";
                await _cacheService.SetAsync(cacheKey, loginResponse.Token, 480); // 8 horas

                return Ok(loginResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no processo de login para {Email}", req.Email);
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                // Obter o ID do usuário do token
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    // Remove o token do cache
                    var cacheKey = $"user_token_{userId}";
                    await _cacheService.RemoveAsync(cacheKey);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no processo de logout");
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
    }
}