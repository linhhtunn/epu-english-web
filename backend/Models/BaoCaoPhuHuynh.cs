using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BaoCaoPhuHuynh
{
    public int MaBaoCao { get; set; }

    public int MaHocSinh { get; set; }

    public int MaPhuHuynh { get; set; }

    public int Thang { get; set; }

    public int Nam { get; set; }

    public string? NhanXetGiaoVien { get; set; }

    public string? TienDoHocTap { get; set; }

    public int? SoBuoiVang { get; set; }

    public int? TongDiemApos { get; set; }

    public string? TinhTrangHocPhi { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;

    public virtual PhuHuynh MaPhuHuynhNavigation { get; set; } = null!;
}
