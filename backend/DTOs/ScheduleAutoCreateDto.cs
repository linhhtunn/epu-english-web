using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ScheduleAutoCreateDto
{
    [Required]
    public int MaLop { get; set; }

    [Required]
    public DateOnly TuNgay { get; set; }

    [Required]
    public DateOnly DenNgay { get; set; }

    public int? MaGiaoVien { get; set; }

    public int? SoBuoiToiDa { get; set; }

    public bool SuDungLichDayMacDinh { get; set; } = true;

    public List<int>? PhongHocUuTien { get; set; }

    public List<ScheduleAutoPatternDto>? MauXepLich { get; set; }

    public string? GhiChu { get; set; }
}
