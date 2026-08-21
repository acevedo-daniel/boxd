using Boxd.Api.Data;
using Boxd.Api.Features.Categories.Contracts;
using Boxd.Api.Features.Products.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Boxd.Api.Features.Products;

public sealed class ProductService(ApplicationDbContext context)
{
    public async Task<PaginatedResponseDto<ProductResponseDto>> GetProductsPaginatedAsync(int pageNumber, int pageSize)
    {
        var totalCount = await context.Products.CountAsync();
        var products = await context.Products
            .Include(product => product.Category)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        return new PaginatedResponseDto<ProductResponseDto>
        {
            Items = products.Select(ToResponse).ToList(),
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
        var products = await context.Products.ToListAsync();
        return products.Select(ToResponse).ToList();
    }

    public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
    {
        var product = await context.Products
            .Include(product => product.Category)
            .FirstOrDefaultAsync(product => product.Id == id);

        return product is null ? null : ToResponse(product);
    }

    public async Task<ProductResponseDto> CreateProductAsync(CreateProductDto createProductDto)
    {
        var categoryExists = await context.Categories.FindAsync(createProductDto.CategoryId);
        if (categoryExists is null)
        {
            throw new ArgumentException($"La categoría con ID {createProductDto.CategoryId} no existe.");
        }

        var product = new Product
        {
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            Price = createProductDto.Price,
            Stock = createProductDto.Stock,
            ImageUrl = createProductDto.ImageUrl,
            CategoryId = createProductDto.CategoryId
        };

        context.Products.Add(product);
        await context.SaveChangesAsync();

        var createdProductWithRelations = await context.Products
            .Include(createdProduct => createdProduct.Category)
            .FirstAsync(createdProduct => createdProduct.Id == product.Id);

        return ToResponse(createdProductWithRelations);
    }

    public async Task UpdateProductAsync(UpdateProductDto updateProductDto)
    {
        var existingProduct = await context.Products.FindAsync(updateProductDto.Id);
        if (existingProduct is null)
        {
            throw new KeyNotFoundException($"Producto con ID {updateProductDto.Id} no encontrado");
        }

        var categoryExists = await context.Categories.FindAsync(updateProductDto.CategoryId);
        if (categoryExists is null)
        {
            throw new ArgumentException($"La categoría con ID {updateProductDto.CategoryId} no existe.");
        }

        existingProduct.Name = updateProductDto.Name;
        existingProduct.Description = updateProductDto.Description;
        existingProduct.Price = updateProductDto.Price;
        existingProduct.Stock = updateProductDto.Stock;
        existingProduct.ImageUrl = updateProductDto.ImageUrl;
        existingProduct.CategoryId = updateProductDto.CategoryId;

        await context.SaveChangesAsync();
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product is null)
        {
            throw new KeyNotFoundException($"Producto con ID {id} no encontrado");
        }

        context.Products.Remove(product);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ProductResponseDto>> GetProductsByCategoryAsync(int categoryId)
    {
        var products = await context.Products
            .Where(product => product.CategoryId == categoryId)
            .ToListAsync();

        return products.Select(ToResponse).ToList();
    }

    private static ProductResponseDto ToResponse(Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price,
        Stock = product.Stock,
        ImageUrl = product.ImageUrl,
        CategoryId = product.CategoryId,
        Category = product.Category is null
            ? null
            : new CategoryResponseDto
            {
                Id = product.Category.Id,
                Name = product.Category.Name,
                Description = product.Category.Description
            }
    };
}
