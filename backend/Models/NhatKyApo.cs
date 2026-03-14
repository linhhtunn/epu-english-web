using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class NhatKyApo
{
    public int MaLog { get; set; }

    public int MaHocSinh { get; set; }

    public int? SoDiem { get; set; }

    public string? LyDo { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual HocSinh MaHocSinhNavigation { get; set; } = null!;
}
