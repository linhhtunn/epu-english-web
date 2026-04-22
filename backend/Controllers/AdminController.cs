using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace QuanLyTrungTam.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalStudents = await _context.HocSinhs.CountAsync();
            var totalCourses = await _context.KhoaHocs.CountAsync();

            var today = DateOnly.FromDateTime(DateTime.Today);

            var rawTodayClasses = await _context.BuoiHocs
                .Include(b => b.MaLopNavigation).ThenInclude(l => l.MaKhoaHocNavigation)
                .Include(b => b.MaGiaoVienNavigation).ThenInclude(g => g.MaNguoiDungNavigation)
                .Where(b => b.NgayHoc == today)
                .OrderBy(b => b.GioBatDau)
                .ToListAsync();

            var currentTime = TimeOnly.FromDateTime(DateTime.Now);

            var ongoingClasses = rawTodayClasses.Select(b => new
            {
                id = b.MaLopNavigation.MaLopHienThi,
                course = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                teacher = b.MaGiaoVienNavigation?.MaNguoiDungNavigation?.HoTen ?? "Ban Khảo Thí",
                room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}", // Mocked room using math hash
                time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                status = b.GioKetThuc < currentTime ? "Đã xong" : (b.GioBatDau <= currentTime ? "Đang học" : "Sắp bắt đầu")
            });

            var stats = new
            {
                totalStudentsCount = string.Format("{0:N0}", totalStudents),
                totalCoursesCount = totalCourses.ToString(),
                monthlyRevenue = "540M", // MOCK: DB chưa có bảng GiaoDich/HoaDon
                todayClassesCount = rawTodayClasses.Count.ToString()
            };

            return Ok(new
            {
                stats,
                ongoingClasses
            });
        }

        [HttpGet("schedule")]
        public async Task<IActionResult> GetSystemSchedule([FromQuery] DateOnly? fromDate, [FromQuery] DateOnly? toDate)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var startOfWeek = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
            var endOfWeek = startOfWeek.AddDays(6);

            var from = fromDate ?? startOfWeek;
            var to = toDate ?? endOfWeek;

            if (to < from) return BadRequest(new { message = "Khoảng thời gian không hợp lệ." });

            var rawSessions = await _context.BuoiHocs
                .Include(b => b.MaLopNavigation)
                .Include(b => b.MaGiaoVienNavigation).ThenInclude(g => g.MaNguoiDungNavigation)
                .Where(b => b.NgayHoc >= from && b.NgayHoc <= to)
                .ToListAsync();

            var scheduledClasses = rawSessions.Select(b => new
            {
                id = b.MaBuoiHoc,
                classCode = b.MaLopNavigation.MaLopHienThi,
                teacher = b.MaGiaoVienNavigation?.MaNguoiDungNavigation?.HoTen ?? "N/A",
                room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                dayIdx = GetDayIdx(b.NgayHoc.DayOfWeek),
                slotId = GetSlotId(b.GioBatDau),
                isConflict = false,
                conflictReason = (string?)null
            });

            // MOCK: DB chưa có bảng YeuCauDoiLich, trả mảng rỗng
            var rescheduleRequests = Array.Empty<object>();

            return Ok(new
            {
                scheduledClasses,
                rescheduleRequests
            });
        }

        private static int GetDayIdx(DayOfWeek dayOfWeek)
        {
            return dayOfWeek == DayOfWeek.Sunday ? 6 : (int)dayOfWeek - 1;
        }

        private static int GetSlotId(TimeOnly time)
        {
            if (time < new TimeOnly(9, 30)) return 1;
            if (time < new TimeOnly(11, 45)) return 2;
            if (time < new TimeOnly(15, 30)) return 3;
            if (time < new TimeOnly(17, 45)) return 4;
            if (time < new TimeOnly(20, 0)) return 5;
            return 6;
        }
    }
}
