using Boxd.Api.Features.Categories.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Boxd.Api.Features.Categories;

[Route("api/[controller]")]
[ApiController]
public sealed class CategoriesController(CategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponseDto>>> GetCategories()
    {
        var categories = await categoryService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryResponseDto>> GetCategory(int id)
    {
        var category = await categoryService.GetCategoryByIdAsync(id);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CategoryResponseDto>> PostCategory([FromBody] CreateCategoryDto createCategoryDto)
    {
        try
        {
            var category = await categoryService.CreateCategoryAsync(createCategoryDto);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> PutCategory(int id, [FromBody] UpdateCategoryDto updateCategoryDto)
    {
        if (id != updateCategoryDto.Id)
        {
            return BadRequest();
        }

        try
        {
            await categoryService.UpdateCategoryAsync(updateCategoryDto);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        try
        {
            await categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
