using System;

namespace People.Messaging.Events
{
    public interface IPessoaEvent
    {
        Guid UsuarioId { get; }
        DateTime Timestamp { get; }
    }

    public class UsuarioCriadoEvent : IPessoaEvent
    {
        public Guid UsuarioId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Perfil { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
