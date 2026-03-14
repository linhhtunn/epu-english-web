using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class KhoaHoc
{
    public int MaKhoaHoc { get; set; }

    public string TenKhoaHoc { get; set; } = null!;

    public string? CapDo { get; set; }

    public string? MoTa { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<BaiTapGoc> BaiTapGocs { get; set; } = new List<BaiTapGoc>();

    public virtual ICollection<LopHoc> LopHocs { get; set; } = new List<LopHoc>();
}
