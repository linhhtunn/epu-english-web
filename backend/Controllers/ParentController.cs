using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Helpers;

namespace QuanLyTrungTam.Controllers
{
    [Authorize(Roles = "Phu_Huynh")]
    [Route("api/[controller]")]
    [ApiController]
    public class ParentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ParentController(AppDbContext context)
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
            var parentUserId = GetCurrentUserId();
            if (parentUserId == null)
            {
                return Unauthorized(new { message = "Token không hợp lệ." });
            }

            var today = DateTimeHelper.GetVietnamToday();
            var startOfWeek = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
            var endOfWeek = startOfWeek.AddDays(6);

            var children = await _context.HocSinhs
                .Where(hs => hs.MaPhuHuynhNavigation != null && hs.MaPhuHuynhNavigation.MaNguoiDung == parentUserId)
                .OrderBy(hs => hs.MaHocSinh)
                .Select(hs => new
                {
                    id = hs.MaNguoiDungNavigation.TenDangNhap ?? hs.MaHocSinh.ToString(),
                    maHocSinh = hs.MaHocSinh,
                    tenCon = hs.MaNguoiDungNavigation.HoTen,
                    lop = hs.HocSinhLopHocs
                        .OrderByDescending(hslh => hslh.NgayThamGia)
                        .Select(hslh => hslh.MaLopNavigation.MaLopHienThi)
                        .FirstOrDefault() ?? "Chưa xếp lớp",
                    khoaHoc = hs.HocSinhLopHocs
                        .OrderByDescending(hslh => hslh.NgayThamGia)
                        .Select(hslh => hslh.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc)
                        .FirstOrDefault() ?? "Chưa có khóa học",
                    nhanXetMoiNhat = hs.BaoCaoBaiHocs
                        .OrderByDescending(bc => bc.UpdatedAt)
                        .Select(bc => bc.TieuDe ?? bc.MucTieuBaiHoc)
                        .FirstOrDefault() ?? "Chưa có nhận xét.",
                    // Tính tỷ lệ tham dự thật từ bảng DiemDanh
                    totalAttendance = hs.DiemDanhs.Count(),
                    presentAttendance = hs.DiemDanhs.Count(d => d.TrangThai == "Co_Mat" || d.TrangThai == "Di_Muon"),
                    tienDoRaw = hs.ThongKeHocTaps.Select(tk => new
                    {
                        hoanThanhWB = tk.TongBaiTap > 0 ? (int)Math.Round((decimal)tk.TongBaiHoanThanh / (decimal)tk.TongBaiTap * 100m) : 0,
                        hoanThanhAAR = tk.DiemTrungBinh.HasValue && tk.DiemTrungBinh.Value > 0 ? (int)Math.Round(tk.DiemTrungBinh.Value * 10m) : 0
                    }).FirstOrDefault(),
                    hocPhi = hs.BaoCaoPhuHuynhs
                        .OrderByDescending(bc => bc.NgayTao)
                        .Select(bc => bc.TinhTrangHocPhi == "Da_Dong" ? "Đã thanh toán" : "Cần thanh toán")
                        .FirstOrDefault() ?? "Chưa có thông tin",
                    classIds = hs.HocSinhLopHocs.Select(hslh => hslh.MaLop).ToList()
                })
                .ToListAsync();

            // Fetch this week's schedule for all children
            var allClassIds = children.SelectMany(c => c.classIds).Distinct().ToList();
            var rawSessions = await _context.BuoiHocs
                .Where(b => allClassIds.Contains(b.MaLop) && b.NgayHoc >= startOfWeek && b.NgayHoc <= endOfWeek)
                .OrderBy(b => b.NgayHoc).ThenBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.MaLop,
                    thu = GetDayOfWeekVN(b.NgayHoc.DayOfWeek),
                    gio = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                    phong = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                    mon = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc
                })
                .ToListAsync();

            var mappedChildren = children.Select(c => new
            {
                c.id,
                c.maHocSinh,
                c.tenCon,
                c.lop,
                c.khoaHoc,
                c.nhanXetMoiNhat,
                tiendo = new
                {
                    thamDu = c.totalAttendance > 0
                        ? (int)Math.Round((decimal)c.presentAttendance / c.totalAttendance * 100m)
                        : 0,
                    hoanThanhWB = c.tienDoRaw?.hoanThanhWB ?? 0,
                    hoanThanhAAR = c.tienDoRaw?.hoanThanhAAR ?? 0
                },
                c.hocPhi,
                lichHoc = rawSessions.Where(s => c.classIds.Contains(s.MaLop)).Select(s => new
                {
                    s.thu,
                    s.gio,
                    s.phong,
                    s.mon
                }).ToList()
            });

            return Ok(mappedChildren);
        }

        [HttpGet("child-schedule/{studentId}")]
        public async Task<IActionResult> GetChildSchedule(int studentId, [FromQuery] DateOnly? fromDate, [FromQuery] DateOnly? toDate)
        {
            var parentUserId = GetCurrentUserId();
            if (parentUserId == null)
            {
                return Unauthorized(new { message = "Token không hợp lệ." });
            }

            // Verify parent owns this child
            var isOwner = await _context.HocSinhs
                .AnyAsync(hs => hs.MaHocSinh == studentId && hs.MaPhuHuynhNavigation.MaNguoiDung == parentUserId);

            if (!isOwner) return Forbid();

            var today = DateTimeHelper.GetVietnamToday();
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

            if (classIds.Count == 0) return Ok(Array.Empty<object>());

            var rawSessions = await _context.BuoiHocs
                .Where(b => classIds.Contains(b.MaLop) && b.NgayHoc >= from && b.NgayHoc <= to)
                .OrderBy(b => b.NgayHoc).ThenBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.NgayHoc,
                    b.GioBatDau,
                    b.GioKetThuc,
                    b.MaLop,
                    Subject = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                    Code = b.MaLopNavigation.MaLopHienThi,
                    Teacher = b.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen,
                    Note = b.GhiChu
                }).ToListAsync();

            var sessions = rawSessions.Select(b => new
            {
                date = b.NgayHoc.ToString("yyyy-MM-dd"),
                slot = GetSlot(b.GioBatDau),
                subject = b.Subject,
                code = b.Code,
                period = GetPeriod(b.GioBatDau),
                time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                teacher = b.Teacher,
                type = GetSessionType(b.Note)
            });

            return Ok(sessions);
        }

        private static string GetDayOfWeekVN(DayOfWeek dow)
        {
            return dow switch
            {
                DayOfWeek.Monday => "Thứ 2",
                DayOfWeek.Tuesday => "Thứ 3",
                DayOfWeek.Wednesday => "Thứ 4",
                DayOfWeek.Thursday => "Thứ 5",
                DayOfWeek.Friday => "Thứ 6",
                DayOfWeek.Saturday => "Thứ 7",
                DayOfWeek.Sunday => "Chủ nhật",
                _ => ""
            };
        }

        private static string GetSlot(TimeOnly startTime)
        {
            if (startTime.Hour < 12) return "Sáng";
            if (startTime.Hour < 18) return "Chiều";
            return "Tối";
        }

        private static string GetSessionType(string? note)
        {
            if (string.IsNullOrWhiteSpace(note)) return "theory";
            var normalized = note.ToLowerInvariant();
            if (normalized.Contains("mock") || normalized.Contains("test") || normalized.Contains("thi")) return "exam";
            if (normalized.Contains("practice") || normalized.Contains("thuc hanh") || normalized.Contains("workshop")) return "practice";
            return "theory";
        }

        private static string GetPeriod(TimeOnly startTime)
        {
            if (startTime.Hour < 12) return "1 - 3";
            if (startTime.Hour < 18) return "7 - 9";
            return "10 - 12";
        }

        [HttpGet("attendance/{studentId}")]
        public async Task<IActionResult> GetAttendance(int studentId)
        {
            var parentUserId = GetCurrentUserId();
            if (parentUserId == null)
            {
                return Unauthorized(new { message = "Token không hợp lệ." });
            }

            var isOwner = await _context.HocSinhs
                .AnyAsync(hs => hs.MaHocSinh == studentId && hs.MaPhuHuynhNavigation.MaNguoiDung == parentUserId);

            if (!isOwner) return Forbid();

            var student = await _context.HocSinhs
                .Include(h => h.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(h => h.MaHocSinh == studentId);
            
            var attendanceRecords = await _context.DiemDanhs
                .Include(d => d.MaBuoiHocNavigation)
                .Where(d => d.MaHocSinh == studentId)
                .OrderByDescending(d => d.MaBuoiHocNavigation.NgayHoc).ThenByDescending(d => d.MaBuoiHocNavigation.GioBatDau)
                .Take(20) // Only get recent 20 for UI
                .Select(d => new
                {
                    date = d.MaBuoiHocNavigation.NgayHoc.ToString("dd/MM/yyyy"),
                    time = d.MaBuoiHocNavigation.GioBatDau.ToString("HH\\:mm") + " - " + d.MaBuoiHocNavigation.GioKetThuc.ToString("HH\\:mm"),
                    status = d.TrangThai, // "Co_Mat", "Vang_Co_Phep", "Vang_Khong_Phep", "Di_Muon"
                    note = "" // Model DiemDanh has no GhiChu property
                })
                .ToListAsync();

            var stats = new
            {
                total = await _context.DiemDanhs.CountAsync(d => d.MaHocSinh == studentId),
                present = await _context.DiemDanhs.CountAsync(d => d.MaHocSinh == studentId && d.TrangThai == "Co_Mat"),
                absent = await _context.DiemDanhs.CountAsync(d => d.MaHocSinh == studentId && (d.TrangThai == "Vang_Co_Phep" || d.TrangThai == "Vang_Khong_Phep")),
                late = await _context.DiemDanhs.CountAsync(d => d.MaHocSinh == studentId && d.TrangThai == "Di_Muon")
            };

            return Ok(new
            {
                studentName = student?.MaNguoiDungNavigation?.HoTen,
                studentCode = student?.MaHocSinh,
                stats,
                history = attendanceRecords
            });
        }
    }
}