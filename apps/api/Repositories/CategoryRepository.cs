using e_commerce_api.Data;
using e_commerce_api.Models;
using e_commerce_api.Interfaces;

namespace e_commerce_api.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}