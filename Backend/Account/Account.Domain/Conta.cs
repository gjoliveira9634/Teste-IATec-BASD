using System;

namespace Account.Domain
{
    public enum StatusConta { ATIVA, INATIVA }

    public class Conta
    {
        public Guid Id { get; set; }
        public decimal Saldo { get; set; }
        public StatusConta Status { get; set; } = StatusConta.ATIVA;

        public void Inativar() => Status = StatusConta.INATIVA;
    }
}
