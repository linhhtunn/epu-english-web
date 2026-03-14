using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginData)
        {
            // 1. Tìm người dùng và nạp bảng VaiTro
            var user = await _context.NguoiDungs
                .Include(u => u.MaVaiTroNavigation)
                .FirstOrDefaultAsync(u => u.Email == loginData.Email && u.MatKhau == loginData.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            // 2. Lấy Role Name (Ví dụ: "Admin", "Hoc_Sinh", "Giao_Vien")
            string roleName = user.MaVaiTroNavigation?.TenVaiTro ?? "User";

            // 3. Tìm ProfileID tương ứng để Frontend dùng gọi API dữ liệu
            int? profileId = null;
            if (roleName == "Hoc_Sinh")
            {
                var hs = await _context.HocSinhs.FirstOrDefaultAsync(h => h.MaNguoiDung == user.MaNguoiDung);
                profileId = hs?.MaHocSinh;
            }
            else if (roleName == "Giao_Vien")
            {
                var gv = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == user.MaNguoiDung);
                profileId = gv?.MaGiaoVien;
            }

            // 4. Trả về Object đầy đủ cho React
            return Ok(new
            {
                id = user.MaNguoiDung,
                fullName = user.HoTen,
                role = roleName, 
                profileId = profileId, // Cực kỳ quan trọng cho Dashboard
                token = "dummy_token_" + Guid.NewGuid().ToString() // Sau này thay bằng JWT
            });
        }
    }

    public class LoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}