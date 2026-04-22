using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Utilities;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ClassController : ControllerBase
    {
        private readonly AppDbContext _context;

        private sealed record ScheduleDisplayItem(int? Thu, TimeOnly? GioBatDau, TimeOnly? GioKetThuc);

        public ClassController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetClasses()
        {
            var classes = await _context.LopHocs
                .Include(c => c.MaKhoaHocNavigation)
                .Include(c => c.MaGiaoVienNavigation).ThenInclude(gv => gv.MaNguoiDungNavigation)
                .Include(c => c.LichDays)
                .Select(c => new
                {
                    c.MaLop,
                    c.MaLopHienThi,
                    c.LichHoc,
                    c.NgayTao,
                    CourseName = c.MaKhoaHocNavigation.TenKhoaHoc,
                    TeacherName = c.MaGiaoVienNavigation != null ? c.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen : null,
                    StudentCount = c.HocSinhLopHocs.Count(),
                    LichDays = c.LichDays.Select(ld => new ScheduleDisplayItem(ld.Thu, ld.GioBatDau, ld.GioKetThuc)).ToList()
                })
                .ToListAsync();

            return Ok(classes.Select(c => new
            {
                c.MaLop,
                c.MaLopHienThi,
                LichHoc = BuildScheduleText(c.LichDays, c.LichHoc),
                c.NgayTao,
                c.CourseName,
                c.TeacherName,
                c.StudentCount
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetClass(int id)
        {
            var lophoc = await _context.LopHocs
                .Include(c => c.MaKhoaHocNavigation)
                .Include(c => c.MaGiaoVienNavigation).ThenInclude(gv => gv.MaNguoiDungNavigation)
                .Include(c => c.LichDays)
                .FirstOrDefaultAsync(c => c.MaLop == id);

            if (lophoc == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                lophoc.MaLop,
                lophoc.MaLopHienThi,
                lophoc.MaKhoaHoc,
                lophoc.MaGiaoVien,
                LichHoc = BuildScheduleText(lophoc.LichDays.Select(ld =>
                    new ScheduleDisplayItem(ld.Thu, ld.GioBatDau, ld.GioKetThuc)).ToList(), lophoc.LichHoc),
                CourseName = lophoc.MaKhoaHocNavigation?.TenKhoaHoc,
                TeacherName = lophoc.MaGiaoVienNavigation?.MaNguoiDungNavigation?.HoTen
            });
        }

        [HttpPost]
        public async Task<ActionResult<LopHoc>> PostClass(ClassCreateDto classDto)
        {
            if (await _context.LopHocs.AnyAsync(c => c.MaLopHienThi == classDto.MaLopHienThi))
            {
                return BadRequest("Mã lớp hiển thị đã tồn tại.");
            }

            var normalizedLichHoc = NormalizeScheduleText(classDto.LichHoc);
            var newClass = new LopHoc
            {
                MaLopHienThi = classDto.MaLopHienThi,
                MaKhoaHoc = classDto.MaKhoaHoc,
                MaGiaoVien = classDto.MaGiaoVien,
                LichHoc = normalizedLichHoc,
                NgayTao = DateTime.UtcNow
            };

            _context.LopHocs.Add(newClass);
            await _context.SaveChangesAsync();

            await SyncLichDayAsync(newClass.MaLop, normalizedLichHoc);

            return CreatedAtAction(nameof(GetClass), new { id = newClass.MaLop }, newClass);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutClass(int id, ClassCreateDto classDto)
        {
            var lophoc = await _context.LopHocs
                .Include(c => c.LichDays)
                .FirstOrDefaultAsync(c => c.MaLop == id);
            if (lophoc == null)
            {
                return NotFound();
            }

            if (lophoc.MaLopHienThi != classDto.MaLopHienThi &&
                await _context.LopHocs.AnyAsync(c => c.MaLopHienThi == classDto.MaLopHienThi))
            {
                return BadRequest("Mã lớp hiển thị đã tồn tại.");
            }

            var normalizedLichHoc = NormalizeScheduleText(classDto.LichHoc);

            lophoc.MaLopHienThi = classDto.MaLopHienThi;
            lophoc.MaKhoaHoc = classDto.MaKhoaHoc;
            lophoc.MaGiaoVien = classDto.MaGiaoVien;
            lophoc.LichHoc = normalizedLichHoc;

            _context.Entry(lophoc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                await SyncLichDayAsync(lophoc.MaLop, normalizedLichHoc);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var lophoc = await _context.LopHocs.FindAsync(id);
            if (lophoc == null)
            {
                return NotFound();
            }

            _context.LopHocs.Remove(lophoc);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{classId}/assignStudent/{userId}")]
        public async Task<IActionResult> AssignStudent(int classId, int userId)
        {
            if (!ClassExists(classId))
                return NotFound("Lớp học không tồn tại.");

            var hocSinh = await _context.HocSinhs.FirstOrDefaultAsync(hs => hs.MaNguoiDung == userId);
            if (hocSinh == null)
                return NotFound("Người dùng không phải là học sinh.");

            int studentId = hocSinh.MaHocSinh;

            if (await _context.HocSinhLopHocs.AnyAsync(hslh => hslh.MaLop == classId && hslh.MaHocSinh == studentId))
                return BadRequest("Học sinh này đã được xếp vào lớp.");

            var assignment = new HocSinhLopHoc
            {
                MaLop = classId,
                MaHocSinh = studentId,
                TrangThai = "Dang_Hoc",
                NgayThamGia = DateOnly.FromDateTime(DateTime.Today)
            };

            _context.HocSinhLopHocs.Add(assignment);
            await _context.SaveChangesAsync();

            return Ok("Đã thêm học sinh vào lớp.");
        }

        [HttpGet("{id}/students")]
        public async Task<ActionResult<IEnumerable<object>>> GetStudentsInClass(int id)
        {
            if (!ClassExists(id))
                return NotFound("Lớp học không tồn tại.");

            var students = await (from hslh in _context.HocSinhLopHocs
                                  join hs in _context.HocSinhs on hslh.MaHocSinh equals hs.MaHocSinh
                                  join u in _context.NguoiDungs on hs.MaNguoiDung equals u.MaNguoiDung
                                  where hslh.MaLop == id
                                  select new
                                  {
                                      MaHocSinh = hslh.MaHocSinh,
                                      MaNguoiDung = hs.MaNguoiDung,
                                      HoTen = u.HoTen,
                                      Email = u.Email,
                                      TrangThai = hslh.TrangThai,
                                      NgayThamGia = hslh.NgayThamGia
                                  }).ToListAsync();
            return Ok(students);
        }

        [HttpDelete("{classId}/removeStudent/{studentId}")]
        public async Task<IActionResult> RemoveStudent(int classId, int studentId)
        {
            var assignment = await _context.HocSinhLopHocs
                .FirstOrDefaultAsync(hslh => hslh.MaLop == classId && hslh.MaHocSinh == studentId);

            if (assignment == null)
                return NotFound("Học sinh không có trong lớp này.");

            _context.HocSinhLopHocs.Remove(assignment);
            await _context.SaveChangesAsync();

            return Ok("Đã xóa học sinh khỏi lớp.");
        }

        private async Task SyncLichDayAsync(int maLop, string? lichHoc)
        {
            var existing = await _context.LichDays.Where(x => x.MaLop == maLop).ToListAsync();
            if (existing.Count > 0)
            {
                _context.LichDays.RemoveRange(existing);
                await _context.SaveChangesAsync();
            }

            var scheduleItems = ParseScheduleText(lichHoc);
            if (scheduleItems.Count == 0)
            {
                return;
            }

            var nextId = await _context.LichDays.Select(x => (int?)x.MaLich).MaxAsync() ?? 0;
            var newLichDays = scheduleItems.Select((item, index) => new LichDay
            {
                MaLich = nextId + index + 1,
                MaLop = maLop,
                Thu = item.Thu,
                GioBatDau = item.GioBatDau,
                GioKetThuc = item.GioKetThuc
            }).ToList();

            _context.LichDays.AddRange(newLichDays);
            await _context.SaveChangesAsync();
        }

        private static string? NormalizeScheduleText(string? lichHoc)
        {
            return ClassScheduleParser.Normalize(lichHoc);
        }

        private static string BuildScheduleText(IEnumerable<ScheduleDisplayItem> lichDays, string? fallback)
        {
            var items = lichDays
                .Where(lich => lich.Thu.HasValue && lich.GioBatDau.HasValue && lich.GioKetThuc.HasValue)
                .Select(lich =>
                {
                    var shift = ClassScheduleParser.ShiftMap.FirstOrDefault(x =>
                        x.Value.Start == lich.GioBatDau!.Value && x.Value.End == lich.GioKetThuc!.Value);

                    return new ParsedScheduleItem(
                        ClassScheduleParser.GetDisplayDay(lich.Thu!.Value),
                        lich.Thu.Value,
                        lich.GioBatDau.Value,
                        lich.GioKetThuc.Value,
                        shift.Key);
                });

            return ClassScheduleParser.BuildDisplayText(items, fallback) ?? fallback ?? string.Empty;
        }

        private static List<(int Thu, TimeOnly GioBatDau, TimeOnly GioKetThuc)> ParseScheduleText(string? lichHoc)
        {
            return ClassScheduleParser.Parse(lichHoc)
                .Select(item => (item.Thu, item.GioBatDau, item.GioKetThuc))
                .ToList();
        }

        private bool ClassExists(int id)
        {
            return _context.LopHocs.Any(e => e.MaLop == id);
        }
    }
}
