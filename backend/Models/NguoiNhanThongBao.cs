using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class NguoiNhanThongBao
{
    public int MaThongBao { get; set; }

    public int MaNguoiDung { get; set; }

    public bool? DaDoc { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ThongBao MaThongBaoNavigation { get; set; } = null!;
}
