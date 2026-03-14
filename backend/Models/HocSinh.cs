using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class HocSinh
{
    public int MaHocSinh { get; set; }

    public int MaNguoiDung { get; set; }

    public int? MaPhuHuynh { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public int? DiemTongApos { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<BaiNopHocSinh> BaiNopHocSinhs { get; set; } = new List<BaiNopHocSinh>();

    public virtual ICollection<BaoCaoBaiHoc> BaoCaoBaiHocs { get; set; } = new List<BaoCaoBaiHoc>();

    public virtual ICollection<BaoCaoPhuHuynh> BaoCaoPhuHuynhs { get; set; } = new List<BaoCaoPhuHuynh>();

    public virtual ICollection<DiemDanh> DiemDanhs { get; set; } = new List<DiemDanh>();

    public virtual ICollection<HocSinhLopHoc> HocSinhLopHocs { get; set; } = new List<HocSinhLopHoc>();

    public virtual ICollection<KetQuaKiemTra> KetQuaKiemTras { get; set; } = new List<KetQuaKiemTra>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual PhuHuynh? MaPhuHuynhNavigation { get; set; }

    public virtual ICollection<NhatKyApo> NhatKyApos { get; set; } = new List<NhatKyApo>();

    public virtual ICollection<ThongKeHocTap> ThongKeHocTaps { get; set; } = new List<ThongKeHocTap>();

    public virtual ICollection<YeuCauVaoLop> YeuCauVaoLops { get; set; } = new List<YeuCauVaoLop>();
}
