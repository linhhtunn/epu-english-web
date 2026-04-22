using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class GiaoVien
{
    public int MaGiaoVien { get; set; }

    public int MaNguoiDung { get; set; }

    public string? ChuyenMon { get; set; }

    public string? QuocTich { get; set; }

    public string? TieuSu { get; set; }

    public virtual ICollection<BaoCaoBaiHoc> BaoCaoBaiHocs { get; set; } = new List<BaoCaoBaiHoc>();

    public virtual ICollection<BuoiHoc> BuoiHocs { get; set; } = new List<BuoiHoc>();

    public virtual ICollection<DiemDanhGiaoVien> DiemDanhGiaoViens { get; set; } = new List<DiemDanhGiaoVien>();

    public virtual ICollection<LopHoc> LopHocs { get; set; } = new List<LopHoc>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<YeuCauDoiLich> YeuCauDoiLiches { get; set; } = new List<YeuCauDoiLich>();
}
