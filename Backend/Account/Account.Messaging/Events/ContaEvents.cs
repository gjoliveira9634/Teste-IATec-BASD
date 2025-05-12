using System;

namespace Account.Messaging.Events
{
    public interface IContaEvent
    {
        Guid ContaId { get; }
        DateTime Timestamp { get; }
    }

    public class ContaCriadaEvent : IContaEvent
    {
        public Guid ContaId { get; set; }
        public Guid UsuarioId { get; set; }
        public decimal SaldoInicial { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class ContaInativadaEvent : IContaEvent
    {
        public Guid ContaId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class ContaRemovidaEvent : IContaEvent
    {
        public Guid ContaId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
