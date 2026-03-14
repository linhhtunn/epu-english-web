using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class BaiTapGoc
{
    public int MaBaiTapGoc { get; set; }

    public string TieuDe { get; set; } = null!;

    public string? NoiDung { get; set; }

    public int? MaSach { get; set; }

    public int? MaKhoaHoc { get; set; }

    public string? DonViBai { get; set; }

    public string? Trang { get; set; }

    public string? Link { get; set; }

    public int MaLoaiBaiTap { get; set; }

    public string? DoKho { get; set; }

    public int? ThoiGianLamBaiPhut { get; set; }

    public string? TrangThai { get; set; }

    public string? LoaiHocThuat { get; set; }

    public int? MaDangBai { get; set; }

    public int? CapDoHoc { get; set; }

    public string? ChungChi { get; set; }

    public virtual ICollection<BaiTapVeNha> BaiTapVeNhas { get; set; } = new List<BaiTapVeNha>();

    public virtual DangBai? MaDangBaiNavigation { get; set; }

    public virtual KhoaHoc? MaKhoaHocNavigation { get; set; }

    public virtual LoaiBaiTap MaLoaiBaiTapNavigation { get; set; } = null!;

    public virtual SachGiaoTrinh? MaSachNavigation { get; set; }
}
