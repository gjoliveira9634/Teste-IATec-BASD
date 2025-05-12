using System;

namespace Transaction.Messaging.Events
{
    public interface IMovimentacaoEvent
    {
        Guid MovimentacaoId { get; }
        Guid ContaId { get; }
        DateTime Timestamp { get; }
    }

    public class MovimentacaoCriadaEvent : IMovimentacaoEvent
    {
        public Guid MovimentacaoId { get; set; }
        public Guid ContaId { get; set; }
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
