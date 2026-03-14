using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ChiTietKyNang
{
    public int MaBaoCao { get; set; }

    public int MaKyNang { get; set; }

    public int? DiemSo { get; set; }

    public string? NhanXetGiaoVien { get; set; }

    public virtual BaoCaoBaiHoc MaBaoCaoNavigation { get; set; } = null!;

    public virtual KyNang MaKyNangNavigation { get; set; } = null!;
}
