using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class LopHoc
{
    public int MaLop { get; set; }

    public string? MaLopHienThi { get; set; }

    public int MaKhoaHoc { get; set; }

    public int? MaGiaoVien { get; set; }

    public string? LichHoc { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<BaiKiemTra> BaiKiemTras { get; set; } = new List<BaiKiemTra>();

    public virtual ICollection<BaiTapVeNha> BaiTapVeNhas { get; set; } = new List<BaiTapVeNha>();

    public virtual ICollection<BuoiHoc> BuoiHocs { get; set; } = new List<BuoiHoc>();

    public virtual ICollection<ChuDeBaiGiang> ChuDeBaiGiangs { get; set; } = new List<ChuDeBaiGiang>();

    public virtual ICollection<DiemDanhGiaoVien> DiemDanhGiaoViens { get; set; } = new List<DiemDanhGiaoVien>();

    public virtual ICollection<HocSinhLopHoc> HocSinhLopHocs { get; set; } = new List<HocSinhLopHoc>();

    public virtual ICollection<LichDay> LichDays { get; set; } = new List<LichDay>();

    public virtual GiaoVien? MaGiaoVienNavigation { get; set; }

    public virtual KhoaHoc MaKhoaHocNavigation { get; set; } = null!;

    public virtual ICollection<YeuCauVaoLop> YeuCauVaoLops { get; set; } = new List<YeuCauVaoLop>();
}
