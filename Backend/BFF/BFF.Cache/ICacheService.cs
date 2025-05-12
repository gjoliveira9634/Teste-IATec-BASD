using System.Threading.Tasks;

namespace BFF.Cache
{
    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key) where T : class;
        Task SetAsync<T>(string key, T value, int ttlMinutes = 10) where T : class;
        Task RemoveAsync(string key);
    }
}
