using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DotXepLich
{
    public int MaDotXepLich { get; set; }

    public int MaLop { get; set; }

    public int MaNguoiTao { get; set; }

    public string CheDoXepLich { get; set; } = null!;

    public DateOnly TuNgay { get; set; }

    public DateOnly DenNgay { get; set; }

    public string TrangThai { get; set; } = null!;

    public int TongBuoiDuKien { get; set; }

    public int TongBuoiDaXep { get; set; }

    public string? GhiChu { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ChiTietXepLich> ChiTietXepLiches { get; set; } = new List<ChiTietXepLich>();
}
