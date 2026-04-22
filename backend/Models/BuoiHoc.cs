using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BuoiHoc
{
    public int MaBuoiHoc { get; set; }

    public int MaLop { get; set; }

    public DateOnly NgayHoc { get; set; }

    public TimeOnly GioBatDau { get; set; }

    public TimeOnly GioKetThuc { get; set; }

    public int MaGiaoVien { get; set; }

    public string? TrangThaiGiaoVien { get; set; }

    public string? GhiChu { get; set; }

    public virtual ICollection<ChiTietXepLich> ChiTietXepLiches { get; set; } = new List<ChiTietXepLich>();

    public virtual ICollection<DiemDanh> DiemDanhs { get; set; } = new List<DiemDanh>();

    public virtual GiaoVien MaGiaoVienNavigation { get; set; } = null!;

    public virtual LopHoc MaLopNavigation { get; set; } = null!;

    public virtual ICollection<YeuCauDoiLich> YeuCauDoiLiches { get; set; } = new List<YeuCauDoiLich>();
}
