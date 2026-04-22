using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

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

            var classes = await _context.LopHocs
                .Where(l => l.MaGiaoVien == teacher.MaGiaoVien)
                .ToListAsync();

            var classIds = classes.Select(c => c.MaLop).ToList();

            var totalStudents = await _context.HocSinhLopHocs
                .Where(h => classIds.Contains(h.MaLop))
                .Select(h => h.MaHocSinh)
                .Distinct()
                .CountAsync();

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
                supportRequests = 0
            };

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
                room = _context.ChiTietXepLiches
                    .Where(c => c.MaBuoiHoc == b.MaBuoiHoc)
                    .Select(c => c.MaPhongHocNavigation.TenPhong)
                    .FirstOrDefault() ?? $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
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

            var teacher = await _context.GiaoViens
                .Include(g => g.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
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
                    b.MaBuoiHoc,
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

            var pendingRequestMap = await _context.YeuCauDoiLiches
                .Where(r => r.MaGiaoVien == teacher.MaGiaoVien && r.TrangThai == "Cho_Duyet")
                .GroupBy(r => r.MaBuoiHoc)
                .Select(g => new { MaBuoiHoc = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.MaBuoiHoc, x => x.Count);

            var sessions = rawSessions.Select(b => new
            {
                id = b.MaBuoiHoc,
                maBuoiHoc = b.MaBuoiHoc,
                maLop = b.MaLop,
                date = b.NgayHoc.ToString("yyyy-MM-dd"),
                slot = GetSlot(b.GioBatDau),
                subject = b.Subject,
                code = b.Code,
                period = GetPeriod(b.GioBatDau),
                time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                room = _context.ChiTietXepLiches
                    .Where(c => c.MaBuoiHoc == b.MaBuoiHoc)
                    .Select(c => c.MaPhongHocNavigation.TenPhong)
                    .FirstOrDefault() ?? $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                teacher = b.TeacherName,
                type = GetSessionType(b.Note),
                hasPendingRequest = pendingRequestMap.ContainsKey(b.MaBuoiHoc)
            });

            return Ok(sessions);
        }

        [HttpGet("reschedule-options")]
        public async Task<IActionResult> GetRescheduleOptions()
        {
            var slots = await _context.KhungGioHocs
                .Where(k => k.TrangThai == "Hoat_Dong")
                .OrderBy(k => k.ThuTu)
                .Select(k => new
                {
                    maKhungGio = k.MaKhungGio,
                    tenKhungGio = k.TenKhungGio,
                    gioBatDau = k.GioBatDau.ToString("HH\\:mm"),
                    gioKetThuc = k.GioKetThuc.ToString("HH\\:mm")
                })
                .ToListAsync();

            return Ok(new { khungGios = slots });
        }

        [HttpGet("reschedule-requests")]
        public async Task<IActionResult> GetRescheduleRequests()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var rawRequests = await _context.YeuCauDoiLiches
                .Include(r => r.MaBuoiHocNavigation).ThenInclude(b => b.MaLopNavigation)
                .Include(r => r.MaKhungGioDeXuatNavigation)
                .Include(r => r.MaPhongHocDeXuatNavigation)
                .Where(r => r.MaGiaoVien == teacher.MaGiaoVien)
                .OrderByDescending(r => r.NgayTao)
                .ToListAsync();

            var requests = rawRequests.Select(r => new
            {
                id = r.MaYeuCau,
                maBuoiHoc = r.MaBuoiHoc,
                classCode = r.MaBuoiHocNavigation.MaLopNavigation.MaLopHienThi,
                currentDate = r.MaBuoiHocNavigation.NgayHoc.ToString("yyyy-MM-dd"),
                currentTime = r.MaBuoiHocNavigation.GioBatDau.ToString("HH\\:mm") + " - " + r.MaBuoiHocNavigation.GioKetThuc.ToString("HH\\:mm"),
                requestedDate = r.NgayDeXuatMoi.ToString("yyyy-MM-dd"),
                requestedSlotId = r.MaKhungGioDeXuat,
                requestedSlotLabel = r.MaKhungGioDeXuatNavigation.TenKhungGio,
                requestedSlotTime = r.MaKhungGioDeXuatNavigation.GioBatDau.ToString("HH\\:mm") + " - " + r.MaKhungGioDeXuatNavigation.GioKetThuc.ToString("HH\\:mm"),
                requestedRoom = r.MaPhongHocDeXuatNavigation != null ? r.MaPhongHocDeXuatNavigation.TenPhong : null,
                lyDo = r.LyDo,
                trangThai = r.TrangThai,
                ngayTao = r.NgayTao.ToString("yyyy-MM-dd HH:mm"),
                ngayXuLy = r.NgayXuLy.HasValue ? r.NgayXuLy.Value.ToString("yyyy-MM-dd HH:mm") : null,
                ghiChuXuLy = r.GhiChuXuLy
            }).ToList();

            return Ok(requests);
        }

        [HttpPost("reschedule-requests")]
        public async Task<IActionResult> CreateRescheduleRequest([FromBody] TeacherRescheduleRequestCreateDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens
                .Include(g => g.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var session = await _context.BuoiHocs
                .Include(b => b.MaLopNavigation)
                .FirstOrDefaultAsync(b => b.MaBuoiHoc == dto.MaBuoiHoc && b.MaGiaoVien == teacher.MaGiaoVien);
            if (session == null)
            {
                return NotFound(new { message = "Không tìm thấy buổi học thuộc quyền phụ trách của bạn." });
            }

            if (dto.NgayDeXuatMoi < DateOnly.FromDateTime(DateTime.Today))
            {
                return BadRequest(new { message = "Ngày đề xuất mới phải từ hôm nay trở đi." });
            }

            var khungGio = await _context.KhungGioHocs
                .FirstOrDefaultAsync(k => k.MaKhungGio == dto.MaKhungGioDeXuat && k.TrangThai == "Hoat_Dong");
            if (khungGio == null)
            {
                return BadRequest(new { message = "Khung giờ đề xuất không hợp lệ." });
            }

            if (dto.MaPhongHocDeXuat.HasValue)
            {
                var phongHoc = await _context.PhongHocs
                    .FirstOrDefaultAsync(p => p.MaPhongHoc == dto.MaPhongHocDeXuat.Value && p.TrangThai == "Hoat_Dong");
                if (phongHoc == null)
                {
                    return BadRequest(new { message = "Phòng học đề xuất không hợp lệ." });
                }
            }

            var hasPendingRequest = await _context.YeuCauDoiLiches
                .AnyAsync(r => r.MaBuoiHoc == dto.MaBuoiHoc && r.TrangThai == "Cho_Duyet");
            if (hasPendingRequest)
            {
                return Conflict(new { message = "Buổi học này đang có một yêu cầu đổi lịch chờ duyệt." });
            }

            var request = new YeuCauDoiLich
            {
                MaBuoiHoc = session.MaBuoiHoc,
                MaGiaoVien = teacher.MaGiaoVien,
                NgayDeXuatMoi = dto.NgayDeXuatMoi,
                MaKhungGioDeXuat = dto.MaKhungGioDeXuat,
                MaPhongHocDeXuat = dto.MaPhongHocDeXuat,
                LyDo = dto.LyDo,
                TrangThai = "Cho_Duyet",
                NgayTao = DateTime.Now
            };

            _context.YeuCauDoiLiches.Add(request);
            await _context.SaveChangesAsync();

            await CreateNotificationForAdminsAsync(
                userId.Value,
                session.MaLopNavigation.MaLopHienThi ?? $"Lớp {session.MaLop}",
                session.NgayHoc,
                session.GioBatDau,
                session.GioKetThuc,
                dto.NgayDeXuatMoi,
                khungGio);

            return StatusCode(StatusCodes.Status201Created, new
            {
                message = "Đã gửi yêu cầu đổi lịch cho admin.",
                request = new
                {
                    id = request.MaYeuCau,
                    maBuoiHoc = request.MaBuoiHoc,
                    classCode = session.MaLopNavigation.MaLopHienThi,
                    requestedDate = request.NgayDeXuatMoi.ToString("yyyy-MM-dd"),
                    requestedSlotId = request.MaKhungGioDeXuat,
                    requestedSlotLabel = khungGio.TenKhungGio,
                    trangThai = request.TrangThai
                }
            });
        }

        private async Task CreateNotificationForAdminsAsync(
            int senderUserId,
            string classCode,
            DateOnly currentDate,
            TimeOnly currentStart,
            TimeOnly currentEnd,
            DateOnly requestedDate,
            KhungGioHoc requestedSlot)
        {
            var adminUserIds = await _context.NguoiDungs
                .Where(u => u.MaVaiTro == 1 && u.TrangThai == "Hoat_Dong")
                .Select(u => u.MaNguoiDung)
                .ToListAsync();

            if (adminUserIds.Count == 0)
            {
                return;
            }

            var thongBao = new ThongBao
            {
                TieuDe = "Yêu cầu đổi lịch từ giảng viên",
                NoiDung = $"Lớp {classCode} cần đổi từ {currentDate:yyyy-MM-dd} {currentStart:HH\\:mm}-{currentEnd:HH\\:mm} sang {requestedDate:yyyy-MM-dd} {requestedSlot.TenKhungGio}.",
                LoaiThongBao = "Dieu_Phoi_Lich",
                MaNguoiGui = senderUserId,
                NgayGui = DateTime.Now
            };

            _context.ThongBaos.Add(thongBao);
            await _context.SaveChangesAsync();

            _context.NguoiNhanThongBaos.AddRange(adminUserIds.Select(adminUserId => new NguoiNhanThongBao
            {
                MaThongBao = thongBao.MaThongBao,
                MaNguoiDung = adminUserId,
                DaDoc = false
            }));

            await _context.SaveChangesAsync();
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
