using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BaoCaoBaiHoc
{
    public int MaBaoCao { get; set; }

    public int MaHocSinh { get; set; }

    public int MaGiaoVien { get; set; }

    public string? TieuDe { get; set; }

    public DateOnly? NgayHoc { get; set; }

    public int? TienDoHoanThanh { get; set; }

    public string? MucTieuBaiHoc { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<ChiTietKyNang> ChiTietKyNangs { get; set; } = new List<ChiTietKyNang>();

    public virtual GiaoVien MaGiaoVienNavigation { get; set; } = null!;

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;
}
