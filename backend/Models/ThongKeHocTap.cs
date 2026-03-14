using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ThongKeHocTap
{
    public int MaThongKe { get; set; }

    public int? MaHocSinh { get; set; }

    public int? TongBaiTap { get; set; }

    public int? TongBaiHoanThanh { get; set; }

    public decimal? DiemTrungBinh { get; set; }

    public virtual HocSinh? MaHocSinhNavigation { get; set; }
}
