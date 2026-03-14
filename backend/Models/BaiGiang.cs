using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BaiGiang
{
    public int MaBaiGiang { get; set; }

    public int MaChuDe { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public string? FileDinhKem { get; set; }

    public DateTime? NgayDang { get; set; }

    public virtual ChuDeBaiGiang MaChuDeNavigation { get; set; } = null!;
}
