using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class TeacherRescheduleRequestCreateDto
{
    [Required]
    public int MaBuoiHoc { get; set; }

    [Required]
    public DateOnly NgayDeXuatMoi { get; set; }

    [Required]
    public int MaKhungGioDeXuat { get; set; }

    public int? MaPhongHocDeXuat { get; set; }

    [MaxLength(500)]
    public string? LyDo { get; set; }
}
