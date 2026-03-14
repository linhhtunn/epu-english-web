using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class LichDay
{
    public int MaLich { get; set; }

    public int? MaLop { get; set; }

    public int? Thu { get; set; }

    public TimeOnly? GioBatDau { get; set; }

    public TimeOnly? GioKetThuc { get; set; }

    public virtual LopHoc? MaLopNavigation { get; set; }
}
