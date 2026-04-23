using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Helpers;
namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.NguoiDungs
                .Include(u => u.MaVaiTroNavigation)
                .Select(u => new
                {
                    u.MaNguoiDung,
                    u.TenDangNhap,
                    u.Email,
                    u.HoTen,
                    u.TrangThai,
                    u.NgayTao,
                    RoleName = u.MaVaiTroNavigation.TenVaiTro
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.NguoiDungs
                .Include(u => u.MaVaiTroNavigation)
                .Include(u => u.QuanTriVien)
                .Include(u => u.GiaoVien)
                .Include(u => u.HocSinh)
                .Include(u => u.PhuHuynh)
                .FirstOrDefaultAsync(u => u.MaNguoiDung == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.MaNguoiDung,
                user.TenDangNhap,
                user.Email,
                user.HoTen,
                user.TrangThai,
                user.MaVaiTro,
                RoleName = user.MaVaiTroNavigation.TenVaiTro,
                // Include specific profile data if it exists
                AdminProfile = user.QuanTriVien,
                TeacherProfile = user.GiaoVien,
                StudentProfile = user.HocSinh,
                ParentProfile = user.PhuHuynh
            });
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<NguoiDung>> PostUser(UserCreateDto userDto)
        {
            // Check if username or email exists
            if (await _context.NguoiDungs.AnyAsync(u => u.TenDangNhap == userDto.TenDangNhap))
            {
                return BadRequest("Tên đăng nhập đã tồn tại.");
            }
            if (await _context.NguoiDungs.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest("Email đã tồn tại.");
            }
            var generatedSalt = Guid.NewGuid().ToString("N");
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.MatKhau);

            var newUser = new NguoiDung
            {
                TenDangNhap = userDto.TenDangNhap,
                Email = userDto.Email,
                MatKhau = hashedPassword,
                Salt = generatedSalt,
                HoTen = userDto.HoTen,
                MaVaiTro = userDto.MaVaiTro,
                AnhDaiDien = userDto.AnhDaiDien,
                TrangThai = userDto.TrangThai,
                NgayTao = DateTimeHelper.GetVietnamNow()
            };

            _context.NguoiDungs.Add(newUser);
            await _context.SaveChangesAsync(); // Save to get the new ID

            // Create corresponding profile based on role
            // 1: Admin, 2: Giao_Vien, 3: Phu_Huynh, 4: Hoc_Sinh
            switch (userDto.MaVaiTro)
            {
                case 1:
                    _context.QuanTriViens.Add(new QuanTriVien { MaNguoiDung = newUser.MaNguoiDung, PhongBan = userDto.PhongBan });
                    break;
                case 2:
                    _context.GiaoViens.Add(new GiaoVien { MaNguoiDung = newUser.MaNguoiDung, ChuyenMon = userDto.ChuyenMon });
                    break;
                case 3:
                    _context.PhuHuynhs.Add(new PhuHuynh { MaNguoiDung = newUser.MaNguoiDung, SoDienThoai = userDto.SoDienThoai });
                    break;
                case 4:
                    _context.HocSinhs.Add(new HocSinh { MaNguoiDung = newUser.MaNguoiDung, MaPhuHuynh = userDto.MaPhuHuynh, DiemTongApos = 0 });
                    break;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = newUser.MaNguoiDung }, new { newUser.MaNguoiDung, newUser.TenDangNhap });
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserCreateDto userDto)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Email = userDto.Email;
            user.HoTen = userDto.HoTen;
            user.MaVaiTro = userDto.MaVaiTro;
            user.TrangThai = userDto.TrangThai;

            // Only update password if provided
            if (!string.IsNullOrEmpty(userDto.MatKhau))
            {
                user.MatKhau = BCrypt.Net.BCrypt.HashPassword(userDto.MatKhau);
                user.Salt = Guid.NewGuid().ToString("N");
            }

            // Note: Updating role profiles (e.g., changing from Student to Admin) is complex and usually requires deleting old profile and creating new one.
            // For simplicity here, we only update basic user info. Further implementation for profile updates can be added here.

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.NguoiDungs.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.NguoiDungs.Any(e => e.MaNguoiDung == id);
        }
    }
}
