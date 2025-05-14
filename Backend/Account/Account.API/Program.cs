using Microsoft.EntityFrameworkCore;
using Account.Data;
using Account.Messaging.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Usar PostgreSQL
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adicionar Messaging com RabbitMQ
builder.Services.AddMessaging(builder.Configuration);

// Configuração JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Garantir banco de dados e seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    if (!db.Contas.Any())
    {
        db.Contas.Add(new Account.Domain.Conta { Id = Guid.NewGuid(), Saldo = 1000 });
        db.Contas.Add(new Account.Domain.Conta { Id = Guid.NewGuid(), Saldo = 500 });
        db.SaveChanges();
    }
}


// Documentação das rotas pelo swagger
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();


app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();