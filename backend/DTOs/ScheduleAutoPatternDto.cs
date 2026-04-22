using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ScheduleAutoPatternDto
{
    [Range(1, 7)]
    public int Thu { get; set; }

    [Required]
    public int MaKhungGio { get; set; }

    public int? MaPhongHoc { get; set; }
}
