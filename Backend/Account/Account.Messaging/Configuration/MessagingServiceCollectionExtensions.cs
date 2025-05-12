using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Messaging.Configuration
{
    public static class MessagingServiceCollectionExtensions
    {
        public static IServiceCollection AddMessaging(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddMassTransit(config =>
            {
                // Registrar componentes
                config.SetKebabCaseEndpointNameFormatter();

                config.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(configuration["RabbitMQ:Host"], "/", host =>
                    {
                        host.Username(configuration["RabbitMQ:Username"] ?? "guest");
                        host.Password(configuration["RabbitMQ:Password"] ?? "guest");
                    });

                    // Configuração automática dos endpoints
                    cfg.ConfigureEndpoints(context);
                });
            });

            return services;
        }
    }
}
