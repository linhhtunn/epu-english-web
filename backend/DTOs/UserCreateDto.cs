using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UserCreateDto
    {
        [Required]
        [StringLength(50)]
        public string TenDangNhap { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(255)]
        public string MatKhau { get; set; }

        [Required]
        [StringLength(100)]
        public string HoTen { get; set; }

        [Required]
        public int MaVaiTro { get; set; }

        public string? AnhDaiDien { get; set; }

        [Required]
        public string TrangThai { get; set; } // 'Hoat_Dong', 'Tam_Khoa', 'Khoa'

        // Extra info depending on role
        public string? PhongBan { get; set; } // for Admin
        public string? ChuyenMon { get; set; } // for Teacher
        public string? SoDienThoai { get; set; } // for Parent
        public int? MaPhuHuynh { get; set; } // for Student
    }
}
