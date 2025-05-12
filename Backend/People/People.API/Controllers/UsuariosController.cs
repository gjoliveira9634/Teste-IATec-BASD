using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using People.Data;
using People.Domain;
using People.Messaging.Events;
using MassTransit;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace People.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPublishEndpoint _publishEndpoint;

        public UsuariosController(AppDbContext db, IPublishEndpoint publishEndpoint)
        {
            _db = db;
            _publishEndpoint = publishEndpoint;
        }

        [HttpGet]
        [Authorize(Roles = "GERENTE")]
        public IActionResult GetAll()
        {
            // Retornar lista de usuários sem a senha
            var usuarios = _db.Usuarios.Select(u => new { u.Id, u.Nome, u.Email, u.Perfil }).ToList();
            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var usuario = _db.Usuarios.Find(id);
            if (usuario == null) return NotFound();

            // Retornar sem a senha
            return Ok(new { usuario.Id, usuario.Nome, usuario.Email, usuario.Perfil });
        }

        [HttpPost]
        [Authorize(Roles = "GERENTE")]
        public async Task<IActionResult> Criar([FromBody] CriarUsuarioRequest req)
        {
            // Verificar se o email já existe
            if (_db.Usuarios.Any(u => u.Email == req.Email))
                return BadRequest(new { message = "Email já cadastrado" });

            var usuario = new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = req.Nome,
                Email = req.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(req.Senha),
                Perfil = req.Perfil
            };

            _db.Usuarios.Add(usuario);
            await _db.SaveChangesAsync();

            // Publicar evento
            await _publishEndpoint.Publish(new UsuarioCriadoEvent
            {
                UsuarioId = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Perfil = usuario.Perfil.ToString()
            });

            return CreatedAtAction(nameof(GetById), new { id = usuario.Id },
                new { usuario.Id, usuario.Nome, usuario.Email, usuario.Perfil });
        }
    }

    public class CriarUsuarioRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public PerfilAcesso Perfil { get; set; } = PerfilAcesso.CLIENTE;
    }
}
