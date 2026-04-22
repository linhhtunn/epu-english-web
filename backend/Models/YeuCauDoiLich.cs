using System;

namespace backend.Models;

public partial class YeuCauDoiLich
{
    public int MaYeuCau { get; set; }

    public int MaBuoiHoc { get; set; }

    public int MaGiaoVien { get; set; }

    public DateOnly NgayDeXuatMoi { get; set; }

    public int MaKhungGioDeXuat { get; set; }

    public int? MaPhongHocDeXuat { get; set; }

    public string? LyDo { get; set; }

    public string TrangThai { get; set; } = "Cho_Duyet";

    public int? MaNguoiXuLy { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime? NgayXuLy { get; set; }

    public string? GhiChuXuLy { get; set; }

    public virtual BuoiHoc MaBuoiHocNavigation { get; set; } = null!;

    public virtual GiaoVien MaGiaoVienNavigation { get; set; } = null!;

    public virtual KhungGioHoc MaKhungGioDeXuatNavigation { get; set; } = null!;

    public virtual NguoiDung? MaNguoiXuLyNavigation { get; set; }

    public virtual PhongHoc? MaPhongHocDeXuatNavigation { get; set; }
}
