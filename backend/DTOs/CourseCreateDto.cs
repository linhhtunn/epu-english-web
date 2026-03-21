using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CourseCreateDto
    {
        [Required]
        [StringLength(100)]
        public string TenKhoaHoc { get; set; }

        [StringLength(50)]
        public string? CapDo { get; set; }

        public string? MoTa { get; set; }
    }
}

