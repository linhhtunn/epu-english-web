using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data; // <--- SỬA: Phải là backend.Data thay vì QuanLyTrungTam.Data
using QuanLyTrungTam.DTOs;

namespace QuanLyTrungTam.Controllers
{
    [Authorize(Roles = "Phu_Huynh")]
    [Route("api/[controller]")]
    [ApiController]
    public class ParentController : ControllerBase
    {
        // SỬA: Đổi ApplicationDbContext thành AppDbContext
        private readonly AppDbContext _context;

        public ParentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("child-summary/{userId}")]
        public async Task<IActionResult> GetChildSummary(int userId)
        {
            // Logic lấy dữ liệu con cái từ _context
            var data = await (from hs in _context.HocSinhs
                              join nd in _context.NguoiDungs on hs.MaNguoiDung equals nd.MaNguoiDung
                              where nd.MaNguoiDung == userId // Giả sử query theo userId
                              select new ChildSummaryDto
                              {
                                  MaHocSinh = hs.MaHocSinh,
                                  TenCon = nd.HoTen,
                                  MaLopHienThi = "Lớp 10A1", // Ví dụ gán cứng để test
                                  TenKhoaHoc = "Toán nâng cao",
                                  NhanXetMoiNhat = "Con học tập rất tốt."
                              }).FirstOrDefaultAsync();

            if (data == null) return NotFound("Không tìm thấy dữ liệu.");
            return Ok(data);
        }
    }
}