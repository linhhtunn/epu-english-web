using System;

namespace backend.Models;

public partial class ChiTietXepLich
{
    public int MaChiTietXepLich { get; set; }

    public int MaBuoiHoc { get; set; }

    public int MaPhongHoc { get; set; }

    public int MaKhungGio { get; set; }

    public int? MaDotXepLich { get; set; }

    public string LoaiXepLich { get; set; } = null!;

    public string TrangThai { get; set; } = "Hoat_Dong";

    public string? GhiChu { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual BuoiHoc MaBuoiHocNavigation { get; set; } = null!;

    public virtual DotXepLich? MaDotXepLichNavigation { get; set; }

    public virtual KhungGioHoc MaKhungGioNavigation { get; set; } = null!;

    public virtual PhongHoc MaPhongHocNavigation { get; set; } = null!;
}
