using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace BFF.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacoesController : ControllerBase
    {
        private readonly IHttpClientFactory _http;

        public MovimentacoesController(IHttpClientFactory http) => _http = http;

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] MovRequest req)
        {
            var client = _http.CreateClient("TransactionApi");
            var response = await client.PostAsJsonAsync("api/movimentacoes", req);
            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }

        [HttpGet("extrato/{contaId}")]
        public async Task<IActionResult> Extrato(Guid contaId, [FromQuery] DateTime de, [FromQuery] DateTime ate)
        {
            var client = _http.CreateClient("TransactionApi");
            var response = await client.GetAsync($"api/movimentacoes/extrato/{contaId}?de={de:o}&ate={ate:o}");
            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
    }

    public class MovRequest
    {
        public Guid ContaId { get; set; }
        public decimal Valor { get; set; }
        public string Tipo { get; set; }
    }
}
