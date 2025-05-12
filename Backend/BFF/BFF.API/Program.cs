using BFF.Cache;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Redis Cache
builder.Services.AddRedisCache(builder.Configuration);

// Configuração JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

// HttpContextAccessor para o AuthMessageHandler
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<BFF.API.Handlers.AuthMessageHandler>();

// HttpClients
builder.Services.AddHttpClient("PeopleApi", client =>
{
    client.BaseAddress = new Uri(builder.Configuration.GetValue<string>("PeopleApiUrl") ?? "http://people-api:80");
}).AddHttpMessageHandler<BFF.API.Handlers.AuthMessageHandler>();

builder.Services.AddHttpClient("AccountApi", client =>
{
    client.BaseAddress = new Uri(builder.Configuration.GetValue<string>("AccountApiUrl") ?? "http://account-api:80");
}).AddHttpMessageHandler<BFF.API.Handlers.AuthMessageHandler>();

builder.Services.AddHttpClient("TransactionApi", client =>
{
    client.BaseAddress = new Uri(builder.Configuration.GetValue<string>("TransactionApiUrl") ?? "http://transaction-api:80");
}).AddHttpMessageHandler<BFF.API.Handlers.AuthMessageHandler>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt => opt.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();