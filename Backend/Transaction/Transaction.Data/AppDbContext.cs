using Microsoft.EntityFrameworkCore;
using Transaction.Domain;

namespace Transaction.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Movimentacao> Movimentacoes { get; set; }
    }
}
