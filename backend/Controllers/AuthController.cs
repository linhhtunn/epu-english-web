using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Helpers;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthController(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginData)
        {
            if (string.IsNullOrWhiteSpace(loginData.Email) || string.IsNullOrWhiteSpace(loginData.Password))
            {
                return BadRequest(new { message = "Email và mật khẩu không được để trống." });
            }

            // 1. Tìm người dùng và nạp bảng VaiTro
            var user = await _context.NguoiDungs
                .Include(u => u.MaVaiTroNavigation)
                .FirstOrDefaultAsync(u => u.Email == loginData.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            var passwordValid = user.MatKhau == loginData.Password;
            if (!passwordValid && user.MatKhau.StartsWith("$2"))
            {
                passwordValid = BCrypt.Net.BCrypt.Verify(loginData.Password, user.MatKhau);
            }

            if (!passwordValid)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            // 2. Lấy Role Name (Ví dụ: "Admin", "Hoc_Sinh", "Giao_Vien")
            string roleName = user.MaVaiTroNavigation?.TenVaiTro ?? "User";

            // 3. Tìm ProfileID tương ứng để Frontend dùng gọi API dữ liệu
            var profileId = await ResolveProfileIdAsync(user.MaNguoiDung, roleName);

            var (token, expiresAtUtc) = _jwtHelper.GenerateToken(user, roleName, profileId);

            // 4. Trả về Object đầy đủ cho React
            user.LanDangNhapCuoi = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = user.MaNguoiDung,
                username = user.TenDangNhap,
                email = user.Email,
                fullName = user.HoTen,
                role = roleName,
                profileId,
                token,
                tokenType = "Bearer",
                expiresAt = expiresAtUtc
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentSession()
        {
            var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue("userId")
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Token không hợp lệ." });
            }

            var user = await _context.NguoiDungs
                .Include(u => u.MaVaiTroNavigation)
                .FirstOrDefaultAsync(u => u.MaNguoiDung == userId);

            if (user == null)
            {
                return Unauthorized(new { message = "Không tìm thấy người dùng." });
            }

            var roleName = user.MaVaiTroNavigation?.TenVaiTro ?? "User";
            var profileIdClaim = User.FindFirstValue("profileId");
            var profileId = int.TryParse(profileIdClaim, out var parsedProfileId)
                ? parsedProfileId
                : await ResolveProfileIdAsync(user.MaNguoiDung, roleName);

            return Ok(new
            {
                id = user.MaNguoiDung,
                username = user.TenDangNhap,
                email = user.Email,
                fullName = user.HoTen,
                role = roleName,
                profileId
            });
        }

        private async Task<int?> ResolveProfileIdAsync(int userId, string roleName)
        {
            if (roleName == "Hoc_Sinh")
            {
                var hs = await _context.HocSinhs.FirstOrDefaultAsync(h => h.MaNguoiDung == userId);
                return hs?.MaHocSinh;
            }

            if (roleName == "Giao_Vien")
            {
                var gv = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
                return gv?.MaGiaoVien;
            }

            if (roleName == "Phu_Huynh")
            {
                var ph = await _context.PhuHuynhs.FirstOrDefaultAsync(p => p.MaNguoiDung == userId);
                return ph?.MaPhuHuynh;
            }

            if (roleName == "Admin")
            {
                var admin = await _context.QuanTriViens.FirstOrDefaultAsync(a => a.MaNguoiDung == userId);
                return admin?.MaQuanTri;
            }

            return null;
        }
    }
}