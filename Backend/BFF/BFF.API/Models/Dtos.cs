namespace BFF.API.Models
{
    // DTOs para autenticação
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public UserDto User { get; set; } = new UserDto();
        public string Token { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Perfil { get; set; } = string.Empty;
    }

    // DTOs para conta
    public class ContaDto
    {
        public Guid Id { get; set; }
        public decimal Saldo { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class CriarContaRequest
    {
        public Guid UsuarioId { get; set; }
        public decimal SaldoInicial { get; set; }
    }

    // DTOs para movimentação
    public class MovimentacaoDto
    {
        public Guid Id { get; set; }
        public DateTime Data { get; set; }
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public Guid ContaId { get; set; }
    }

    public class CriarMovimentacaoRequest
    {
        public Guid ContaId { get; set; }
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = string.Empty;
    }
}
