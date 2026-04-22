using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class AdminRescheduleProcessDto
{
    [Required]
    public string TrangThai { get; set; } = null!;

    public DateOnly? NgayHocMoi { get; set; }

    public int? MaKhungGio { get; set; }

    public int? MaPhongHoc { get; set; }

    [MaxLength(500)]
    public string? GhiChuXuLy { get; set; }
}
