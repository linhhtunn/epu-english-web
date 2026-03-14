using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BaiKiemTra
{
    public int MaKiemTra { get; set; }

    public int MaLop { get; set; }

    public string? TieuDe { get; set; }

    public int? ThoiGianLamPhut { get; set; }

    public DateTime? HanKetThuc { get; set; }

    public int? TongDiem { get; set; }

    public virtual ICollection<KetQuaKiemTra> KetQuaKiemTras { get; set; } = new List<KetQuaKiemTra>();

    public virtual LopHoc MaLopNavigation { get; set; } = null!;
}
