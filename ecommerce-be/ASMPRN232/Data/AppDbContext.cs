using ASMPRN232.Models;
using Microsoft.EntityFrameworkCore;

namespace ASMPRN232.Data
{
    public class AppDbContext :DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Định nghĩa độ chính xác cho Price
            modelBuilder.Entity<Product>()
                        .Property(p => p.Price)
                        .HasPrecision(18, 2); // 18 số tổng, 2 số thập phân
            modelBuilder.Entity<OrderItem>()
                        .HasOne<Order>()
                        .WithMany(o => o.Items)
                        .HasForeignKey(oi => oi.OrderId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                        .Property(o => o.TotalAmount)
                        .HasPrecision(18, 2);

            base.OnModelCreating(modelBuilder);
        }
    }



}
