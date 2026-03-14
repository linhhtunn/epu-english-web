using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class YeuCauVaoLop
{
    public int MaYeuCau { get; set; }

    public int MaHocSinh { get; set; }

    public int MaLop { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayYeuCau { get; set; }

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;

    public virtual LopHoc MaLopNavigation { get; set; } = null!;
}
