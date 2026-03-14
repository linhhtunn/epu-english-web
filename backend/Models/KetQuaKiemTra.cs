using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class KetQuaKiemTra
{
    public int MaKiemTra { get; set; }

    public int MaHocSinh { get; set; }

    public decimal? DiemSo { get; set; }

    public string? NhanXetGiaoVien { get; set; }

    public DateTime? NgayNop { get; set; }

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;

    public virtual BaiKiemTra MaKiemTraNavigation { get; set; } = null!;
}
