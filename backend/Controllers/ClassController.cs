using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ClassController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClassController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Class
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetClasses()
        {
            var classes = await _context.LopHocs
                .Include(c => c.MaKhoaHocNavigation)
                .Include(c => c.MaGiaoVienNavigation).ThenInclude(gv => gv.MaNguoiDungNavigation)
                .Select(c => new
                {
                    c.MaLop,
                    c.MaLopHienThi,
                    c.LichHoc,
                    c.NgayTao,
                    CourseName = c.MaKhoaHocNavigation.TenKhoaHoc,
                    TeacherName = c.MaGiaoVienNavigation != null ? c.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen : null,
                    StudentCount = c.HocSinhLopHocs.Count()
                })
                .ToListAsync();

            return Ok(classes);
        }

        // GET: api/Class/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetClass(int id)
        {
            var lophoc = await _context.LopHocs
                .Include(c => c.MaKhoaHocNavigation)
                .Include(c => c.MaGiaoVienNavigation).ThenInclude(gv => gv.MaNguoiDungNavigation)
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
                lophoc.LichHoc,
                CourseName = lophoc.MaKhoaHocNavigation?.TenKhoaHoc,
                TeacherName = lophoc.MaGiaoVienNavigation?.MaNguoiDungNavigation?.HoTen
            });
        }

        // POST: api/Class
        [HttpPost]
        public async Task<ActionResult<LopHoc>> PostClass(ClassCreateDto classDto)
        {
            // Check if class code exists
            if (await _context.LopHocs.AnyAsync(c => c.MaLopHienThi == classDto.MaLopHienThi))
            {
                return BadRequest("Mã lớp hiển thị đã tồn tại.");
            }

            var newClass = new LopHoc
            {
                MaLopHienThi = classDto.MaLopHienThi,
                MaKhoaHoc = classDto.MaKhoaHoc,
                MaGiaoVien = classDto.MaGiaoVien,
                LichHoc = classDto.LichHoc,
                NgayTao = DateTime.UtcNow
            };

            _context.LopHocs.Add(newClass);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClass), new { id = newClass.MaLop }, newClass);
        }

        // PUT: api/Class/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClass(int id, ClassCreateDto classDto)
        {
            var lophoc = await _context.LopHocs.FindAsync(id);
            if (lophoc == null)
            {
                return NotFound();
            }

            // Check if changing class code to one that already exists
            if (lophoc.MaLopHienThi != classDto.MaLopHienThi && await _context.LopHocs.AnyAsync(c => c.MaLopHienThi == classDto.MaLopHienThi))
            {
                return BadRequest("Mã lớp hiển thị đã tồn tại.");
            }

            lophoc.MaLopHienThi = classDto.MaLopHienThi;
            lophoc.MaKhoaHoc = classDto.MaKhoaHoc;
            lophoc.MaGiaoVien = classDto.MaGiaoVien;
            lophoc.LichHoc = classDto.LichHoc;

            _context.Entry(lophoc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Class/5
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

        // POST: api/Class/{classId}/assignStudent/{userId}
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

        // DELETE: api/Class/{classId}/removeStudent/{studentId}
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

        private bool ClassExists(int id)
        {
            return _context.LopHocs.Any(e => e.MaLop == id);
        }
    }
}
