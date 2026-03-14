using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DiemDanhGiaoVien
{
    public int MaDiemDanh { get; set; }

    public int MaGiaoVien { get; set; }

    public int MaLop { get; set; }

    public DateOnly NgayDay { get; set; }

    public string TrangThai { get; set; } = null!;

    public string? GhiChu { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual GiaoVien MaGiaoVienNavigation { get; set; } = null!;

    public virtual LopHoc MaLopNavigation { get; set; } = null!;
}
