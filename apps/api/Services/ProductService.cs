using AutoMapper;
using e_commerce_api.Models;
using e_commerce_api.Interfaces;
using e_commerce_api.DTOs.Products;
using e_commerce_api.DTOs.Common;

namespace e_commerce_api.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<PaginatedResponseDto<ProductResponseDto>> GetProductsPaginatedAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _productRepository.GetCountAsync();
            var products = await _productRepository.GetPaginatedAsync(pageNumber, pageSize);
            
            var productDtos = _mapper.Map<IEnumerable<ProductResponseDto>>(products);
            
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            
            return new PaginatedResponseDto<ProductResponseDto>
            {
                Items = productDtos.ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasPreviousPage = pageNumber > 1,
                HasNextPage = pageNumber < totalPages
            };
        }

        public async Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductResponseDto>>(products);
        }

        public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetProductWithCategoryAsync(id);
            return _mapper.Map<ProductResponseDto>(product);
        }

        public async Task<ProductResponseDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            var categoryExists = await _categoryRepository.GetByIdAsync(createProductDto.CategoryId);
            if (categoryExists == null)
            {
                throw new ArgumentException($"La categoría con ID {createProductDto.CategoryId} no existe.");
            }

            var product = _mapper.Map<Product>(createProductDto);

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            var createdProductWithRelations = await _productRepository.GetProductWithCategoryAsync(product.Id);

            return _mapper.Map<ProductResponseDto>(createdProductWithRelations);
        }

        public async Task UpdateProductAsync(UpdateProductDto updateProductDto)
        {
            var existingProduct = await _productRepository.GetByIdAsync(updateProductDto.Id);
            if (existingProduct == null)
            {
                throw new KeyNotFoundException($"Producto con ID {updateProductDto.Id} no encontrado");
            }

            // Validar que la CategoryId exista
            var categoryExists = await _categoryRepository.GetByIdAsync(updateProductDto.CategoryId);
            if (categoryExists == null)
            {
                throw new ArgumentException($"La categoría con ID {updateProductDto.CategoryId} no existe.");
            }

            // Mapear DTO de actualización a la entidad existente
            _mapper.Map(updateProductDto, existingProduct);

            _productRepository.Update(existingProduct);
            await _productRepository.SaveChangesAsync();
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                throw new KeyNotFoundException($"Producto con ID {id} no encontrado");
            }

            _productRepository.Remove(product);
            await _productRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductResponseDto>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _productRepository.GetProductsByCategoryAsync(categoryId);
            return _mapper.Map<IEnumerable<ProductResponseDto>>(products);
        }
    }
}