using e_commerce_api.Models;

namespace e_commerce_api.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<int> GetCountAsync();
        Task<IEnumerable<Product>> GetPaginatedAsync(int pageNumber, int pageSize);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
        Task<Product?> GetProductWithCategoryAsync(int id);
    }
}