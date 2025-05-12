using Microsoft.EntityFrameworkCore;
using Account.Domain;

namespace Account.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Conta> Contas { get; set; }
        public DbSet<ContaUsuario> ContasUsuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar a chave composta para ContaUsuario
            modelBuilder.Entity<ContaUsuario>()
                .HasKey(cu => new { cu.ContaId, cu.UsuarioId });

            // Configurar índice para pesquisa rápida por usuário
            modelBuilder.Entity<ContaUsuario>()
                .HasIndex(cu => cu.UsuarioId);
        }
    }
}
