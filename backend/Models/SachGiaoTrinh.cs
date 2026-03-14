using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class SachGiaoTrinh
{
    public int MaSach { get; set; }

    public string TenSach { get; set; } = null!;

    public string? NhaXuatBan { get; set; }

    public string? TacGia { get; set; }

    public string? PhienBan { get; set; }

    public string? MoTa { get; set; }

    public virtual ICollection<BaiTapGoc> BaiTapGocs { get; set; } = new List<BaiTapGoc>();
}
