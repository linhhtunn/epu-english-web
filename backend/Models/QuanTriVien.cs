using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class QuanTriVien
{
    public int MaQuanTri { get; set; }

    public int MaNguoiDung { get; set; }

    public string? PhongBan { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
