using Boxd.Api.Data;
using Boxd.Api.Features.Categories.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Boxd.Api.Features.Categories;

public sealed class CategoryService(ApplicationDbContext context)
{
    public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync()
    {
        var categories = await context.Categories.ToListAsync();
        return categories.Select(ToResponse).ToList();
    }

    public async Task<CategoryResponseDto?> GetCategoryByIdAsync(int id)
    {
        var category = await context.Categories.FindAsync(id);
        return category is null ? null : ToResponse(category);
    }

    public async Task<CategoryResponseDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
    {
        var category = new Category
        {
            Name = createCategoryDto.Name,
            Description = createCategoryDto.Description
        };

        context.Categories.Add(category);
        await context.SaveChangesAsync();
        return ToResponse(category);
    }

    public async Task UpdateCategoryAsync(UpdateCategoryDto updateCategoryDto)
    {
        var category = await context.Categories.FindAsync(updateCategoryDto.Id);
        if (category is null)
        {
            throw new KeyNotFoundException($"Categoría con ID {updateCategoryDto.Id} no encontrada");
        }

        category.Name = updateCategoryDto.Name;
        category.Description = updateCategoryDto.Description;
        await context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category is null)
        {
            throw new KeyNotFoundException($"Categoría con ID {id} no encontrada");
        }

        context.Categories.Remove(category);
        await context.SaveChangesAsync();
    }

    private static CategoryResponseDto ToResponse(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        Description = category.Description
    };
}
