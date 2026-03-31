using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Thống kê tổng quát cho Admin Dashboard.
        /// GET: api/Admin/stats
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var tongHocSinh = await _context.HocSinhs.CountAsync();
            var tongGiaoVien = await _context.GiaoViens.CountAsync();
            var tongKhoaHoc = await _context.KhoaHocs.CountAsync();
            var tongLopHoc = await _context.LopHocs.CountAsync();
            var lopHomNay = await _context.BuoiHocs.CountAsync(b => b.NgayHoc == today);
            var tongNguoiDung = await _context.NguoiDungs.CountAsync();

            // Lớp học hôm nay chưa điểm danh
            var chuaDiemDanh = await _context.BuoiHocs
                .Where(b => b.NgayHoc == today)
                .CountAsync(b => !b.DiemDanhs.Any());

            return Ok(new
            {
                tongHocSinh,
                tongGiaoVien,
                tongKhoaHoc,
                tongLopHoc,
                lopHomNay,
                chuaDiemDanh,
                tongNguoiDung
            });
        }

        /// <summary>
        /// Lấy danh sách các buổi học hôm nay (cho Admin xem tổng quan).
        /// GET: api/Admin/sessions-today
        /// </summary>
        [HttpGet("sessions-today")]
        public async Task<IActionResult> GetSessionsToday()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var sessions = await _context.BuoiHocs
                .Where(b => b.NgayHoc == today)
                .Include(b => b.MaLopNavigation)
                    .ThenInclude(l => l.MaKhoaHocNavigation)
                .Include(b => b.MaGiaoVienNavigation)
                    .ThenInclude(gv => gv.MaNguoiDungNavigation)
                .OrderBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.MaBuoiHoc,
                    MaLopHienThi = b.MaLopNavigation.MaLopHienThi,
                    TenKhoaHoc = b.MaLopNavigation.MaKhoaHocNavigation != null
                        ? b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc
                        : null,
                    TenGiaoVien = b.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen,
                    GioBatDau = b.GioBatDau.ToString("HH:mm"),
                    GioKetThuc = b.GioKetThuc.ToString("HH:mm"),
                    b.GhiChu,
                    DaDiemDanh = b.DiemDanhs.Any()
                })
                .ToListAsync();

            return Ok(sessions);
        }
    }
}
