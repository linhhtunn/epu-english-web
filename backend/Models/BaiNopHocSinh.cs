using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BaiNopHocSinh
{
    public int MaBaiNop { get; set; }

    public int MaBaiTap { get; set; }

    public int MaHocSinh { get; set; }

    public DateTime? NgayNop { get; set; }

    public string? DuongDanBaiLam { get; set; }

    public decimal? DiemSo { get; set; }

    public string? LoiPheGiaoVien { get; set; }

    public string? TrangThai { get; set; }

    public virtual BaiTapVeNha MaBaiTapNavigation { get; set; } = null!;

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;

    public virtual ICollection<NhanXetBaiLam> NhanXetBaiLams { get; set; } = new List<NhanXetBaiLam>();
}
