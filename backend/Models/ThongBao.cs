using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ThongBao
{
    public int MaThongBao { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public string? LoaiThongBao { get; set; }

    public int? MaNguoiGui { get; set; }

    public DateTime? NgayGui { get; set; }

    public virtual NguoiDung? MaNguoiGuiNavigation { get; set; }

    public virtual ICollection<NguoiNhanThongBao> NguoiNhanThongBaos { get; set; } = new List<NguoiNhanThongBao>();
}
