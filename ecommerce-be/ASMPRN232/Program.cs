using ASMPRN232.Data;
using ASMPRN232.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger (Development Tools)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS: Allow any origin for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Password hashing will use BCrypt (no Identity registration required)

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "ChangeThisDevelopmentKeyToo";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ASMPRN232";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "ASMPRN232Clients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Run DB migrations and seed default admin user (development only)
using (var scope = app.Services.CreateScope())
{
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            // Apply migrations (if any)
            db.Database.Migrate();

            // Seed admin if not exists. Read credentials from env vars for safety.
            var adminEmail = Environment.GetEnvironmentVariable("SEED_ADMIN_EMAIL") ?? "admin@example.com";
            var adminPassword = Environment.GetEnvironmentVariable("SEED_ADMIN_PASSWORD") ?? "P@ssw0rd123";

            if (!db.Users.Any(u => u.Email == adminEmail))
            {
                var admin = new ASMPRN232.Models.User
                {
                    Email = adminEmail,
                    Role = "Admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword)
                };
                db.Users.Add(admin);
                db.SaveChanges();
            }
        }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

app.Run();