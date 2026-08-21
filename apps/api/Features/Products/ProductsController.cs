using Boxd.Api.Features.Products.Contracts;
using Boxd.Api.Features.Auth.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Boxd.Api.Features.Products;

[Route("api/[controller]")]
[ApiController]
public sealed class ProductsController(ProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponseDto<ProductResponseDto>>> GetProducts([FromQuery] PaginationDto pagination)
    {
        var result = await productService.GetProductsPaginatedAsync(pagination.PageNumber, pagination.PageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
    {
        var product = await productService.GetProductByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.AdministratorOnly)]
    public async Task<ActionResult<ProductResponseDto>> PostProduct([FromBody] CreateProductDto createProductDto)
    {
        try
        {
            var product = await productService.CreateProductAsync(createProductDto);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Policy = AuthorizationPolicies.AdministratorOnly)]
    public async Task<IActionResult> PutProduct(int id, [FromBody] UpdateProductDto updateProductDto)
    {
        if (id != updateProductDto.Id)
        {
            return BadRequest();
        }

        try
        {
            await productService.UpdateProductAsync(updateProductDto);
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
    [Authorize(Policy = AuthorizationPolicies.AdministratorOnly)]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            await productService.DeleteProductAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
