using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace QuanLyTrungTam.Controllers
{
    [Authorize(Roles = "Giao_Vien")]
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeacherController(AppDbContext context)
        {
            _context = context;
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue("userId")
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var today = DateOnly.FromDateTime(DateTime.Today);

            // Fetch classes assigned to teacher
            var classes = await _context.LopHocs
                .Where(l => l.MaGiaoVien == teacher.MaGiaoVien)
                .ToListAsync();

            var classIds = classes.Select(c => c.MaLop).ToList();

            // Count total students in these classes
            var totalStudents = await _context.HocSinhLopHocs
                .Where(h => classIds.Contains(h.MaLop))
                .Select(h => h.MaHocSinh)
                .Distinct()
                .CountAsync();

            // Get teaching hours this month
            var firstDayOfMonth = new DateOnly(today.Year, today.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var teachingSessionsThisMonth = await _context.BuoiHocs
                .Where(b => b.MaGiaoVien == teacher.MaGiaoVien && b.NgayHoc >= firstDayOfMonth && b.NgayHoc <= lastDayOfMonth)
                .ToListAsync();

            double totalHours = teachingSessionsThisMonth.Sum(b => (b.GioKetThuc - b.GioBatDau).TotalHours);

            var dashboardStats = new
            {
                totalClasses = classIds.Count,
                totalStudents = totalStudents,
                teachingHours = Math.Round(totalHours, 1),
                supportRequests = 0 // MOCK: DB chưa có bảng YeuCauHoTro
            };

            // Today's classes
            var rawTodayClasses = await _context.BuoiHocs
                .Where(b => b.MaGiaoVien == teacher.MaGiaoVien && b.NgayHoc == today)
                .OrderBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.MaLop,
                    b.MaBuoiHoc,
                    b.GioBatDau,
                    b.GioKetThuc,
                    Code = b.MaLopNavigation.MaLopHienThi,
                    Subject = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                    Note = b.GhiChu
                })
                .ToListAsync();

            var todayClassesOutput = rawTodayClasses.Select(b => new
            {
                id = b.MaBuoiHoc,
                code = b.Code,
                subject = b.Subject,
                time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                type = GetSessionType(b.Note)
            });

            return Ok(new
            {
                stats = dashboardStats,
                todayClasses = todayClassesOutput
            });
        }

        [HttpGet("schedule")]
        public async Task<IActionResult> GetSchedule([FromQuery] DateOnly? fromDate, [FromQuery] DateOnly? toDate)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var today = DateOnly.FromDateTime(DateTime.Today);
            var startOfWeek = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
            var endOfWeek = startOfWeek.AddDays(6);

            var from = fromDate ?? startOfWeek;
            var to = toDate ?? endOfWeek;

            if (to < from) return BadRequest(new { message = "Khoảng thời gian không hợp lệ." });

            var rawSessions = await _context.BuoiHocs
                .Where(b => b.MaGiaoVien == teacher.MaGiaoVien && b.NgayHoc >= from && b.NgayHoc <= to)
                .OrderBy(b => b.NgayHoc).ThenBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.MaLop,
                    b.NgayHoc,
                    b.GioBatDau,
                    b.GioKetThuc,
                    Subject = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                    Code = b.MaLopNavigation.MaLopHienThi,
                    TeacherName = teacher.MaNguoiDungNavigation.HoTen,
                    Note = b.GhiChu
                })
                .ToListAsync();

            var sessions = rawSessions.Select(b => new
            {
                date = b.NgayHoc.ToString("yyyy-MM-dd"),
                slot = GetSlot(b.GioBatDau),
                subject = b.Subject,
                code = b.Code,
                period = GetPeriod(b.GioBatDau),
                time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                teacher = b.TeacherName,
                type = GetSessionType(b.Note)
            });

            return Ok(sessions);
        }

        private static string GetSlot(TimeOnly startTime)
        {
            if (startTime.Hour < 12) return "Sáng";
            if (startTime.Hour < 18) return "Chiều";
            return "Tối";
        }

        private static string GetSessionType(string? note)
        {
            if (string.IsNullOrWhiteSpace(note)) return "Chính khóa";
            var normalized = note.ToLowerInvariant();
            if (normalized.Contains("mock") || normalized.Contains("test") || normalized.Contains("thi")) return "Thi/Kiểm tra";
            if (normalized.Contains("practice") || normalized.Contains("bổ trợ") || normalized.Contains("bo tro")) return "Bổ trợ";
            return "Chính khóa";
        }

        private static string GetPeriod(TimeOnly startTime)
        {
            if (startTime.Hour < 12) return "1 - 3";
            if (startTime.Hour < 18) return "7 - 9";
            return "10 - 12";
        }
    }
}
