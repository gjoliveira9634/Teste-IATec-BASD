using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Account.Data;
using Account.Domain;
using Account.Messaging.Events;
using MassTransit;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Account.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContasController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPublishEndpoint _publishEndpoint;

        public ContasController(AppDbContext db, IPublishEndpoint publishEndpoint)
        {
            _db = db;
            _publishEndpoint = publishEndpoint;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_db.Contas.Select(c => new { c.Id, c.Saldo, c.Status }));
        }

        [HttpGet("usuario/{usuarioId}")]
        public IActionResult GetByUsuario(Guid usuarioId)
        {
            var contas = _db.ContasUsuarios
                .Where(cu => cu.UsuarioId == usuarioId)
                .Join(_db.Contas,
                      cu => cu.ContaId,
                      c => c.Id,
                      (cu, c) => new { c.Id, c.Saldo, c.Status })
                .ToList();

            return Ok(contas);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var conta = _db.Contas.Find(id);
            if (conta == null) return NotFound();
            return Ok(new { conta.Id, conta.Saldo, conta.Status });
        }
        [HttpPost]
        [Authorize(Roles = "GERENTE")]
        public async Task<IActionResult> Criar([FromBody] CriarContaRequest request)
        {
            var novaConta = new Conta
            {
                Id = Guid.NewGuid(),
                Saldo = request.SaldoInicial,
                Status = StatusConta.ATIVA
            };

            _db.Contas.Add(novaConta);

            // Criar relação entre conta e usuário
            var contaUsuario = new ContaUsuario
            {
                ContaId = novaConta.Id,
                UsuarioId = request.UsuarioId
            };

            _db.ContasUsuarios.Add(contaUsuario);
            await _db.SaveChangesAsync();

            // Publicar evento
            await _publishEndpoint.Publish(new ContaCriadaEvent
            {
                ContaId = novaConta.Id,
                UsuarioId = request.UsuarioId,
                SaldoInicial = request.SaldoInicial
            });

            return CreatedAtAction(nameof(GetById), new { id = novaConta.Id }, new { novaConta.Id, novaConta.Saldo, novaConta.Status });
        }

        [HttpPost("inativar/{id}")]
        [Authorize(Roles = "GERENTE")]
        public async Task<IActionResult> Inativar(Guid id)
        {
            var conta = _db.Contas.Find(id);
            if (conta == null) return NotFound();

            if (conta.Saldo != 0)
            {
                conta.Inativar();
                await _db.SaveChangesAsync();

                // Publicar evento de inativação
                await _publishEndpoint.Publish(new ContaInativadaEvent { ContaId = conta.Id });
                return NoContent();
            }
            else
            {
                _db.Contas.Remove(conta);
                await _db.SaveChangesAsync();

                // Publicar evento de remoção
                await _publishEndpoint.Publish(new ContaRemovidaEvent { ContaId = conta.Id });
                return NoContent();
            }
        }
    }
    public class CriarContaRequest
    {
        public Guid UsuarioId { get; set; }
        public decimal SaldoInicial { get; set; } = 0;
    }
}