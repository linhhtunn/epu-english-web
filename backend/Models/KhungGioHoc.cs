using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class KhungGioHoc
{
    public int MaKhungGio { get; set; }

    public string TenKhungGio { get; set; } = null!;

    public TimeOnly GioBatDau { get; set; }

    public TimeOnly GioKetThuc { get; set; }

    public int ThuTu { get; set; }

    public string TrangThai { get; set; } = "Hoat_Dong";

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ChiTietXepLich> ChiTietXepLiches { get; set; } = new List<ChiTietXepLich>();
}
