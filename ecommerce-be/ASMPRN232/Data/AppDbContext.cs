using ASMPRN232.Models;
using Microsoft.EntityFrameworkCore;

namespace ASMPRN232.Data
{
    public class AppDbContext :DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Định nghĩa độ chính xác cho Price
            modelBuilder.Entity<Product>()
                        .Property(p => p.Price)
                        .HasPrecision(18, 2); // 18 số tổng, 2 số thập phân

            base.OnModelCreating(modelBuilder);
        }
    }



}
