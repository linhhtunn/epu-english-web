using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DangBai
{
    public int MaDangBai { get; set; }

    public string TenDangBai { get; set; } = null!;

    public int MaKyNang { get; set; }

    public int? SoLuongCauMacDinh { get; set; }

    public virtual ICollection<BaiTapGoc> BaiTapGocs { get; set; } = new List<BaiTapGoc>();

    public virtual KyNang MaKyNangNavigation { get; set; } = null!;
}
