using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PhongHoc
{
    public int MaPhongHoc { get; set; }

    public string TenPhong { get; set; } = null!;

    public int SucChua { get; set; }

    public string TrangThai { get; set; } = "Hoat_Dong";

    public string? GhiChu { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ChiTietXepLich> ChiTietXepLiches { get; set; } = new List<ChiTietXepLich>();
}
