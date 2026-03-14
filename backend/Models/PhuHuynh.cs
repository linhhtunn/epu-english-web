using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PhuHuynh
{
    public int MaPhuHuynh { get; set; }

    public int MaNguoiDung { get; set; }

    public string? SoDienThoai { get; set; }

    public string? DiaChi { get; set; }

    public virtual ICollection<BaoCaoPhuHuynh> BaoCaoPhuHuynhs { get; set; } = new List<BaoCaoPhuHuynh>();

    public virtual ICollection<HocSinh> HocSinhs { get; set; } = new List<HocSinh>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
