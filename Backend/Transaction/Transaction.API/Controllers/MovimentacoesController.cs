using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Transaction.Data;
using Transaction.Domain;
using Transaction.Messaging.Events;
using MassTransit;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Transaction.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MovimentacoesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPublishEndpoint _publishEndpoint;

        public MovimentacoesController(AppDbContext db, IPublishEndpoint publishEndpoint)
        {
            _db = db;
            _publishEndpoint = publishEndpoint;
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] MovimentacaoRequest req)
        {
            var movimentacao = new Movimentacao
            {
                Id = Guid.NewGuid(),
                ContaId = req.ContaId,
                Valor = req.Valor,
                Tipo = req.Tipo,
                Data = DateTime.UtcNow
            };

            _db.Movimentacoes.Add(movimentacao);
            await _db.SaveChangesAsync();

            // Publicar evento de movimentação criada
            await _publishEndpoint.Publish(new MovimentacaoCriadaEvent
            {
                MovimentacaoId = movimentacao.Id,
                ContaId = movimentacao.ContaId,
                Valor = movimentacao.Valor,
                Tipo = movimentacao.Tipo.ToString(),
                Data = movimentacao.Data
            });

            return CreatedAtAction(nameof(GetByConta), new { contaId = movimentacao.ContaId }, movimentacao);
        }
        [HttpGet("extrato/{contaId}")]
        public IActionResult GetByConta(Guid contaId, [FromQuery] DateTime? de = null, [FromQuery] DateTime? ate = null)
        {
            var dataInicio = de ?? DateTime.UtcNow.AddMonths(-1);
            var dataFim = ate ?? DateTime.UtcNow;

            var movs = _db.Movimentacoes
                .Where(m => m.ContaId == contaId && m.Data >= dataInicio && m.Data <= dataFim)
                .OrderByDescending(m => m.Data)
                .ToList();

            return Ok(movs);
        }

        [HttpGet("recentes")]
        [Authorize(Roles = "GERENTE")]
        public IActionResult GetRecentes([FromQuery] DateTime? de = null, [FromQuery] DateTime? ate = null)
        {
            var dataInicio = de ?? DateTime.UtcNow.AddDays(-7); // Uma semana por padrão
            var dataFim = ate ?? DateTime.UtcNow;

            var movs = _db.Movimentacoes
                .Where(m => m.Data >= dataInicio && m.Data <= dataFim)
                .OrderByDescending(m => m.Data)
                .Take(100) // Limitar a 100 movimentações
                .ToList();

            return Ok(movs);
        }
    }

    public class MovimentacaoRequest
    {
        public Guid ContaId { get; set; }
        public decimal Valor { get; set; }
        public TipoMovimentacao Tipo { get; set; }
    }
}
}