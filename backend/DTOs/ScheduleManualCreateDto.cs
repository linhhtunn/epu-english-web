using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ScheduleManualCreateDto
{
    [Required]
    public int MaLop { get; set; }

    [Required]
    public DateOnly NgayHoc { get; set; }

    [Required]
    public int MaKhungGio { get; set; }

    [Required]
    public int MaPhongHoc { get; set; }

    public int? MaGiaoVien { get; set; }

    public string TrangThaiGiaoVien { get; set; } = "Day";

    public string? GhiChu { get; set; }
}
