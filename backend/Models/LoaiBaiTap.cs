using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class LoaiBaiTap
{
    public int MaLoaiBaiTap { get; set; }

    public string TenLoai { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? NhomPhanLoai { get; set; }

    public bool? YeuCauChamDiem { get; set; }

    public int? DiemAposGoiY { get; set; }

    public virtual ICollection<BaiTapGoc> BaiTapGocs { get; set; } = new List<BaiTapGoc>();
}
