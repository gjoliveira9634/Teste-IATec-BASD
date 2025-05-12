using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace BFF.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContasController : ControllerBase
    {
        private readonly IHttpClientFactory _http;

        public ContasController(IHttpClientFactory http) => _http = http;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var client = _http.CreateClient("AccountApi");
            var response = await client.GetAsync("api/contas");
            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }

        [HttpPost("inativar/{id}")]
        public async Task<IActionResult> Inativar(Guid id)
        {
            var client = _http.CreateClient("AccountApi");
            var response = await client.PostAsync($"api/contas/inativar/{id}", null);
            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
            return NoContent();
        }
    }
}