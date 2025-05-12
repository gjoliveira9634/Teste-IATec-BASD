using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BFF.API.Handlers
{
    public class AuthMessageHandler : DelegatingHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthMessageHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            // Obter o token do cabeçalho de autorização do request original
            var authHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();

            // Se existir, propagar para o request para a API
            if (!string.IsNullOrEmpty(authHeader))
            {
                request.Headers.Add("Authorization", authHeader);
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
