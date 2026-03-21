using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CourseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Course
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KhoaHoc>>> GetCourses()
        {
            var courses = await _context.KhoaHocs.ToListAsync();
            return Ok(courses);
        }

        // GET: api/Course/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KhoaHoc>> GetCourse(int id)
        {
            var course = await _context.KhoaHocs.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }

        // POST: api/Course
        [HttpPost]
        public async Task<ActionResult<KhoaHoc>> PostCourse(CourseCreateDto courseDto)
        {
            var newCourse = new KhoaHoc
            {
                TenKhoaHoc = courseDto.TenKhoaHoc,
                CapDo = courseDto.CapDo,
                MoTa = courseDto.MoTa,
                NgayTao = DateTime.UtcNow
            };

            _context.KhoaHocs.Add(newCourse);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = newCourse.MaKhoaHoc }, newCourse);
        }

        // PUT: api/Course/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, CourseCreateDto courseDto)
        {
            var course = await _context.KhoaHocs.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            course.TenKhoaHoc = courseDto.TenKhoaHoc;
            course.CapDo = courseDto.CapDo;
            course.MoTa = courseDto.MoTa;

            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
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

        // DELETE: api/Course/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.KhoaHocs.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            _context.KhoaHocs.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(int id)
        {
            return _context.KhoaHocs.Any(e => e.MaKhoaHoc == id);
        }
    }
}

