using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class KyNang
{
    public int MaKyNang { get; set; }

    public string TenKyNang { get; set; } = null!;

    public virtual ICollection<ChiTietKyNang> ChiTietKyNangs { get; set; } = new List<ChiTietKyNang>();

    public virtual ICollection<DangBai> DangBais { get; set; } = new List<DangBai>();
}
