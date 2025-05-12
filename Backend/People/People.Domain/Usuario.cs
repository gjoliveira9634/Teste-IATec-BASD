using System;

namespace People.Domain
{
    public enum PerfilAcesso { CLIENTE, GERENTE }

    public class Usuario
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string SenhaHash { get; set; }
        public PerfilAcesso Perfil { get; set; }
    }
}