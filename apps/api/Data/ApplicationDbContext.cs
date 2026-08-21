
using e_commerce_api.Models;
using Microsoft.EntityFrameworkCore;

namespace e_commerce_api.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<QrToken> QrTokens { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(p => p.Name).IsRequired().HasMaxLength(100);
                entity.Property(p => p.Description).HasMaxLength(1000);
                entity.Property(p => p.Price).IsRequired().HasColumnType("decimal(18,2)");
                entity.Property(p => p.Stock);
                entity.Property(p => p.ImageUrl).HasMaxLength(500);
                entity.HasOne(p => p.Category)
                    .WithMany()
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Description).HasMaxLength(500);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.PasswordSalt).IsRequired();
                entity.Property(u => u.Role).IsRequired().HasMaxLength(20);
            });

            modelBuilder.Entity<QrToken>(entity =>
            {
                entity.HasIndex(qt => qt.Token).IsUnique();
                entity.Property(qt => qt.Token).IsRequired().HasMaxLength(255);
                entity.Property(qt => qt.ExpiresAt).IsRequired();
                entity.Property(qt => qt.IsUsed).IsRequired();
            });

            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.HasIndex(t => t.Token).IsUnique();
                entity.Property(t => t.Token).IsRequired().HasMaxLength(255);
                entity.Property(t => t.ExpiresAt).IsRequired();
                entity.Property(t => t.IsUsed).IsRequired();
                entity.HasOne(t => t.User)
                    .WithMany()
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}