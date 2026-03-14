using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ChuDeBaiGiang
{
    public int MaChuDe { get; set; }

    public int MaLop { get; set; }

    public string? TenChuDe { get; set; }

    public virtual ICollection<BaiGiang> BaiGiangs { get; set; } = new List<BaiGiang>();

    public virtual LopHoc MaLopNavigation { get; set; } = null!;
}
