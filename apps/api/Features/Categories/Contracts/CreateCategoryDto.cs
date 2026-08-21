namespace Boxd.Api.Features.Categories.Contracts
{
    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}