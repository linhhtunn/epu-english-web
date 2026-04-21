using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Hoc_Sinh,Admin")]
public class StudentController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{studentId}/dashboard")]
    public async Task<IActionResult> GetDashboard(int studentId)
    {
        if (!CanAccessStudent(studentId))
        {
            return Forbid();
        }

        var student = await _context.HocSinhs
            .Include(s => s.MaNguoiDungNavigation)
            .FirstOrDefaultAsync(s => s.MaHocSinh == studentId);

        if (student == null)
        {
            return NotFound(new { message = "Không tìm thấy học sinh." });
        }

        var classIds = await _context.HocSinhLopHocs
            .Where(h => h.MaHocSinh == studentId)
            .Select(h => h.MaLop)
            .Distinct()
            .ToListAsync();

        var currentClass = await _context.HocSinhLopHocs
            .Where(h => h.MaHocSinh == studentId)
            .OrderByDescending(h => h.NgayThamGia)
            .Select(h => new
            {
                h.MaLopNavigation.MaLop,
                h.MaLopNavigation.MaLopHienThi,
                CourseName = h.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc
            })
            .FirstOrDefaultAsync();

        var totalAttendance = await _context.DiemDanhs
            .Where(d => d.MaHocSinh == studentId)
            .CountAsync();

        var presentAttendance = await _context.DiemDanhs
            .Where(d => d.MaHocSinh == studentId && (d.TrangThai == "Co_Mat" || d.TrangThai == "Di_Muon"))
            .CountAsync();

        var totalHomeworks = classIds.Count == 0
            ? 0
            : await _context.BaiTapVeNhas.Where(b => classIds.Contains(b.MaLop)).CountAsync();

        var submittedHomeworks = await _context.BaiNopHocSinhs
            .Where(s => s.MaHocSinh == studentId)
            .CountAsync();

        var completedHomeworks = await _context.BaiNopHocSinhs
            .Where(s => s.MaHocSinh == studentId && (s.TrangThai == "Da_Cham" || s.TrangThai == "Cho_Cham"))
            .CountAsync();

        var testAverage = await _context.KetQuaKiemTras
            .Where(k => k.MaHocSinh == studentId && k.DiemSo != null)
            .AverageAsync(k => (double?)k.DiemSo) ?? 0;

        var today = DateOnly.FromDateTime(DateTime.Today);

        var todayClasses = new List<object>();
        if (classIds.Count > 0)
        {
            var rawTodayClasses = await _context.BuoiHocs
                .Where(b => classIds.Contains(b.MaLop) && b.NgayHoc == today)
                .OrderBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.MaBuoiHoc,
                    b.MaLopNavigation.MaLopHienThi,
                    CourseName = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                    TeacherName = b.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen,
                    b.NgayHoc,
                    b.GioBatDau,
                    b.GioKetThuc,
                    AttendanceStatus = b.DiemDanhs
                        .Where(d => d.MaHocSinh == studentId)
                        .Select(d => d.TrangThai)
                        .FirstOrDefault(),
                    Note = b.GhiChu
                })
                .ToListAsync();

            todayClasses = rawTodayClasses
                .Select(b => (object)new
                {
                    b.MaBuoiHoc,
                    b.MaLopHienThi,
                    b.CourseName,
                    b.TeacherName,
                    Date = b.NgayHoc.ToString("yyyy-MM-dd"),
                    StartTime = b.GioBatDau.ToString("HH\\:mm"),
                    EndTime = b.GioKetThuc.ToString("HH\\:mm"),
                    b.AttendanceStatus,
                    b.Note
                })
                .ToList();
        }

        var attendanceRate = totalAttendance == 0
            ? 0
            : Math.Round((double)presentAttendance * 100 / totalAttendance, 2);

        var homeworkCompletionRate = totalHomeworks == 0
            ? 0
            : Math.Round((double)completedHomeworks * 100 / totalHomeworks, 2);

        return Ok(new
        {
            studentId = student.MaHocSinh,
            studentName = student.MaNguoiDungNavigation.HoTen,
            currentClass,
            aposPoints = student.DiemTongApos ?? 0,
            attendanceRate,
            homeworkCompletionRate,
            totalHomeworks,
            submittedHomeworks,
            testAverage = Math.Round(testAverage, 2),
            todayClasses
        });
    }

    [HttpGet("{studentId}/schedule")]
    public async Task<IActionResult> GetSchedule(int studentId, [FromQuery] DateOnly? fromDate, [FromQuery] DateOnly? toDate)
    {
        if (!CanAccessStudent(studentId))
        {
            return Forbid();
        }

        var today = DateOnly.FromDateTime(DateTime.Today);
        var startOfWeek = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
        var endOfWeek = startOfWeek.AddDays(6);

        var from = fromDate ?? startOfWeek;
        var to = toDate ?? endOfWeek;

        if (to < from)
        {
            return BadRequest(new { message = "Khoảng thời gian không hợp lệ." });
        }

        var classIds = await _context.HocSinhLopHocs
            .Where(h => h.MaHocSinh == studentId)
            .Select(h => h.MaLop)
            .Distinct()
            .ToListAsync();

        if (classIds.Count == 0)
        {
            return Ok(Array.Empty<object>());
        }

        var rawSessions = await _context.BuoiHocs
            .Where(b => classIds.Contains(b.MaLop) && b.NgayHoc >= from && b.NgayHoc <= to)
            .OrderBy(b => b.NgayHoc)
            .ThenBy(b => b.GioBatDau)
            .Select(b => new
            {
                b.MaLop,
                b.NgayHoc,
                b.GioBatDau,
                b.GioKetThuc,
                Subject = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                Code = b.MaLopNavigation.MaLopHienThi,
                Teacher = b.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen,
                Note = b.GhiChu,
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
            room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}", // MOCK: DB chưa có cột PhongHoc
            teacher = b.Teacher,
            type = GetSessionType(b.Note)
        });

        return Ok(sessions);
    }

    [HttpGet("{studentId}/homeworks")]
    public async Task<IActionResult> GetHomeworks(int studentId)
    {
        if (!CanAccessStudent(studentId))
        {
            return Forbid();
        }

        var classIds = await _context.HocSinhLopHocs
            .Where(h => h.MaHocSinh == studentId)
            .Select(h => h.MaLop)
            .Distinct()
            .ToListAsync();

        if (classIds.Count == 0)
        {
            return Ok(Array.Empty<object>());
        }

        var now = DateTime.UtcNow;

        var rawHomeworks = await _context.BaiTapVeNhas
            .Where(b => classIds.Contains(b.MaLop))
            .OrderBy(b => b.HanNop)
            .Select(b => new
            {
                b.MaBaiTap,
                title = b.MaBaiTapGocNavigation.TieuDe,
                classCode = b.MaLopNavigation.MaLopHienThi,
                courseName = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                assignedAt = b.NgayGiao,
                dueAt = b.HanNop,
                rewardPoints = b.ThuongApos,
                submitType = b.KieuNop,
                submission = b.BaiNopHocSinhs
                    .Where(s => s.MaHocSinh == studentId)
                    .Select(s => new
                    {
                        s.MaBaiNop,
                        s.NgayNop,
                        s.DiemSo,
                        s.TrangThai,
                        s.LoiPheGiaoVien,
                        s.DuongDanBaiLam
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        var mapped = rawHomeworks.Select(h =>
        {
            string computedStatus;
            if (h.submission != null)
            {
                computedStatus = h.submission.TrangThai == "Da_Cham" ? "Da_Cham" : "Da_Nop";
            }
            else
            {
                computedStatus = h.dueAt < now ? "Qua_Han" : "Cho_Nop";
            }

            return new
            {
                h.MaBaiTap,
                h.title,
                h.classCode,
                h.courseName,
                h.assignedAt,
                h.dueAt,
                h.rewardPoints,
                h.submitType,
                status = computedStatus,
                submission = h.submission
            };
        });

        return Ok(mapped);
    }

    [HttpGet("{studentId}/reports")]
    public async Task<IActionResult> GetReports(int studentId)
    {
        if (!CanAccessStudent(studentId))
        {
            return Forbid();
        }

        var stats = await _context.ThongKeHocTaps
            .Where(t => t.MaHocSinh == studentId)
            .Select(t => new
            {
                totalAssignments = t.TongBaiTap ?? 0,
                completedAssignments = t.TongBaiHoanThanh ?? 0,
                averageScore = t.DiemTrungBinh ?? 0
            })
            .FirstOrDefaultAsync();

        var reportCards = await _context.BaoCaoBaiHocs
            .Where(b => b.MaHocSinh == studentId)
            .OrderByDescending(b => b.UpdatedAt)
            .Select(b => new
            {
                b.MaBaoCao,
                b.TieuDe,
                date = b.NgayHoc,
                progress = b.TienDoHoanThanh,
                b.MucTieuBaiHoc,
                teacher = b.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen
            })
            .ToListAsync();

        var skillBreakdown = await _context.ChiTietKyNangs
            .Where(c => c.MaBaoCaoNavigation.MaHocSinh == studentId)
            .GroupBy(c => new { c.MaKyNang, c.MaKyNangNavigation.TenKyNang })
            .Select(g => new
            {
                skillId = g.Key.MaKyNang,
                skillName = g.Key.TenKyNang,
                averageScore = Math.Round(g.Average(x => (double?)x.DiemSo) ?? 0, 2),
                teacherComment = g.OrderByDescending(x => x.MaBaoCao)
                    .Select(x => x.NhanXetGiaoVien)
                    .FirstOrDefault()
            })
            .OrderByDescending(x => x.averageScore)
            .ToListAsync();

        var examResults = await _context.KetQuaKiemTras
            .Where(k => k.MaHocSinh == studentId)
            .OrderByDescending(k => k.NgayNop)
            .Select(k => new
            {
                k.MaKiemTra,
                testTitle = k.MaKiemTraNavigation.TieuDe,
                k.DiemSo,
                k.NhanXetGiaoVien,
                k.NgayNop,
                classCode = k.MaKiemTraNavigation.MaLopNavigation.MaLopHienThi
            })
            .ToListAsync();

        var aposHistory = await _context.NhatKyApos
            .Where(a => a.MaHocSinh == studentId)
            .OrderByDescending(a => a.NgayTao)
            .Select(a => new
            {
                a.MaLog,
                a.SoDiem,
                a.LyDo,
                a.NgayTao
            })
            .ToListAsync();

        return Ok(new
        {
            stats = stats ?? new { totalAssignments = 0, completedAssignments = 0, averageScore = 0m },
            reportCards,
            skillBreakdown,
            examResults,
            aposHistory
        });
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Không xác định được người dùng hiện tại." });
        }

        var notifications = await _context.NguoiNhanThongBaos
            .Where(n => n.MaNguoiDung == userId)
            .OrderByDescending(n => n.MaThongBaoNavigation.NgayGui)
            .Select(n => new
            {
                notificationId = n.MaThongBao,
                n.DaDoc,
                title = n.MaThongBaoNavigation.TieuDe,
                content = n.MaThongBaoNavigation.NoiDung,
                category = n.MaThongBaoNavigation.LoaiThongBao,
                sentAt = n.MaThongBaoNavigation.NgayGui,
                sender = n.MaThongBaoNavigation.MaNguoiGuiNavigation != null
                    ? n.MaThongBaoNavigation.MaNguoiGuiNavigation.HoTen
                    : "Hệ thống"
            })
            .ToListAsync();

        return Ok(new
        {
            unread = notifications.Count(n => n.DaDoc != true),
            items = notifications
        });
    }

    [HttpPut("notifications/{notificationId}/read")]
    public async Task<IActionResult> MarkNotificationAsRead(int notificationId)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Không xác định được người dùng hiện tại." });
        }

        var notification = await _context.NguoiNhanThongBaos
            .FirstOrDefaultAsync(n => n.MaThongBao == notificationId && n.MaNguoiDung == userId);

        if (notification == null)
        {
            return NotFound(new { message = "Không tìm thấy thông báo." });
        }

        notification.DaDoc = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã đánh dấu đã đọc." });
    }

    private bool CanAccessStudent(int studentId)
    {
        if (User.IsInRole("Admin"))
        {
            return true;
        }

        if (!User.IsInRole("Hoc_Sinh"))
        {
            return false;
        }

        var profileClaim = User.FindFirstValue("profileId");
        return int.TryParse(profileClaim, out var claimStudentId) && claimStudentId == studentId;
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue("userId")
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    private static string GetSlot(TimeOnly startTime)
    {
        if (startTime.Hour < 12)
        {
            return "Sáng";
        }

        if (startTime.Hour < 18)
        {
            return "Chiều";
        }

        return "Tối";
    }

    private static string GetSessionType(string? note)
    {
        if (string.IsNullOrWhiteSpace(note))
        {
            return "theory";
        }

        var normalized = note.ToLowerInvariant();

        if (normalized.Contains("mock") || normalized.Contains("test") || normalized.Contains("thi"))
        {
            return "exam";
        }

        if (normalized.Contains("practice") || normalized.Contains("thuc hanh") || normalized.Contains("workshop"))
        {
            return "practice";
        }

        return "theory";
    }

    private static string GetPeriod(TimeOnly startTime)
    {
        if (startTime.Hour < 12) return "1 - 3";
        if (startTime.Hour < 18) return "7 - 9";
        return "10 - 12";
    }
}
