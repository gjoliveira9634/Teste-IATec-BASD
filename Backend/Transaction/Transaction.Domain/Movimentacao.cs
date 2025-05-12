using System;

namespace Transaction.Domain
{
    public enum TipoMovimentacao { DEPOSITO, SAQUE, TRANSFERENCIA }

    public class Movimentacao
    {
        public Guid Id { get; set; }
        public DateTime Data { get; set; } = DateTime.UtcNow;
        public decimal Valor { get; set; }
        public TipoMovimentacao Tipo { get; set; }
        public Guid ContaId { get; set; }
    }
}
