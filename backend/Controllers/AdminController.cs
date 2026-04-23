using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Helpers;

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

            var today = DateTimeHelper.GetVietnamToday();

            var rawTodayClasses = await _context.BuoiHocs
                .Include(b => b.MaLopNavigation).ThenInclude(l => l.MaKhoaHocNavigation)
                .Include(b => b.MaGiaoVienNavigation).ThenInclude(g => g.MaNguoiDungNavigation)
                .Where(b => b.NgayHoc == today)
                .OrderBy(b => b.GioBatDau)
                .ToListAsync();

            var currentTime = TimeOnly.FromDateTime(DateTimeHelper.GetVietnamNow());

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
            var today = DateTimeHelper.GetVietnamToday();
            var startOfWeek = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
            var endOfWeek = startOfWeek.AddDays(6);

            var from = fromDate ?? startOfWeek;
            var to = toDate ?? endOfWeek;

            if (to < from) return BadRequest(new { message = "Khoảng thời gian không hợp lệ." });

            var rawSessions = await _context.BuoiHocs
                .Include(b => b.MaLopNavigation)
                .Include(b => b.MaGiaoVienNavigation).ThenInclude(g => g.MaNguoiDungNavigation)
                .Include(b => b.DiemDanhs)
                .Where(b => b.NgayHoc >= from && b.NgayHoc <= to)
                .ToListAsync();

            var scheduledClasses = rawSessions.Select(b => new
            {
                id = b.MaBuoiHoc,
                classId = b.MaLop,
                classCode = b.MaLopNavigation.MaLopHienThi,
                teacher = b.MaGiaoVienNavigation?.MaNguoiDungNavigation?.HoTen ?? "N/A",
                teacherId = b.MaGiaoVien,
                room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                dayIdx = GetDayIdx(b.NgayHoc.DayOfWeek),
                date = b.NgayHoc.ToString("yyyy-MM-dd"),
                startTime = b.GioBatDau.ToString("HH\\:mm"),
                endTime = b.GioKetThuc.ToString("HH\\:mm"),
                isPast = b.NgayHoc < today,
                note = b.GhiChu,
                hasAttendance = b.DiemDanhs.Any(),
                isConflict = false,
                conflictReason = (string?)null
            });

            var rescheduleRequests = Array.Empty<object>();

            return Ok(new
            {
                scheduledClasses,
                rescheduleRequests
            });
        }

        // GET: api/admin/schedule/classes — List classes for the create modal
        [HttpGet("schedule/classes")]
        public async Task<IActionResult> GetClassesForSchedule()
        {
            var classes = await _context.LopHocs
                .Include(c => c.MaKhoaHocNavigation)
                .Include(c => c.MaGiaoVienNavigation).ThenInclude(g => g!.MaNguoiDungNavigation)
                .Select(c => new
                {
                    c.MaLop,
                    c.MaLopHienThi,
                    CourseName = c.MaKhoaHocNavigation.TenKhoaHoc,
                    TeacherId = c.MaGiaoVien,
                    TeacherName = c.MaGiaoVienNavigation != null ? c.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen : null
                })
                .ToListAsync();

            var teachers = await _context.GiaoViens
                .Include(g => g.MaNguoiDungNavigation)
                .Select(g => new
                {
                    g.MaGiaoVien,
                    HoTen = g.MaNguoiDungNavigation.HoTen
                })
                .ToListAsync();

            return Ok(new { classes, teachers });
        }

        // POST: api/admin/schedule/session — Create a new session
        [HttpPost("schedule/session")]
        public async Task<IActionResult> CreateSession([FromBody] SessionCreateDto dto)
        {
            var today = DateTimeHelper.GetVietnamToday();
            var sessionDate = DateOnly.Parse(dto.NgayHoc);

            if (sessionDate < today)
                return BadRequest(new { message = "Không thể tạo buổi học cho ngày đã qua." });

            var startTime = TimeOnly.Parse(dto.GioBatDau);
            var endTime = TimeOnly.Parse(dto.GioKetThuc);

            if (endTime <= startTime)
                return BadRequest(new { message = "Giờ kết thúc phải sau giờ bắt đầu." });

            // Check teacher conflict
            var conflict = await _context.BuoiHocs.AnyAsync(b =>
                b.MaGiaoVien == dto.MaGiaoVien &&
                b.NgayHoc == sessionDate &&
                b.GioBatDau < endTime &&
                b.GioKetThuc > startTime);

            if (conflict)
                return BadRequest(new { message = "Giáo viên đã có lịch dạy trùng thời gian này." });

            var session = new backend.Models.BuoiHoc
            {
                MaLop = dto.MaLop,
                NgayHoc = sessionDate,
                GioBatDau = startTime,
                GioKetThuc = endTime,
                MaGiaoVien = dto.MaGiaoVien,
                TrangThaiGiaoVien = "Day",
                GhiChu = dto.GhiChu
            };

            _context.BuoiHocs.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã tạo buổi học mới.", id = session.MaBuoiHoc });
        }

        // PUT: api/admin/schedule/session/{id} — Update session
        [HttpPut("schedule/session/{id}")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] SessionUpdateDto dto)
        {
            var session = await _context.BuoiHocs.FindAsync(id);
            if (session == null) return NotFound(new { message = "Buổi học không tồn tại." });

            var today = DateTimeHelper.GetVietnamToday();
            if (session.NgayHoc < today)
                return BadRequest(new { message = "Không thể sửa buổi học đã diễn ra." });

            var newDate = DateOnly.Parse(dto.NgayHoc);
            if (newDate < today)
                return BadRequest(new { message = "Không thể chuyển buổi học sang ngày đã qua." });

            var startTime = TimeOnly.Parse(dto.GioBatDau);
            var endTime = TimeOnly.Parse(dto.GioKetThuc);

            if (endTime <= startTime)
                return BadRequest(new { message = "Giờ kết thúc phải sau giờ bắt đầu." });

            var teacherIdToCheck = dto.MaGiaoVien ?? session.MaGiaoVien;

            // Check teacher conflict (exclude self)
            var conflict = await _context.BuoiHocs.AnyAsync(b =>
                b.MaBuoiHoc != id &&
                b.MaGiaoVien == teacherIdToCheck &&
                b.NgayHoc == newDate &&
                b.GioBatDau < endTime &&
                b.GioKetThuc > startTime);

            if (conflict)
                return BadRequest(new { message = "Giáo viên đã có lịch dạy trùng thời gian này." });

            session.NgayHoc = newDate;
            session.GioBatDau = startTime;
            session.GioKetThuc = endTime;

            if (dto.MaLop.HasValue) session.MaLop = dto.MaLop.Value;
            if (dto.MaGiaoVien.HasValue) session.MaGiaoVien = dto.MaGiaoVien.Value;
            if (dto.GhiChu != null) session.GhiChu = dto.GhiChu;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật buổi học." });
        }

        // DELETE: api/admin/schedule/session/{id}
        [HttpDelete("schedule/session/{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.BuoiHocs
                .Include(b => b.DiemDanhs)
                .FirstOrDefaultAsync(b => b.MaBuoiHoc == id);

            if (session == null) return NotFound(new { message = "Buổi học không tồn tại." });

            var today = DateTimeHelper.GetVietnamToday();
            if (session.NgayHoc < today)
                return BadRequest(new { message = "Không thể xóa buổi học đã diễn ra." });

            if (session.DiemDanhs.Any())
            {
                // Remove attendance first
                _context.DiemDanhs.RemoveRange(session.DiemDanhs);
            }

            _context.BuoiHocs.Remove(session);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa buổi học." });
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

    public class SessionCreateDto
    {
        public int MaLop { get; set; }
        public string NgayHoc { get; set; } = "";
        public string GioBatDau { get; set; } = "";
        public string GioKetThuc { get; set; } = "";
        public int MaGiaoVien { get; set; }
        public string? GhiChu { get; set; }
    }

    public class SessionUpdateDto
    {
        public string NgayHoc { get; set; } = "";
        public string GioBatDau { get; set; } = "";
        public string GioKetThuc { get; set; } = "";
        public int? MaLop { get; set; }
        public int? MaGiaoVien { get; set; }
        public string? GhiChu { get; set; }
    }
}
