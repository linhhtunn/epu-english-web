using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class NhanXetBaiLam
{
    public int MaNhanXet { get; set; }

    public int MaBaiNop { get; set; }

    public string? NoiDung { get; set; }

    public int? ViTriBatDau { get; set; }

    public int? ViTriKetThuc { get; set; }

    public string? NguoiNhanXet { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual BaiNopHocSinh MaBaiNopNavigation { get; set; } = null!;
}
