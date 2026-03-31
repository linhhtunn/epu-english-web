using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách buổi học của giáo viên theo ngày (mặc định hôm nay).
        /// GET: api/Attendance/sessions?teacherId=1&date=2026-03-24
        /// </summary>
        [HttpGet("sessions")]
        public async Task<ActionResult<IEnumerable<object>>> GetSessions(
            [FromQuery] int teacherId,
            [FromQuery] string? date = null)
        {
            var targetDate = date != null
                ? DateOnly.Parse(date)
                : DateOnly.FromDateTime(DateTime.Today);

            var sessions = await _context.BuoiHocs
                .Include(b => b.MaLopNavigation)
                    .ThenInclude(l => l.MaKhoaHocNavigation)
                .Where(b => b.MaGiaoVien == teacherId && b.NgayHoc == targetDate)
                .OrderBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.MaBuoiHoc,
                    b.MaLop,
                    ClassName = b.MaLopNavigation.MaLopHienThi,
                    CourseName = b.MaLopNavigation.MaKhoaHocNavigation != null
                        ? b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc
                        : "",
                    NgayHoc = b.NgayHoc.ToString("yyyy-MM-dd"),
                    GioBatDau = b.GioBatDau.ToString("HH:mm"),
                    GioKetThuc = b.GioKetThuc.ToString("HH:mm"),
                    b.GhiChu,
                    // Kiểm tra xem buổi học đã điểm danh chưa (có bản ghi DiemDanh nào ko)
                    DaDiemDanh = b.DiemDanhs.Any()
                })
                .ToListAsync();

            return Ok(sessions);
        }

        /// <summary>
        /// Lấy danh sách học sinh trong một buổi học kèm trạng thái điểm danh.
        /// GET: api/Attendance/sessions/{sessionId}/students
        /// </summary>
        [HttpGet("sessions/{sessionId}/students")]
        public async Task<ActionResult<IEnumerable<object>>> GetStudentsInSession(int sessionId)
        {
            var session = await _context.BuoiHocs.FindAsync(sessionId);
            if (session == null)
                return NotFound("Buổi học không tồn tại.");

            // Lấy tất cả học sinh trong lớp
            var students = await _context.HocSinhLopHocs
                .Where(hslh => hslh.MaLop == session.MaLop && hslh.TrangThai == "Dang_Hoc")
                .Include(hslh => hslh.MaHocSinhNavigation)
                    .ThenInclude(hs => hs.MaNguoiDungNavigation)
                .Select(hslh => new
                {
                    hslh.MaHocSinh,
                    HoTen = hslh.MaHocSinhNavigation.MaNguoiDungNavigation.HoTen,
                    // Lấy trạng thái điểm danh nếu đã có
                    TrangThai = _context.DiemDanhs
                        .Where(d => d.MaBuoiHoc == sessionId && d.MaHocSinh == hslh.MaHocSinh)
                        .Select(d => d.TrangThai)
                        .FirstOrDefault()
                })
                .OrderBy(s => s.HoTen)
                .ToListAsync();

            return Ok(students);
        }

        /// <summary>
        /// Lưu/Cập nhật điểm danh hàng loạt cho một buổi học.
        /// POST: api/Attendance/sessions/{sessionId}/save
        /// Body: [ { "maHocSinh": 1, "trangThai": "Co_Mat" }, ... ]
        /// </summary>
        [HttpPost("sessions/{sessionId}/save")]
        public async Task<IActionResult> SaveAttendance(int sessionId, [FromBody] List<AttendanceRecordDto> records)
        {
            var session = await _context.BuoiHocs.FindAsync(sessionId);
            if (session == null)
                return NotFound("Buổi học không tồn tại.");

            foreach (var record in records)
            {
                var existing = await _context.DiemDanhs
                    .FirstOrDefaultAsync(d => d.MaBuoiHoc == sessionId && d.MaHocSinh == record.MaHocSinh);

                if (existing != null)
                {
                    // Cập nhật nếu đã tồn tại
                    existing.TrangThai = record.TrangThai;
                    _context.DiemDanhs.Update(existing);
                }
                else
                {
                    // Tạo mới
                    _context.DiemDanhs.Add(new DiemDanh
                    {
                        MaBuoiHoc = sessionId,
                        MaHocSinh = record.MaHocSinh,
                        TrangThai = record.TrangThai
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Điểm danh đã được lưu thành công." });
        }

        /// <summary>
        /// Lấy tổng hợp điểm danh của học sinh trong một lớp.
        /// GET: api/Attendance/summary/{classId}
        /// </summary>
        [HttpGet("summary/{classId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetAttendanceSummary(int classId)
        {
            var students = await _context.HocSinhLopHocs
                .Where(hslh => hslh.MaLop == classId && hslh.TrangThai == "Dang_Hoc")
                .Include(hslh => hslh.MaHocSinhNavigation)
                    .ThenInclude(hs => hs.MaNguoiDungNavigation)
                .ToListAsync();

            var result = new List<object>();
            foreach (var hslh in students)
            {
                var records = await _context.DiemDanhs
                    .Where(d => d.MaHocSinh == hslh.MaHocSinh &&
                                _context.BuoiHocs.Any(b => b.MaBuoiHoc == d.MaBuoiHoc && b.MaLop == classId))
                    .ToListAsync();

                result.Add(new
                {
                    hslh.MaHocSinh,
                    HoTen = hslh.MaHocSinhNavigation.MaNguoiDungNavigation.HoTen,
                    SoBuoiCoMat = records.Count(r => r.TrangThai == "Co_Mat"),
                    SoBuoiVang = records.Count(r => r.TrangThai == "Vang"),
                    SoBuoiMuon = records.Count(r => r.TrangThai == "Di_Muon"),
                    TongBuoi = records.Count
                });
            }

            return Ok(result);
        }
    }

    // DTO nhận dữ liệu điểm danh
    public class AttendanceRecordDto
    {
        public int MaHocSinh { get; set; }
        public string TrangThai { get; set; } = "Co_Mat"; // Co_Mat | Vang | Di_Muon
    }
}
