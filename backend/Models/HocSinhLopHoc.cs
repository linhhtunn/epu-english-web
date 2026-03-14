using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class HocSinhLopHoc
{
    public int MaHocSinh { get; set; }

    public int MaLop { get; set; }

    public DateOnly? NgayThamGia { get; set; }

    public string? TrangThai { get; set; }

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;

    public virtual LopHoc MaLopNavigation { get; set; } = null!;
}
