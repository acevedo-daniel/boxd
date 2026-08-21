using e_commerce_api.DTOs.Products;
using e_commerce_api.DTOs.Common;

namespace e_commerce_api.Interfaces
{
    public interface IProductService
    {
        Task<PaginatedResponseDto<ProductResponseDto>> GetProductsPaginatedAsync(int pageNumber, int pageSize);
        Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync();
        Task<ProductResponseDto?> GetProductByIdAsync(int id);
        Task<ProductResponseDto> CreateProductAsync(CreateProductDto createProductDto);
        Task UpdateProductAsync(UpdateProductDto updateProductDto);
        Task DeleteProductAsync(int id);
        Task<IEnumerable<ProductResponseDto>> GetProductsByCategoryAsync(int categoryId);
    }
} 