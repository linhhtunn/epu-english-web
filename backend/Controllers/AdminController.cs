using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;

namespace QuanLyTrungTam.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ISchedulePlannerService _schedulePlannerService;

        public AdminController(AppDbContext context, ISchedulePlannerService schedulePlannerService)
        {
            _context = context;
            _schedulePlannerService = schedulePlannerService;
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
                room = _context.ChiTietXepLiches
                    .Where(c => c.MaBuoiHoc == b.MaBuoiHoc)
                    .Select(c => c.MaPhongHocNavigation.TenPhong)
                    .FirstOrDefault() ?? $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                status = b.GioKetThuc < currentTime ? "Đã xong" : (b.GioBatDau <= currentTime ? "Đang học" : "Sắp bắt đầu")
            });

            var stats = new
            {
                totalStudentsCount = string.Format("{0:N0}", totalStudents),
                totalCoursesCount = totalCourses.ToString(),
                monthlyRevenue = "540M",
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
                .OrderBy(b => b.NgayHoc)
                .ThenBy(b => b.GioBatDau)
                .ToListAsync();

            var scheduledClasses = rawSessions.Select(b =>
            {
                var scheduleDetail = _context.ChiTietXepLiches
                    .Where(c => c.MaBuoiHoc == b.MaBuoiHoc && c.TrangThai == "Hoat_Dong")
                    .Select(c => new
                    {
                        c.MaPhongHoc,
                        c.MaKhungGio,
                        Room = c.MaPhongHocNavigation.TenPhong
                    })
                    .FirstOrDefault();

                return new
                {
                    id = b.MaBuoiHoc,
                    maBuoiHoc = b.MaBuoiHoc,
                    maLop = b.MaLop,
                    maGiaoVien = b.MaGiaoVien,
                    classCode = b.MaLopNavigation.MaLopHienThi,
                    teacher = b.MaGiaoVienNavigation?.MaNguoiDungNavigation?.HoTen ?? "N/A",
                    room = scheduleDetail?.Room ?? $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                    maPhongHoc = scheduleDetail?.MaPhongHoc,
                    maKhungGio = scheduleDetail?.MaKhungGio,
                    date = b.NgayHoc.ToString("yyyy-MM-dd"),
                    time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                    dayIdx = GetDayIdx(b.NgayHoc.DayOfWeek),
                    slotId = GetSlotId(b.GioBatDau),
                    isConflict = false,
                    conflictReason = (string?)null
                };
            });

            var rawRescheduleRequests = await _context.YeuCauDoiLiches
                .Include(r => r.MaBuoiHocNavigation).ThenInclude(b => b.MaLopNavigation)
                .Include(r => r.MaGiaoVienNavigation).ThenInclude(g => g.MaNguoiDungNavigation)
                .Include(r => r.MaKhungGioDeXuatNavigation)
                .Include(r => r.MaPhongHocDeXuatNavigation)
                .Where(r => r.TrangThai == "Cho_Duyet")
                .OrderByDescending(r => r.NgayTao)
                .ToListAsync();

            var rescheduleRequests = rawRescheduleRequests.Select(r => new
            {
                id = r.MaYeuCau,
                maBuoiHoc = r.MaBuoiHoc,
                maLop = r.MaBuoiHocNavigation.MaLop,
                maGiaoVien = r.MaGiaoVien,
                classCode = r.MaBuoiHocNavigation.MaLopNavigation.MaLopHienThi,
                teacher = r.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen,
                currentDate = r.MaBuoiHocNavigation.NgayHoc.ToString("yyyy-MM-dd"),
                currentTime = r.MaBuoiHocNavigation.GioBatDau.ToString("HH\\:mm") + " - " + r.MaBuoiHocNavigation.GioKetThuc.ToString("HH\\:mm"),
                requestedDate = r.NgayDeXuatMoi.ToString("yyyy-MM-dd"),
                requestedSlotId = r.MaKhungGioDeXuat,
                requestedSlotLabel = r.MaKhungGioDeXuatNavigation.TenKhungGio,
                requestedSlotTime = r.MaKhungGioDeXuatNavigation.GioBatDau.ToString("HH\\:mm") + " - " + r.MaKhungGioDeXuatNavigation.GioKetThuc.ToString("HH\\:mm"),
                requestedRoomId = r.MaPhongHocDeXuat,
                requestedRoom = r.MaPhongHocDeXuatNavigation != null ? r.MaPhongHocDeXuatNavigation.TenPhong : null,
                lyDo = r.LyDo,
                ngayTao = r.NgayTao.ToString("yyyy-MM-dd HH:mm")
            }).ToList();

            return Ok(new
            {
                scheduledClasses,
                rescheduleRequests
            });
        }

        [HttpGet("schedule/options")]
        public async Task<IActionResult> GetScheduleOptions()
        {
            var result = await _schedulePlannerService.GetScheduleOptionsAsync();
            return Ok(result);
        }

        [HttpGet("schedule/availability")]
        public async Task<IActionResult> GetAvailability([FromQuery] int maLop, [FromQuery] DateOnly ngayHoc, [FromQuery] int? maGiaoVien)
        {
            var result = await _schedulePlannerService.GetAvailabilityAsync(maLop, ngayHoc, maGiaoVien);
            return Ok(result);
        }

        [HttpPost("schedule/manual")]
        public async Task<IActionResult> CreateManualSchedule([FromBody] ScheduleManualCreateDto dto)
        {
            var result = await _schedulePlannerService.CreateManualScheduleAsync(dto, User);
            return StatusCode(result.StatusCode, result.Payload);
        }

        [HttpPost("schedule/auto")]
        public async Task<IActionResult> CreateAutoSchedule([FromBody] ScheduleAutoCreateDto dto)
        {
            var result = await _schedulePlannerService.CreateAutoScheduleAsync(dto, User);
            return StatusCode(result.StatusCode, result.Payload);
        }

        [HttpPost("reschedule-requests/{requestId}/process")]
        public async Task<IActionResult> ProcessRescheduleRequest(int requestId, [FromBody] AdminRescheduleProcessDto dto)
        {
            var result = await _schedulePlannerService.ProcessRescheduleRequestAsync(requestId, dto, User);

            if (result.Success)
            {
                await NotifyTeacherAfterRescheduleProcessedAsync(requestId, dto.TrangThai, dto.GhiChuXuLy);
            }

            return StatusCode(result.StatusCode, result.Payload);
        }

        private async Task NotifyTeacherAfterRescheduleProcessedAsync(int requestId, string status, string? processingNote)
        {
            var request = await _context.YeuCauDoiLiches
                .Include(r => r.MaGiaoVienNavigation).ThenInclude(g => g.MaNguoiDungNavigation)
                .Include(r => r.MaBuoiHocNavigation).ThenInclude(b => b.MaLopNavigation)
                .FirstOrDefaultAsync(r => r.MaYeuCau == requestId);

            if (request == null)
            {
                return;
            }

            var teacherUserId = request.MaGiaoVienNavigation.MaNguoiDung;
            var title = status == "Da_Duyet"
                ? "Yêu cầu đổi lịch đã được duyệt"
                : "Yêu cầu đổi lịch đã bị từ chối";

            var content = status == "Da_Duyet"
                ? $"Admin đã cập nhật lịch cho lớp {request.MaBuoiHocNavigation.MaLopNavigation.MaLopHienThi}."
                : $"Admin đã từ chối yêu cầu đổi lịch của lớp {request.MaBuoiHocNavigation.MaLopNavigation.MaLopHienThi}.";

            if (!string.IsNullOrWhiteSpace(processingNote))
            {
                content += $" Ghi chú: {processingNote}";
            }

            var thongBao = new ThongBao
            {
                TieuDe = title,
                NoiDung = content,
                LoaiThongBao = "Dieu_Phoi_Lich",
                NgayGui = DateTime.Now
            };

            _context.ThongBaos.Add(thongBao);
            await _context.SaveChangesAsync();

            _context.NguoiNhanThongBaos.Add(new NguoiNhanThongBao
            {
                MaThongBao = thongBao.MaThongBao,
                MaNguoiDung = teacherUserId,
                DaDoc = false
            });

            await _context.SaveChangesAsync();
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
