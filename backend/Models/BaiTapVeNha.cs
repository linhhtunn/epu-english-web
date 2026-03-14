using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BaiTapVeNha
{
    public int MaBaiTap { get; set; }

    public int MaBaiTapGoc { get; set; }

    public int MaLop { get; set; }

    public DateTime? NgayGiao { get; set; }

    public DateTime HanNop { get; set; }

    public int? ThuongApos { get; set; }

    public string? Link { get; set; }

    public string? TrangThai { get; set; }

    public string? KieuNop { get; set; }

    public virtual ICollection<BaiNopHocSinh> BaiNopHocSinhs { get; set; } = new List<BaiNopHocSinh>();

    public virtual BaiTapGoc MaBaiTapGocNavigation { get; set; } = null!;

    public virtual LopHoc MaLopNavigation { get; set; } = null!;
}
