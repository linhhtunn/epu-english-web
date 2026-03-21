using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy => {
        policy.WithOrigins("http://localhost:3000") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. Lấy chuỗi kết nối
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 3. Thiết lập kết nối MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// 4. Cấu hình Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Quản Lý Trung Tâm API",
        Version = "v1",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Support Team"
        }
    });
});

var app = builder.Build();
// --- THỨ TỰ MIDDLEWARE RẤT QUAN TRỌNG ---S

// 5. Kích hoạt Swagger (cho cả Development và Production)
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Quản Lý Trung Tâm API v1");
    options.RoutePrefix = "swagger"; // Truy cập tại: http://localhost:PORT/swagger
});

// 6. Kích hoạt CORS (Phải nằm ở đầu để xử lý các request Pre-flight)
app.UseCors("AllowReactApp");


app.UseRouting(); 
app.UseAuthorization();

// 7. Cấu hình Route
app.MapControllers();

app.Run();
