using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ClassCreateDto
    {
        [Required]
        [StringLength(20)]
        public string MaLopHienThi { get; set; }

        [Required]
        public int MaKhoaHoc { get; set; }

        public int? MaGiaoVien { get; set; }

        [StringLength(255)]
        public string? LichHoc { get; set; }
    }
}

