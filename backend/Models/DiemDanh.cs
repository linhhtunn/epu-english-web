using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DiemDanh
{
    public int MaBuoiHoc { get; set; }

    public int MaHocSinh { get; set; }

    public string? TrangThai { get; set; }

    public virtual BuoiHoc MaBuoiHocNavigation { get; set; } = null!;

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;
}
