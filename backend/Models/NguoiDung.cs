using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class NguoiDung
{
    public int MaNguoiDung { get; set; }

    public string TenDangNhap { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string? Salt { get; set; }

    public string HoTen { get; set; } = null!;

    public int MaVaiTro { get; set; }

    public string? AnhDaiDien { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime? LanDangNhapCuoi { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual GiaoVien? GiaoVien { get; set; }

    public virtual HocSinh? HocSinh { get; set; }

    public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;

    public virtual ICollection<NguoiNhanThongBao> NguoiNhanThongBaos { get; set; } = new List<NguoiNhanThongBao>();

    public virtual PhuHuynh? PhuHuynh { get; set; }

    public virtual QuanTriVien? QuanTriVien { get; set; }

    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();
}
