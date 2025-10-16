using ASMPRN232.Data;
using ASMPRN232.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ASMPRN232.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst(ClaimTypes.Name);
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (sub == null) return Unauthorized();

            if (!int.TryParse(sub, out var userId)) return Unauthorized();

            var order = new Order
            {
                UserId = userId,
                Status = "pending",
                TotalAmount = 0m
            };

            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) return BadRequest(new { message = $"Product {item.ProductId} not found" });

                var oi = new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };
                order.Items.Add(oi);
                order.TotalAmount += oi.UnitPrice * oi.Quantity;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        [HttpGet("my")]
        public async Task<IActionResult> MyOrders()
        {
            var sub = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (sub == null) return Unauthorized();
            if (!int.TryParse(sub, out var userId)) return Unauthorized();

            var orders = await _context.Orders
                                .Include(o => o.Items)
                                .Where(o => o.UserId == userId)
                                .ToListAsync();

            return Ok(orders);
        }
    }

    public record PlaceOrderDto(List<PlaceOrderItemDto> Items);
    public record PlaceOrderItemDto(int ProductId, int Quantity);
}
