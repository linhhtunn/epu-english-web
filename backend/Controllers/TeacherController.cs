using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Helpers;

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

            var teacher = await _context.GiaoViens
                .Include(g => g.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var today = DateTimeHelper.GetVietnamToday();

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
                supportRequests = 0
            };

            // Today's classes
            var rawTodayClasses = await _context.BuoiHocs
                .Where(b => b.MaGiaoVien == teacher.MaGiaoVien && b.NgayHoc == today)
                .OrderBy(b => b.GioBatDau)
                .Select(b => new
                {
                    b.MaBuoiHoc,
                    b.MaLop,
                    Code = b.MaLopNavigation.MaLopHienThi,
                    Subject = b.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc,
                    b.GioBatDau,
                    b.GioKetThuc,
                    b.GhiChu,
                    attendanceCount = b.DiemDanhs.Count,
                    studentCount = b.MaLopNavigation.HocSinhLopHocs.Count(hs => hs.TrangThai == "Dang_Hoc")
                })
                .ToListAsync();

            var todayClassesOutput = rawTodayClasses.Select(b => {
                string status = "chua";
                if (b.studentCount > 0 && b.attendanceCount >= b.studentCount) status = "done";
                else if (b.attendanceCount > 0) status = "dang";

                return new
                {
                    id = b.MaBuoiHoc,
                    code = b.Code,
                    subject = b.Subject,
                    time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                    room = $"Phòng {b.MaLop % 5 + 1}0{b.MaLop % 9 + 1}",
                    type = GetSessionType(b.GhiChu),
                    status = status
                };
            });

            return Ok(new
            {
                stats = dashboardStats,
                todayClasses = todayClassesOutput
            });
        }

        [HttpGet("schedule")]
        public async Task<IActionResult> GetSchedule([FromQuery] string? fromDate, [FromQuery] string? toDate)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens
                .Include(g => g.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var today = DateTimeHelper.GetVietnamToday();
            var startOfWeek = today.AddDays(-(((int)today.DayOfWeek + 6) % 7));
            var endOfWeek = startOfWeek.AddDays(6);

            DateOnly from = startOfWeek;
            DateOnly to = endOfWeek;

            if (!string.IsNullOrEmpty(fromDate) && DateOnly.TryParse(fromDate, out var parsedFrom))
                from = parsedFrom;
            if (!string.IsNullOrEmpty(toDate) && DateOnly.TryParse(toDate, out var parsedTo))
                to = parsedTo;

            if (to < from) return BadRequest(new { message = "Khoảng thời gian không hợp lệ." });

            var teacherName = teacher.MaNguoiDungNavigation?.HoTen ?? "N/A";

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
                teacher = teacherName,
                type = GetSessionType(b.Note)
            });

            return Ok(sessions);
        }

        /// <summary>
        /// Lấy danh sách lớp được phân công dạy
        /// </summary>
        [HttpGet("classes")]
        public async Task<IActionResult> GetClasses()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var classes = await _context.LopHocs
                .Where(l => l.MaGiaoVien == teacher.MaGiaoVien)
                .Select(l => new
                {
                    l.MaLop,
                    l.MaLopHienThi,
                    courseName = l.MaKhoaHocNavigation.TenKhoaHoc,
                    level = l.MaKhoaHocNavigation.CapDo,
                    l.LichHoc,
                    studentCount = l.HocSinhLopHocs.Count,
                    students = l.HocSinhLopHocs.Select(h => new {
                        id = h.MaHocSinh,
                        name = h.MaHocSinhNavigation.MaNguoiDungNavigation.HoTen ?? "Học sinh #" + h.MaHocSinh,
                        avatar = h.MaHocSinhNavigation.MaNguoiDungNavigation.AnhDaiDien,
                        status = h.TrangThai
                    }).ToList()
                })
                .ToListAsync();

            return Ok(classes);
        }

        /// <summary>
        /// Lấy danh sách lớp dạy hôm nay kèm danh sách học sinh để điểm danh
        /// </summary>
        [HttpGet("today-classes")]
        public async Task<IActionResult> GetTodayClasses()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var today = DateTimeHelper.GetVietnamToday();

            var todaySessions = await _context.BuoiHocs
                .Include(b => b.MaLopNavigation)
                    .ThenInclude(l => l.MaKhoaHocNavigation)
                .Include(b => b.DiemDanhs)
                .Where(b => b.MaGiaoVien == teacher.MaGiaoVien && b.NgayHoc == today)
                .OrderBy(b => b.GioBatDau)
                .ToListAsync();

            var result = new List<object>();

            foreach (var b in todaySessions)
            {
                var students = await _context.HocSinhLopHocs
                    .Include(hs => hs.MaHocSinhNavigation)
                        .ThenInclude(h => h.MaNguoiDungNavigation)
                    .Where(hs => hs.MaLop == b.MaLop && hs.TrangThai == "Dang_Hoc")
                    .ToListAsync();

                var studentList = students.Select(hs => new
                {
                    id = hs.MaHocSinh,
                    name = hs.MaHocSinhNavigation?.MaNguoiDungNavigation?.HoTen ?? $"Học sinh #{hs.MaHocSinh}",
                    status = b.DiemDanhs.FirstOrDefault(d => d.MaHocSinh == hs.MaHocSinh)?.TrangThai switch
                    {
                        "Co_Mat" => "present",
                        "Vang" => "absent",
                        "Muon" => "late",
                        "Co_Phep" => "absent",
                        _ => (string)null
                    },
                    note = ""
                }).ToList();

                int studentCount = students.Count;
                int attendanceCount = b.DiemDanhs.Count;

                string status = "chua";
                if (studentCount > 0 && attendanceCount >= studentCount) status = "done";
                else if (attendanceCount > 0) status = "dang";

                result.Add(new
                {
                    id = b.MaBuoiHoc,
                    b.MaLop,
                    className = b.MaLopNavigation?.MaLopHienThi ?? "N/A",
                    subject = b.MaLopNavigation?.MaKhoaHocNavigation?.TenKhoaHoc ?? "N/A",
                    time = b.GioBatDau.ToString("HH\\:mm") + " - " + b.GioKetThuc.ToString("HH\\:mm"),
                    room = "Phòng " + (b.MaLop % 5 + 1).ToString() + "0" + (b.MaLop % 9 + 1).ToString(),
                    note = b.GhiChu,
                    status = status,
                    students = studentList
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Lấy danh sách bài nộp từ tất cả các lớp giảng viên đang dạy
        /// </summary>
        [HttpGet("submissions")]
        public async Task<IActionResult> GetSubmissions()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var classIds = await _context.LopHocs
                .Where(l => l.MaGiaoVien == teacher.MaGiaoVien)
                .Select(l => l.MaLop)
                .ToListAsync();

            if (classIds.Count == 0) return Ok(Array.Empty<object>());

            var submissions = await _context.BaiNopHocSinhs
                .Where(s => classIds.Contains(s.MaBaiTapNavigation.MaLop))
                .OrderByDescending(s => s.NgayNop)
                .Select(s => new
                {
                    s.MaBaiNop,
                    s.MaBaiTap,
                    homeworkTitle = s.MaBaiTapNavigation.MaBaiTapGocNavigation.TieuDe,
                    classCode = s.MaBaiTapNavigation.MaLopNavigation.MaLopHienThi,
                    studentId = s.MaHocSinh,
                    studentName = s.MaHocSinhNavigation.MaNguoiDungNavigation.HoTen,
                    s.NgayNop,
                    s.DuongDanBaiLam,
                    s.DiemSo,
                    s.LoiPheGiaoVien,
                    s.TrangThai,
                    homeworkLink = s.MaBaiTapNavigation.Link ?? s.MaBaiTapNavigation.MaBaiTapGocNavigation.Link,
                    dueAt = s.MaBaiTapNavigation.HanNop
                })
                .ToListAsync();

            return Ok(submissions);
        }

        /// <summary>
        /// Chấm điểm bài nộp của học sinh
        /// </summary>
        [HttpPut("submissions/{submissionId}/grade")]
        public async Task<IActionResult> GradeSubmission(int submissionId, [FromBody] GradeRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var submission = await _context.BaiNopHocSinhs
                .Include(s => s.MaBaiTapNavigation)
                .FirstOrDefaultAsync(s => s.MaBaiNop == submissionId);

            if (submission == null) return NotFound(new { message = "Không tìm thấy bài nộp." });

            // Verify this teacher owns the class
            var classIds = await _context.LopHocs
                .Where(l => l.MaGiaoVien == teacher.MaGiaoVien)
                .Select(l => l.MaLop)
                .ToListAsync();

            if (!classIds.Contains(submission.MaBaiTapNavigation.MaLop))
                return Forbid();

            submission.DiemSo = request.DiemSo;
            submission.LoiPheGiaoVien = request.NhanXet;
            submission.TrangThai = "Da_Cham";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Chấm điểm thành công." });
        }

        /// <summary>
        /// Lưu điểm danh cho một buổi học
        /// </summary>
        [HttpPost("attendance")]
        public async Task<IActionResult> SaveAttendance([FromBody] AttendanceSaveRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var session = await _context.BuoiHocs.FirstOrDefaultAsync(b => b.MaBuoiHoc == request.MaBuoiHoc);
            if (session == null) return NotFound(new { message = "Không tìm thấy buổi học." });

            if (session.MaGiaoVien != teacher.MaGiaoVien) return Forbid();

            // Remove existing records for this session to overwrite
            var existing = await _context.DiemDanhs.Where(d => d.MaBuoiHoc == request.MaBuoiHoc).ToListAsync();
            _context.DiemDanhs.RemoveRange(existing);

            foreach (var item in request.Students)
            {
                var status = item.Status switch
                {
                    "present" => "Co_Mat",
                    "absent" => "Vang",
                    "late" => "Muon",
                    _ => "Vang"
                };

                _context.DiemDanhs.Add(new backend.Models.DiemDanh
                {
                    MaBuoiHoc = request.MaBuoiHoc,
                    MaHocSinh = item.Id,
                    TrangThai = status
                    // GhiChu = item.Note // Note is not in the DB model according to earlier view but I can add it if needed
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Lưu điểm danh thành công." });
        }

        /// <summary>
        /// Lấy danh sách bài tập mẫu từ kho bài tập gốc
        /// </summary>
        [HttpGet("homework-templates")]
        public async Task<IActionResult> GetHomeworkTemplates()
        {
            var templates = await _context.BaiTapGocs
                .OrderByDescending(b => b.MaBaiTapGoc)
                .Select(b => new
                {
                    b.MaBaiTapGoc,
                    b.TieuDe,
                    b.DoKho,
                    b.LoaiHocThuat,
                    b.Link,
                    courseName = b.MaKhoaHocNavigation.TenKhoaHoc
                })
                .ToListAsync();

            return Ok(templates);
        }

        /// <summary>
        /// Lấy danh sách bài tập đã giao của giáo viên
        /// </summary>
        [HttpGet("assigned-homeworks")]
        public async Task<IActionResult> GetAssignedHomeworks()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var homeworks = await _context.BaiTapVeNhas
                .Include(b => b.MaLopNavigation)
                .Include(b => b.MaBaiTapGocNavigation)
                .Where(b => b.MaLopNavigation.MaGiaoVien == teacher.MaGiaoVien)
                .OrderByDescending(b => b.NgayGiao)
                .Select(b => new
                {
                    b.MaBaiTap,
                    b.MaBaiTapGoc,
                    title = b.MaBaiTapGocNavigation.TieuDe,
                    classCode = b.MaLopNavigation.MaLopHienThi,
                    b.NgayGiao,
                    b.HanNop,
                    b.TrangThai,
                    b.Link,
                    submissionCount = b.BaiNopHocSinhs.Count
                })
                .ToListAsync();

            return Ok(homeworks);
        }

        /// <summary>
        /// Giao bài tập mới cho lớp
        /// </summary>
        [HttpPost("assign-homework")]
        public async Task<IActionResult> AssignHomework([FromBody] HomeworkAssignRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            var lop = await _context.LopHocs.FirstOrDefaultAsync(l => l.MaLop == request.MaLop);
            if (lop == null) return NotFound(new { message = "Không tìm thấy lớp học." });
            if (lop.MaGiaoVien != teacher.MaGiaoVien) return Forbid();

            var newBt = new backend.Models.BaiTapVeNha
            {
                MaBaiTapGoc = request.MaBaiTapGoc,
                MaLop = request.MaLop,
                NgayGiao = DateTimeHelper.GetVietnamNow(),
                HanNop = request.HanNop,
                Link = request.Link,
                TrangThai = "Dang_Mo" // Match DB constraint ('Dang_Mo', 'Dong', 'Huy')
            };

            _context.BaiTapVeNhas.Add(newBt);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Giao bài tập thành công." });
        }

        /// <summary>
        /// Duyệt và công khai bài tập
        /// </summary>
        [HttpPut("homeworks/{id}/publish")]
        public async Task<IActionResult> PublishHomework(int id)
        {
            var bt = await _context.BaiTapVeNhas.FirstOrDefaultAsync(b => b.MaBaiTap == id);
            if (bt == null) return NotFound();

            bt.TrangThai = "Dang_Mo"; // Or "Da_Giao"
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã công khai bài tập." });
        }

        /// <summary>
        /// Lấy chi tiết thống kê nộp bài
        /// </summary>
        [HttpGet("homeworks/{id}/details")]
        public async Task<IActionResult> GetHomeworkDetails(int id)
        {
            var bt = await _context.BaiTapVeNhas
                .Include(b => b.MaLopNavigation)
                .ThenInclude(l => l.HocSinhLopHocs)
                .ThenInclude(h => h.MaHocSinhNavigation)
                .ThenInclude(h => h.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(b => b.MaBaiTap == id);

            if (bt == null) return NotFound();

            var submissions = await _context.BaiNopHocSinhs
                .Where(s => s.MaBaiTap == id)
                .ToListAsync();

            var allStudentsInClass = bt.MaLopNavigation.HocSinhLopHocs
                .Where(h => h.TrangThai == "Dang_Hoc")
                .Select(h => new
                {
                    id = h.MaHocSinh,
                    name = h.MaHocSinhNavigation.MaNguoiDungNavigation.HoTen,
                    hasSubmitted = submissions.Any(s => s.MaHocSinh == h.MaHocSinh),
                    submissionDate = submissions.FirstOrDefault(s => s.MaHocSinh == h.MaHocSinh)?.NgayNop,
                    score = submissions.FirstOrDefault(s => s.MaHocSinh == h.MaHocSinh)?.DiemSo
                }).ToList();

            return Ok(new
            {
                maBaiTap = bt.MaBaiTap,
                title = bt.MaBaiTapGocNavigation?.TieuDe,
                classCode = bt.MaLopNavigation.MaLopHienThi,
                hanNop = bt.HanNop,
                students = allStudentsInClass,
                stats = new
                {
                    total = allStudentsInClass.Count,
                    submitted = allStudentsInClass.Count(s => s.hasSubmitted),
                    pending = allStudentsInClass.Count(s => !s.hasSubmitted)
                }
            });
        }

        /// <summary>
        /// Lấy chi tiết tiến độ học tập của học sinh trong lớp
        /// </summary>
        [HttpGet("students/{studentId}/progress")]
        public async Task<IActionResult> GetStudentProgress(int studentId, [FromQuery] int classId)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Token không hợp lệ." });

            var teacher = await _context.GiaoViens.FirstOrDefaultAsync(g => g.MaNguoiDung == userId);
            if (teacher == null) return NotFound(new { message = "Không tìm thấy thông tin giảng viên." });

            // Verify student is in a class taught by this teacher
            var studentClass = await _context.HocSinhLopHocs
                .Include(h => h.MaLopNavigation)
                .FirstOrDefaultAsync(h => h.MaHocSinh == studentId && h.MaLop == classId);

            if (studentClass == null) return NotFound(new { message = "Không tìm thấy học sinh trong lớp này." });
            if (studentClass.MaLopNavigation.MaGiaoVien != teacher.MaGiaoVien) return Forbid();

            var student = await _context.HocSinhs
                .Include(h => h.MaNguoiDungNavigation)
                .FirstOrDefaultAsync(h => h.MaHocSinh == studentId);

            if (student == null) return NotFound(new { message = "Không tìm thấy thông tin học sinh." });

            // Attendance stats in this class
            var totalSessions = await _context.BuoiHocs.CountAsync(b => b.MaLop == classId && b.NgayHoc <= DateTimeHelper.GetVietnamToday());
            var attendanceRecords = await _context.DiemDanhs
                .Include(d => d.MaBuoiHocNavigation)
                .Where(d => d.MaHocSinh == studentId && d.MaBuoiHocNavigation.MaLop == classId)
                .ToListAsync();

            var presentCount = attendanceRecords.Count(d => d.TrangThai == "Co_Mat");
            var lateCount = attendanceRecords.Count(d => d.TrangThai == "Muon");
            var absentCount = attendanceRecords.Count(d => d.TrangThai == "Vang");

            // Homework stats in this class
            var homeworks = await _context.BaiTapVeNhas
                .Where(b => b.MaLop == classId && b.TrangThai != "Huy")
                .ToListAsync();
            
            var homeworkIds = homeworks.Select(h => h.MaBaiTap).ToList();
            var submissions = await _context.BaiNopHocSinhs
                .Where(s => s.MaHocSinh == studentId && homeworkIds.Contains(s.MaBaiTap))
                .ToListAsync();

            var gradedSubmissions = submissions.Where(s => s.DiemSo != null).ToList();
            var averageScore = gradedSubmissions.Any() ? (double)gradedSubmissions.Average(s => s.DiemSo!) : 0;

            return Ok(new
            {
                info = new
                {
                    id = student.MaHocSinh,
                    name = student.MaNguoiDungNavigation.HoTen,
                    avatar = student.MaNguoiDungNavigation.AnhDaiDien,
                    email = student.MaNguoiDungNavigation.Email,
                    phone = "",
                    apos = student.DiemTongApos
                },
                attendance = new
                {
                    total = totalSessions,
                    present = presentCount,
                    late = lateCount,
                    absent = absentCount,
                    rate = totalSessions > 0 ? Math.Round((double)presentCount / totalSessions * 100, 1) : 0
                },
                homework = new
                {
                    assigned = homeworks.Count,
                    submitted = submissions.Count,
                    averageScore = Math.Round(averageScore, 1),
                    recentGrades = submissions
                        .OrderByDescending(s => s.NgayNop)
                        .Take(5)
                        .Select(s => new {
                            date = s.NgayNop?.ToString("dd/MM/yyyy"),
                            score = s.DiemSo,
                            comment = s.LoiPheGiaoVien
                        })
                }
            });
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
            if (normalized.Contains("mock") || normalized.Contains("test") || normalized.Contains("thi") || normalized.Contains("quiz")) return "exam";
            if (normalized.Contains("practice") || normalized.Contains("workshop") || normalized.Contains("bổ trợ") || normalized.Contains("bo tro")) return "practice";
            return "theory";
        }

        private static string GetPeriod(TimeOnly startTime)
        {
            if (startTime.Hour < 12) return "1 - 3";
            if (startTime.Hour < 18) return "7 - 9";
            return "10 - 12";
        }
    }

    public class GradeRequest
    {
        public decimal DiemSo { get; set; }
        public string? NhanXet { get; set; }
    }

    public class AttendanceSaveRequest
    {
        public int MaBuoiHoc { get; set; }
        public List<StudentAttendanceItem> Students { get; set; } = new();
    }

    public class StudentAttendanceItem
    {
        public int Id { get; set; }
        public string Status { get; set; } = null!;
        public string? Note { get; set; }
    }

    public class HomeworkAssignRequest
    {
        public int MaBaiTapGoc { get; set; }
        public int MaLop { get; set; }
        public DateTime HanNop { get; set; }
        public string? Link { get; set; }
    }
}
