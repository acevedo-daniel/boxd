using AutoMapper;
using e_commerce_api.Models;
using e_commerce_api.DTOs.Categories;

namespace e_commerce_api.Mappers
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, CategoryResponseDto>().ReverseMap();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>().ReverseMap();
        }
    }
}