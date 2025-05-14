using Microsoft.EntityFrameworkCore;
using People.Data;
using People.Messaging.Configuration;
// Adicionar para JWT
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using System.Text.Json.Serialization; // Adicionado para JsonStringEnumConverter

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration; // Para acesso fácil ao IConfiguration

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

// Adicionar Messaging com RabbitMQ
builder.Services.AddMessaging(builder.Configuration);

// Configuração do JWT
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
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
    };
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    }); // Configura a serialização de Enums como strings
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Ensure database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Seed data com Hashing
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.Usuarios.Any()) // Evitar duplicar dados
    {
        db.Usuarios.Add(new People.Domain.Usuario
        {
            Id = Guid.NewGuid(),
            Nome = "Cliente Teste",
            Email = "cliente@teste.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha"), // Hash da senha
            Perfil = People.Domain.PerfilAcesso.CLIENTE
        });
        db.Usuarios.Add(new People.Domain.Usuario
        {
            Id = Guid.NewGuid(),
            Nome = "Gerente Teste",
            Email = "gerente@teste.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha"), // Hash da senha
            Perfil = People.Domain.PerfilAcesso.GERENTE
        });
        db.SaveChanges();
    }
}

//if (app.Environment.IsDevelopment())
//{
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();
//}

app.UseCors();
app.UseAuthentication(); // Adicionar antes de UseAuthorization
app.UseAuthorization();

app.MapControllers();
app.Run();