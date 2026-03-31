using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ParentController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả con của phụ huynh (theo maPhuHuynh = profileId).
        /// GET: api/Parent/{parentId}/children
        /// </summary>
        [HttpGet("{parentId}/children")]
        public async Task<IActionResult> GetChildren(int parentId)
        {
            var children = await _context.HocSinhs
                .Where(hs => hs.MaPhuHuynh == parentId)
                .Include(hs => hs.MaNguoiDungNavigation)
                .Include(hs => hs.HocSinhLopHocs)
                    .ThenInclude(hslh => hslh.MaLopNavigation)
                    .ThenInclude(l => l.MaKhoaHocNavigation)
                .Select(hs => new
                {
                    hs.MaHocSinh,
                    HoTen = hs.MaNguoiDungNavigation.HoTen,
                    NgaySinh = hs.NgaySinh != null ? hs.NgaySinh.Value.ToString("yyyy-MM-dd") : null,
                    hs.DiemTongApos,
                    LopHoc = hs.HocSinhLopHocs
                        .Where(hslh => hslh.TrangThai == "Dang_Hoc")
                        .Select(hslh => new
                        {
                            hslh.MaLop,
                            MaLopHienThi = hslh.MaLopNavigation.MaLopHienThi,
                            TenKhoaHoc = hslh.MaLopNavigation.MaKhoaHocNavigation != null
                                ? hslh.MaLopNavigation.MaKhoaHocNavigation.TenKhoaHoc
                                : null,
                            LichHoc = hslh.MaLopNavigation.LichHoc
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(children);
        }

        /// <summary>
        /// Lấy lịch sử điểm danh của 1 học sinh (dành cho phụ huynh xem).
        /// GET: api/Parent/student/{studentId}/attendance
        /// </summary>
        [HttpGet("student/{studentId}/attendance")]
        public async Task<IActionResult> GetStudentAttendance(int studentId)
        {
            var records = await _context.DiemDanhs
                .Where(d => d.MaHocSinh == studentId)
                .Include(d => d.MaBuoiHocNavigation)
                    .ThenInclude(b => b.MaLopNavigation)
                .OrderByDescending(d => d.MaBuoiHocNavigation.NgayHoc)
                .Select(d => new
                {
                    NgayHoc = d.MaBuoiHocNavigation.NgayHoc.ToString("yyyy-MM-dd"),
                    GioBatDau = d.MaBuoiHocNavigation.GioBatDau.ToString("HH:mm"),
                    GioKetThuc = d.MaBuoiHocNavigation.GioKetThuc.ToString("HH:mm"),
                    ClassName = d.MaBuoiHocNavigation.MaLopNavigation.MaLopHienThi,
                    d.TrangThai
                })
                .ToListAsync();

            var summary = new
            {
                TongBuoi = records.Count,
                CoMat = records.Count(r => r.TrangThai == "Co_Mat"),
                Vang = records.Count(r => r.TrangThai == "Vang"),
                DiMuon = records.Count(r => r.TrangThai == "Di_Muon"),
                ChiTiet = records
            };

            return Ok(summary);
        }
    }
}