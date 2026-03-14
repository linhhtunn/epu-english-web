using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using backend.Models;

namespace backend.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BaiGiang> BaiGiangs { get; set; }

    public virtual DbSet<BaiKiemTra> BaiKiemTras { get; set; }

    public virtual DbSet<BaiNopHocSinh> BaiNopHocSinhs { get; set; }

    public virtual DbSet<BaiTapGoc> BaiTapGocs { get; set; }

    public virtual DbSet<BaiTapVeNha> BaiTapVeNhas { get; set; }

    public virtual DbSet<BaoCaoBaiHoc> BaoCaoBaiHocs { get; set; }

    public virtual DbSet<BaoCaoPhuHuynh> BaoCaoPhuHuynhs { get; set; }

    public virtual DbSet<BuoiHoc> BuoiHocs { get; set; }

    public virtual DbSet<ChiTietKyNang> ChiTietKyNangs { get; set; }

    public virtual DbSet<ChuDeBaiGiang> ChuDeBaiGiangs { get; set; }

    public virtual DbSet<DangBai> DangBais { get; set; }

    public virtual DbSet<DiemDanh> DiemDanhs { get; set; }

    public virtual DbSet<DiemDanhGiaoVien> DiemDanhGiaoViens { get; set; }

    public virtual DbSet<GiaoVien> GiaoViens { get; set; }

    public virtual DbSet<HocSinh> HocSinhs { get; set; }

    public virtual DbSet<HocSinhLopHoc> HocSinhLopHocs { get; set; }

    public virtual DbSet<KetQuaKiemTra> KetQuaKiemTras { get; set; }

    public virtual DbSet<KhoaHoc> KhoaHocs { get; set; }

    public virtual DbSet<KyNang> KyNangs { get; set; }

    public virtual DbSet<LichDay> LichDays { get; set; }

    public virtual DbSet<LoaiBaiTap> LoaiBaiTaps { get; set; }

    public virtual DbSet<LopHoc> LopHocs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NguoiNhanThongBao> NguoiNhanThongBaos { get; set; }

    public virtual DbSet<NhanXetBaiLam> NhanXetBaiLams { get; set; }

    public virtual DbSet<NhatKyApo> NhatKyApos { get; set; }

    public virtual DbSet<PhuHuynh> PhuHuynhs { get; set; }

    public virtual DbSet<QuanTriVien> QuanTriViens { get; set; }

    public virtual DbSet<SachGiaoTrinh> SachGiaoTrinhs { get; set; }

    public virtual DbSet<ThongBao> ThongBaos { get; set; }

    public virtual DbSet<ThongKeHocTap> ThongKeHocTaps { get; set; }

    public virtual DbSet<VaiTro> VaiTros { get; set; }

    public virtual DbSet<YeuCauVaoLop> YeuCauVaoLops { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=QuanLyTrungTam;user=root", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.4.28-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<BaiGiang>(entity =>
        {
            entity.HasKey(e => e.MaBaiGiang).HasName("PRIMARY");

            entity.ToTable("baiGiang");

            entity.HasIndex(e => e.MaChuDe, "fk_baigiang_chude");

            entity.Property(e => e.MaBaiGiang)
                .HasColumnType("int(11)")
                .HasColumnName("maBaiGiang");
            entity.Property(e => e.FileDinhKem)
                .HasMaxLength(500)
                .HasColumnName("fileDinhKem");
            entity.Property(e => e.MaChuDe)
                .HasColumnType("int(11)")
                .HasColumnName("maChuDe");
            entity.Property(e => e.NgayDang)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayDang");
            entity.Property(e => e.NoiDung)
                .HasColumnType("text")
                .HasColumnName("noiDung");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieuDe");

            entity.HasOne(d => d.MaChuDeNavigation).WithMany(p => p.BaiGiangs)
                .HasForeignKey(d => d.MaChuDe)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_baigiang_chude");
        });

        modelBuilder.Entity<BaiKiemTra>(entity =>
        {
            entity.HasKey(e => e.MaKiemTra).HasName("PRIMARY");

            entity.ToTable("baiKiemTra");

            entity.HasIndex(e => e.MaLop, "fk_bkt_lop");

            entity.Property(e => e.MaKiemTra)
                .HasColumnType("int(11)")
                .HasColumnName("maKiemTra");
            entity.Property(e => e.HanKetThuc)
                .HasColumnType("datetime")
                .HasColumnName("hanKetThuc");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.ThoiGianLamPhut)
                .HasColumnType("int(11)")
                .HasColumnName("thoiGianLamPhut");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieuDe");
            entity.Property(e => e.TongDiem)
                .HasDefaultValueSql("'100'")
                .HasColumnType("int(11)")
                .HasColumnName("tongDiem");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.BaiKiemTras)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_bkt_lop");
        });

        modelBuilder.Entity<BaiNopHocSinh>(entity =>
        {
            entity.HasKey(e => e.MaBaiNop).HasName("PRIMARY");

            entity.ToTable("baiNopHocSinh");

            entity.HasIndex(e => e.MaHocSinh, "fk_bainop_hs");

            entity.HasIndex(e => new { e.MaBaiTap, e.MaHocSinh }, "uqBaiNop").IsUnique();

            entity.Property(e => e.MaBaiNop)
                .HasColumnType("int(11)")
                .HasColumnName("maBaiNop");
            entity.Property(e => e.DiemSo)
                .HasPrecision(5, 2)
                .HasColumnName("diemSo");
            entity.Property(e => e.DuongDanBaiLam)
                .HasColumnType("text")
                .HasColumnName("duongDanBaiLam");
            entity.Property(e => e.LoiPheGiaoVien)
                .HasColumnType("text")
                .HasColumnName("loiPheGiaoVien");
            entity.Property(e => e.MaBaiTap)
                .HasColumnType("int(11)")
                .HasColumnName("maBaiTap");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.NgayNop)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayNop");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaBaiTapNavigation).WithMany(p => p.BaiNopHocSinhs)
                .HasForeignKey(d => d.MaBaiTap)
                .HasConstraintName("fk_bainop_btvn");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.BaiNopHocSinhs)
                .HasForeignKey(d => d.MaHocSinh)
                .HasConstraintName("fk_bainop_hs");
        });

        modelBuilder.Entity<BaiTapGoc>(entity =>
        {
            entity.HasKey(e => e.MaBaiTapGoc).HasName("PRIMARY");

            entity.ToTable("baiTapGoc");

            entity.HasIndex(e => e.MaDangBai, "fk_baitapgoc_dangbai");

            entity.HasIndex(e => e.MaKhoaHoc, "fk_baitapgoc_khoahoc");

            entity.HasIndex(e => e.MaLoaiBaiTap, "fk_baitapgoc_loai");

            entity.HasIndex(e => e.MaSach, "fk_baitapgoc_sach");

            entity.Property(e => e.MaBaiTapGoc)
                .HasColumnType("int(11)")
                .HasColumnName("maBaiTapGoc");
            entity.Property(e => e.CapDoHoc)
                .HasColumnType("int(11)")
                .HasColumnName("capDoHoc");
            entity.Property(e => e.ChungChi)
                .HasMaxLength(20)
                .HasColumnName("chungChi");
            entity.Property(e => e.DoKho)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Trung_Binh'")
                .HasColumnName("doKho");
            entity.Property(e => e.DonViBai)
                .HasMaxLength(50)
                .HasColumnName("donViBai");
            entity.Property(e => e.Link)
                .HasMaxLength(500)
                .HasColumnName("link");
            entity.Property(e => e.LoaiHocThuat)
                .HasMaxLength(50)
                .HasColumnName("loaiHocThuat");
            entity.Property(e => e.MaDangBai)
                .HasColumnType("int(11)")
                .HasColumnName("maDangBai");
            entity.Property(e => e.MaKhoaHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maKhoaHoc");
            entity.Property(e => e.MaLoaiBaiTap)
                .HasColumnType("int(11)")
                .HasColumnName("maLoaiBaiTap");
            entity.Property(e => e.MaSach)
                .HasColumnType("int(11)")
                .HasColumnName("maSach");
            entity.Property(e => e.NoiDung)
                .HasColumnType("text")
                .HasColumnName("noiDung");
            entity.Property(e => e.ThoiGianLamBaiPhut)
                .HasDefaultValueSql("'30'")
                .HasColumnType("int(11)")
                .HasColumnName("thoiGianLamBaiPhut");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieuDe");
            entity.Property(e => e.Trang)
                .HasMaxLength(20)
                .HasColumnName("trang");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Hoat_Dong'")
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaDangBaiNavigation).WithMany(p => p.BaiTapGocs)
                .HasForeignKey(d => d.MaDangBai)
                .HasConstraintName("fk_baitapgoc_dangbai");

            entity.HasOne(d => d.MaKhoaHocNavigation).WithMany(p => p.BaiTapGocs)
                .HasForeignKey(d => d.MaKhoaHoc)
                .HasConstraintName("fk_baitapgoc_khoahoc");

            entity.HasOne(d => d.MaLoaiBaiTapNavigation).WithMany(p => p.BaiTapGocs)
                .HasForeignKey(d => d.MaLoaiBaiTap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_baitapgoc_loai");

            entity.HasOne(d => d.MaSachNavigation).WithMany(p => p.BaiTapGocs)
                .HasForeignKey(d => d.MaSach)
                .HasConstraintName("fk_baitapgoc_sach");
        });

        modelBuilder.Entity<BaiTapVeNha>(entity =>
        {
            entity.HasKey(e => e.MaBaiTap).HasName("PRIMARY");

            entity.ToTable("baiTapVeNha");

            entity.HasIndex(e => e.MaBaiTapGoc, "fk_btvn_goc");

            entity.HasIndex(e => e.MaLop, "fk_btvn_lop");

            entity.Property(e => e.MaBaiTap)
                .HasColumnType("int(11)")
                .HasColumnName("maBaiTap");
            entity.Property(e => e.HanNop)
                .HasColumnType("datetime")
                .HasColumnName("hanNop");
            entity.Property(e => e.KieuNop)
                .HasMaxLength(50)
                .HasColumnName("kieuNop");
            entity.Property(e => e.Link)
                .HasMaxLength(500)
                .HasColumnName("link");
            entity.Property(e => e.MaBaiTapGoc)
                .HasColumnType("int(11)")
                .HasColumnName("maBaiTapGoc");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.NgayGiao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayGiao");
            entity.Property(e => e.ThuongApos)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("thuongApos");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Dang_Mo'")
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaBaiTapGocNavigation).WithMany(p => p.BaiTapVeNhas)
                .HasForeignKey(d => d.MaBaiTapGoc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_btvn_goc");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.BaiTapVeNhas)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_btvn_lop");
        });

        modelBuilder.Entity<BaoCaoBaiHoc>(entity =>
        {
            entity.HasKey(e => e.MaBaoCao).HasName("PRIMARY");

            entity.ToTable("baoCaoBaiHoc");

            entity.HasIndex(e => e.MaGiaoVien, "fk_baocao_gv");

            entity.HasIndex(e => e.MaHocSinh, "fk_baocao_hs");

            entity.Property(e => e.MaBaoCao)
                .HasColumnType("int(11)")
                .HasColumnName("maBaoCao");
            entity.Property(e => e.MaGiaoVien)
                .HasColumnType("int(11)")
                .HasColumnName("maGiaoVien");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.MucTieuBaiHoc)
                .HasColumnType("text")
                .HasColumnName("mucTieuBaiHoc");
            entity.Property(e => e.NgayHoc).HasColumnName("ngayHoc");
            entity.Property(e => e.TienDoHoanThanh)
                .HasColumnType("int(11)")
                .HasColumnName("tienDoHoanThanh");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieuDe");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.MaGiaoVienNavigation).WithMany(p => p.BaoCaoBaiHocs)
                .HasForeignKey(d => d.MaGiaoVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_baocao_gv");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.BaoCaoBaiHocs)
                .HasForeignKey(d => d.MaHocSinh)
                .HasConstraintName("fk_baocao_hs");
        });

        modelBuilder.Entity<BaoCaoPhuHuynh>(entity =>
        {
            entity.HasKey(e => e.MaBaoCao).HasName("PRIMARY");

            entity.ToTable("baoCaoPhuHuynh");

            entity.HasIndex(e => e.MaPhuHuynh, "fk_bcph_ph");

            entity.HasIndex(e => new { e.MaHocSinh, e.Thang, e.Nam }, "uqBaoCaoPh").IsUnique();

            entity.Property(e => e.MaBaoCao)
                .HasColumnType("int(11)")
                .HasColumnName("maBaoCao");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.MaPhuHuynh)
                .HasColumnType("int(11)")
                .HasColumnName("maPhuHuynh");
            entity.Property(e => e.Nam)
                .HasColumnType("int(11)")
                .HasColumnName("nam");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NhanXetGiaoVien)
                .HasColumnType("text")
                .HasColumnName("nhanXetGiaoVien");
            entity.Property(e => e.SoBuoiVang)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("soBuoiVang");
            entity.Property(e => e.Thang)
                .HasColumnType("int(11)")
                .HasColumnName("thang");
            entity.Property(e => e.TienDoHocTap)
                .HasMaxLength(255)
                .HasColumnName("tienDoHocTap");
            entity.Property(e => e.TinhTrangHocPhi)
                .HasMaxLength(100)
                .HasColumnName("tinhTrangHocPhi");
            entity.Property(e => e.TongDiemApos)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("tongDiemApos");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.BaoCaoPhuHuynhs)
                .HasForeignKey(d => d.MaHocSinh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_bcph_hs");

            entity.HasOne(d => d.MaPhuHuynhNavigation).WithMany(p => p.BaoCaoPhuHuynhs)
                .HasForeignKey(d => d.MaPhuHuynh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_bcph_ph");
        });

        modelBuilder.Entity<BuoiHoc>(entity =>
        {
            entity.HasKey(e => e.MaBuoiHoc).HasName("PRIMARY");

            entity.ToTable("buoiHoc");

            entity.HasIndex(e => e.MaGiaoVien, "fk_buoihoc_gv");

            entity.HasIndex(e => new { e.MaLop, e.NgayHoc, e.GioBatDau }, "uqBuoiHoc").IsUnique();

            entity.Property(e => e.MaBuoiHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maBuoiHoc");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .HasColumnName("ghiChu");
            entity.Property(e => e.GioBatDau)
                .HasColumnType("time")
                .HasColumnName("gioBatDau");
            entity.Property(e => e.GioKetThuc)
                .HasColumnType("time")
                .HasColumnName("gioKetThuc");
            entity.Property(e => e.MaGiaoVien)
                .HasColumnType("int(11)")
                .HasColumnName("maGiaoVien");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.NgayHoc).HasColumnName("ngayHoc");
            entity.Property(e => e.TrangThaiGiaoVien)
                .HasMaxLength(20)
                .HasColumnName("trangThaiGiaoVien");

            entity.HasOne(d => d.MaGiaoVienNavigation).WithMany(p => p.BuoiHocs)
                .HasForeignKey(d => d.MaGiaoVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_buoihoc_gv");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.BuoiHocs)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_buoihoc_lop");
        });

        modelBuilder.Entity<ChiTietKyNang>(entity =>
        {
            entity.HasKey(e => new { e.MaBaoCao, e.MaKyNang })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("chiTietKyNang");

            entity.HasIndex(e => e.MaKyNang, "fk_ctkn_kynang");

            entity.Property(e => e.MaBaoCao)
                .HasColumnType("int(11)")
                .HasColumnName("maBaoCao");
            entity.Property(e => e.MaKyNang)
                .HasColumnType("int(11)")
                .HasColumnName("maKyNang");
            entity.Property(e => e.DiemSo)
                .HasColumnType("int(11)")
                .HasColumnName("diemSo");
            entity.Property(e => e.NhanXetGiaoVien)
                .HasColumnType("text")
                .HasColumnName("nhanXetGiaoVien");

            entity.HasOne(d => d.MaBaoCaoNavigation).WithMany(p => p.ChiTietKyNangs)
                .HasForeignKey(d => d.MaBaoCao)
                .HasConstraintName("fk_ctkn_baocao");

            entity.HasOne(d => d.MaKyNangNavigation).WithMany(p => p.ChiTietKyNangs)
                .HasForeignKey(d => d.MaKyNang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ctkn_kynang");
        });

        modelBuilder.Entity<ChuDeBaiGiang>(entity =>
        {
            entity.HasKey(e => e.MaChuDe).HasName("PRIMARY");

            entity.ToTable("chuDeBaiGiang");

            entity.HasIndex(e => e.MaLop, "fk_cdbg_lop");

            entity.Property(e => e.MaChuDe)
                .HasColumnType("int(11)")
                .HasColumnName("maChuDe");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.TenChuDe)
                .HasMaxLength(255)
                .HasColumnName("tenChuDe");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.ChuDeBaiGiangs)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_cdbg_lop");
        });

        modelBuilder.Entity<DangBai>(entity =>
        {
            entity.HasKey(e => e.MaDangBai).HasName("PRIMARY");

            entity.ToTable("dangBai");

            entity.HasIndex(e => e.MaKyNang, "fk_dangbai_kynang");

            entity.Property(e => e.MaDangBai)
                .HasColumnType("int(11)")
                .HasColumnName("maDangBai");
            entity.Property(e => e.MaKyNang)
                .HasColumnType("int(11)")
                .HasColumnName("maKyNang");
            entity.Property(e => e.SoLuongCauMacDinh)
                .HasColumnType("int(11)")
                .HasColumnName("soLuongCauMacDinh");
            entity.Property(e => e.TenDangBai)
                .HasMaxLength(100)
                .HasColumnName("tenDangBai");

            entity.HasOne(d => d.MaKyNangNavigation).WithMany(p => p.DangBais)
                .HasForeignKey(d => d.MaKyNang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_dangbai_kynang");
        });

        modelBuilder.Entity<DiemDanh>(entity =>
        {
            entity.HasKey(e => new { e.MaBuoiHoc, e.MaHocSinh })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("diemDanh");

            entity.HasIndex(e => e.MaHocSinh, "fk_diemdanh_hs");

            entity.Property(e => e.MaBuoiHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maBuoiHoc");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaBuoiHocNavigation).WithMany(p => p.DiemDanhs)
                .HasForeignKey(d => d.MaBuoiHoc)
                .HasConstraintName("fk_diemdanh_buoi");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.DiemDanhs)
                .HasForeignKey(d => d.MaHocSinh)
                .HasConstraintName("fk_diemdanh_hs");
        });

        modelBuilder.Entity<DiemDanhGiaoVien>(entity =>
        {
            entity.HasKey(e => e.MaDiemDanh).HasName("PRIMARY");

            entity.ToTable("diemDanhGiaoVien");

            entity.HasIndex(e => e.MaLop, "fk_ddgv_lop");

            entity.HasIndex(e => new { e.MaGiaoVien, e.MaLop, e.NgayDay }, "uqDiemDanhGV").IsUnique();

            entity.Property(e => e.MaDiemDanh)
                .HasColumnType("int(11)")
                .HasColumnName("maDiemDanh");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .HasColumnName("ghiChu");
            entity.Property(e => e.MaGiaoVien)
                .HasColumnType("int(11)")
                .HasColumnName("maGiaoVien");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.NgayDay).HasColumnName("ngayDay");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaGiaoVienNavigation).WithMany(p => p.DiemDanhGiaoViens)
                .HasForeignKey(d => d.MaGiaoVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ddgv_gv");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.DiemDanhGiaoViens)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ddgv_lop");
        });

        modelBuilder.Entity<GiaoVien>(entity =>
        {
            entity.HasKey(e => e.MaGiaoVien).HasName("PRIMARY");

            entity.ToTable("giaoVien");

            entity.HasIndex(e => e.MaNguoiDung, "maNguoiDung").IsUnique();

            entity.Property(e => e.MaGiaoVien)
                .HasColumnType("int(11)")
                .HasColumnName("maGiaoVien");
            entity.Property(e => e.ChuyenMon)
                .HasMaxLength(100)
                .HasColumnName("chuyenMon");
            entity.Property(e => e.MaNguoiDung)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.QuocTich)
                .HasMaxLength(50)
                .HasColumnName("quocTich");
            entity.Property(e => e.TieuSu)
                .HasColumnType("text")
                .HasColumnName("tieuSu");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.GiaoVien)
                .HasForeignKey<GiaoVien>(d => d.MaNguoiDung)
                .HasConstraintName("fk_giaovien_nguoidung");
        });

        modelBuilder.Entity<HocSinh>(entity =>
        {
            entity.HasKey(e => e.MaHocSinh).HasName("PRIMARY");

            entity.ToTable("hocSinh");

            entity.HasIndex(e => e.MaPhuHuynh, "fk_hocsinh_phuhuynh");

            entity.HasIndex(e => e.MaNguoiDung, "maNguoiDung").IsUnique();

            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.DiemTongApos)
                .HasDefaultValueSql("'0'")
                .HasColumnType("int(11)")
                .HasColumnName("diemTongApos");
            entity.Property(e => e.MaNguoiDung)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.MaPhuHuynh)
                .HasColumnType("int(11)")
                .HasColumnName("maPhuHuynh");
            entity.Property(e => e.NgaySinh).HasColumnName("ngaySinh");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.HocSinh)
                .HasForeignKey<HocSinh>(d => d.MaNguoiDung)
                .HasConstraintName("fk_hocsinh_nguoidung");

            entity.HasOne(d => d.MaPhuHuynhNavigation).WithMany(p => p.HocSinhs)
                .HasForeignKey(d => d.MaPhuHuynh)
                .HasConstraintName("fk_hocsinh_phuhuynh");
        });

        modelBuilder.Entity<HocSinhLopHoc>(entity =>
        {
            entity.HasKey(e => new { e.MaHocSinh, e.MaLop })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("hocSinhLopHoc");

            entity.HasIndex(e => e.MaLop, "fk_hslh_lop");

            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.NgayThamGia)
                .HasDefaultValueSql("curdate()")
                .HasColumnName("ngayThamGia");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.HocSinhLopHocs)
                .HasForeignKey(d => d.MaHocSinh)
                .HasConstraintName("fk_hslh_hocsinh");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.HocSinhLopHocs)
                .HasForeignKey(d => d.MaLop)
                .HasConstraintName("fk_hslh_lop");
        });

        modelBuilder.Entity<KetQuaKiemTra>(entity =>
        {
            entity.HasKey(e => new { e.MaKiemTra, e.MaHocSinh })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("ketQuaKiemTra");

            entity.HasIndex(e => e.MaHocSinh, "fk_kqkt_hs");

            entity.Property(e => e.MaKiemTra)
                .HasColumnType("int(11)")
                .HasColumnName("maKiemTra");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.DiemSo)
                .HasPrecision(5, 2)
                .HasColumnName("diemSo");
            entity.Property(e => e.NgayNop)
                .HasColumnType("datetime")
                .HasColumnName("ngayNop");
            entity.Property(e => e.NhanXetGiaoVien)
                .HasColumnType("text")
                .HasColumnName("nhanXetGiaoVien");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.KetQuaKiemTras)
                .HasForeignKey(d => d.MaHocSinh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_kqkt_hs");

            entity.HasOne(d => d.MaKiemTraNavigation).WithMany(p => p.KetQuaKiemTras)
                .HasForeignKey(d => d.MaKiemTra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_kqkt_bkt");
        });

        modelBuilder.Entity<KhoaHoc>(entity =>
        {
            entity.HasKey(e => e.MaKhoaHoc).HasName("PRIMARY");

            entity.ToTable("khoaHoc");

            entity.Property(e => e.MaKhoaHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maKhoaHoc");
            entity.Property(e => e.CapDo)
                .HasMaxLength(50)
                .HasColumnName("capDo");
            entity.Property(e => e.MoTa)
                .HasColumnType("text")
                .HasColumnName("moTa");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.TenKhoaHoc)
                .HasMaxLength(100)
                .HasColumnName("tenKhoaHoc");
        });

        modelBuilder.Entity<KyNang>(entity =>
        {
            entity.HasKey(e => e.MaKyNang).HasName("PRIMARY");

            entity.ToTable("kyNang");

            entity.HasIndex(e => e.TenKyNang, "tenKyNang").IsUnique();

            entity.Property(e => e.MaKyNang)
                .HasColumnType("int(11)")
                .HasColumnName("maKyNang");
            entity.Property(e => e.TenKyNang)
                .HasMaxLength(50)
                .HasColumnName("tenKyNang");
        });

        modelBuilder.Entity<LichDay>(entity =>
        {
            entity.HasKey(e => e.MaLich).HasName("PRIMARY");

            entity.ToTable("lichDay");

            entity.HasIndex(e => e.MaLop, "fk_lichday_lop");

            entity.Property(e => e.MaLich)
                .HasColumnType("int(11)")
                .HasColumnName("maLich");
            entity.Property(e => e.GioBatDau)
                .HasColumnType("time")
                .HasColumnName("gioBatDau");
            entity.Property(e => e.GioKetThuc)
                .HasColumnType("time")
                .HasColumnName("gioKetThuc");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.Thu)
                .HasColumnType("int(11)")
                .HasColumnName("thu");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.LichDays)
                .HasForeignKey(d => d.MaLop)
                .HasConstraintName("fk_lichday_lop");
        });

        modelBuilder.Entity<LoaiBaiTap>(entity =>
        {
            entity.HasKey(e => e.MaLoaiBaiTap).HasName("PRIMARY");

            entity.ToTable("loaiBaiTap");

            entity.HasIndex(e => e.TenLoai, "tenLoai").IsUnique();

            entity.Property(e => e.MaLoaiBaiTap)
                .HasColumnType("int(11)")
                .HasColumnName("maLoaiBaiTap");
            entity.Property(e => e.DiemAposGoiY)
                .HasDefaultValueSql("'10'")
                .HasColumnType("int(11)")
                .HasColumnName("diemAposGoiY");
            entity.Property(e => e.MoTa)
                .HasMaxLength(255)
                .HasColumnName("moTa");
            entity.Property(e => e.NhomPhanLoai)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Luyen_Tap'")
                .HasColumnName("nhomPhanLoai");
            entity.Property(e => e.TenLoai)
                .HasMaxLength(50)
                .HasColumnName("tenLoai");
            entity.Property(e => e.YeuCauChamDiem)
                .HasDefaultValueSql("'1'")
                .HasColumnName("yeuCauChamDiem");
        });

        modelBuilder.Entity<LopHoc>(entity =>
        {
            entity.HasKey(e => e.MaLop).HasName("PRIMARY");

            entity.ToTable("lopHoc");

            entity.HasIndex(e => e.MaGiaoVien, "fk_lophoc_giaovien");

            entity.HasIndex(e => e.MaKhoaHoc, "fk_lophoc_khoahoc");

            entity.HasIndex(e => e.MaLopHienThi, "maLopHienThi").IsUnique();

            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.LichHoc)
                .HasMaxLength(255)
                .HasColumnName("lichHoc");
            entity.Property(e => e.MaGiaoVien)
                .HasColumnType("int(11)")
                .HasColumnName("maGiaoVien");
            entity.Property(e => e.MaKhoaHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maKhoaHoc");
            entity.Property(e => e.MaLopHienThi)
                .HasMaxLength(20)
                .HasColumnName("maLopHienThi");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.MaGiaoVienNavigation).WithMany(p => p.LopHocs)
                .HasForeignKey(d => d.MaGiaoVien)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_lophoc_giaovien");

            entity.HasOne(d => d.MaKhoaHocNavigation).WithMany(p => p.LopHocs)
                .HasForeignKey(d => d.MaKhoaHoc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_lophoc_khoahoc");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PRIMARY");

            entity.ToTable("nguoiDung");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.MaVaiTro, "idxNguoiDungVaiTro");

            entity.HasIndex(e => e.TenDangNhap, "tenDangNhap").IsUnique();

            entity.Property(e => e.MaNguoiDung)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.AnhDaiDien)
                .HasMaxLength(255)
                .HasColumnName("anhDaiDien");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.HoTen)
                .HasMaxLength(100)
                .HasColumnName("hoTen");
            entity.Property(e => e.LanDangNhapCuoi)
                .HasColumnType("datetime")
                .HasColumnName("lanDangNhapCuoi");
            entity.Property(e => e.MaVaiTro)
                .HasColumnType("int(11)")
                .HasColumnName("maVaiTro");
            entity.Property(e => e.MatKhau)
                .HasMaxLength(255)
                .HasColumnName("matKhau");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.Salt)
                .HasMaxLength(255)
                .HasColumnName("salt");
            entity.Property(e => e.TenDangNhap)
                .HasMaxLength(50)
                .HasColumnName("tenDangNhap");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_nguoidung_vaitro");
        });

        modelBuilder.Entity<NguoiNhanThongBao>(entity =>
        {
            entity.HasKey(e => new { e.MaThongBao, e.MaNguoiDung })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("nguoiNhanThongBao");

            entity.HasIndex(e => e.MaNguoiDung, "fk_nntb_nd");

            entity.Property(e => e.MaThongBao)
                .HasColumnType("int(11)")
                .HasColumnName("maThongBao");
            entity.Property(e => e.MaNguoiDung)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.DaDoc)
                .HasDefaultValueSql("'0'")
                .HasColumnName("daDoc");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.NguoiNhanThongBaos)
                .HasForeignKey(d => d.MaNguoiDung)
                .HasConstraintName("fk_nntb_nd");

            entity.HasOne(d => d.MaThongBaoNavigation).WithMany(p => p.NguoiNhanThongBaos)
                .HasForeignKey(d => d.MaThongBao)
                .HasConstraintName("fk_nntb_tb");
        });

        modelBuilder.Entity<NhanXetBaiLam>(entity =>
        {
            entity.HasKey(e => e.MaNhanXet).HasName("PRIMARY");

            entity.ToTable("nhanXetBaiLam");

            entity.HasIndex(e => e.MaBaiNop, "fk_nxbl_bainop");

            entity.Property(e => e.MaNhanXet)
                .HasColumnType("int(11)")
                .HasColumnName("maNhanXet");
            entity.Property(e => e.MaBaiNop)
                .HasColumnType("int(11)")
                .HasColumnName("maBaiNop");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.NguoiNhanXet)
                .HasMaxLength(20)
                .HasColumnName("nguoiNhanXet");
            entity.Property(e => e.NoiDung)
                .HasColumnType("text")
                .HasColumnName("noiDung");
            entity.Property(e => e.ViTriBatDau)
                .HasColumnType("int(11)")
                .HasColumnName("viTriBatDau");
            entity.Property(e => e.ViTriKetThuc)
                .HasColumnType("int(11)")
                .HasColumnName("viTriKetThuc");

            entity.HasOne(d => d.MaBaiNopNavigation).WithMany(p => p.NhanXetBaiLams)
                .HasForeignKey(d => d.MaBaiNop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_nxbl_bainop");
        });

        modelBuilder.Entity<NhatKyApo>(entity =>
        {
            entity.HasKey(e => e.MaLog).HasName("PRIMARY");

            entity.ToTable("nhatKyApos");

            entity.HasIndex(e => e.MaHocSinh, "fk_apos_hs");

            entity.Property(e => e.MaLog)
                .HasColumnType("int(11)")
                .HasColumnName("maLog");
            entity.Property(e => e.LyDo)
                .HasMaxLength(255)
                .HasColumnName("lyDo");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayTao");
            entity.Property(e => e.SoDiem)
                .HasColumnType("int(11)")
                .HasColumnName("soDiem");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.NhatKyApos)
                .HasForeignKey(d => d.MaHocSinh)
                .HasConstraintName("fk_apos_hs");
        });

        modelBuilder.Entity<PhuHuynh>(entity =>
        {
            entity.HasKey(e => e.MaPhuHuynh).HasName("PRIMARY");

            entity.ToTable("phuHuynh");

            entity.HasIndex(e => e.MaNguoiDung, "maNguoiDung").IsUnique();

            entity.Property(e => e.MaPhuHuynh)
                .HasColumnType("int(11)")
                .HasColumnName("maPhuHuynh");
            entity.Property(e => e.DiaChi)
                .HasColumnType("text")
                .HasColumnName("diaChi");
            entity.Property(e => e.MaNguoiDung)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("soDienThoai");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.PhuHuynh)
                .HasForeignKey<PhuHuynh>(d => d.MaNguoiDung)
                .HasConstraintName("fk_phuhuynh_nguoidung");
        });

        modelBuilder.Entity<QuanTriVien>(entity =>
        {
            entity.HasKey(e => e.MaQuanTri).HasName("PRIMARY");

            entity.ToTable("quanTriVien");

            entity.HasIndex(e => e.MaNguoiDung, "maNguoiDung").IsUnique();

            entity.Property(e => e.MaQuanTri)
                .HasColumnType("int(11)")
                .HasColumnName("maQuanTri");
            entity.Property(e => e.MaNguoiDung)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiDung");
            entity.Property(e => e.PhongBan)
                .HasMaxLength(100)
                .HasColumnName("phongBan");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.QuanTriVien)
                .HasForeignKey<QuanTriVien>(d => d.MaNguoiDung)
                .HasConstraintName("fk_qtv_nguoidung");
        });

        modelBuilder.Entity<SachGiaoTrinh>(entity =>
        {
            entity.HasKey(e => e.MaSach).HasName("PRIMARY");

            entity.ToTable("sachGiaoTrinh");

            entity.Property(e => e.MaSach)
                .HasColumnType("int(11)")
                .HasColumnName("maSach");
            entity.Property(e => e.MoTa)
                .HasColumnType("text")
                .HasColumnName("moTa");
            entity.Property(e => e.NhaXuatBan)
                .HasMaxLength(100)
                .HasColumnName("nhaXuatBan");
            entity.Property(e => e.PhienBan)
                .HasMaxLength(50)
                .HasColumnName("phienBan");
            entity.Property(e => e.TacGia)
                .HasMaxLength(100)
                .HasColumnName("tacGia");
            entity.Property(e => e.TenSach)
                .HasMaxLength(150)
                .HasColumnName("tenSach");
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaThongBao).HasName("PRIMARY");

            entity.ToTable("thongBao");

            entity.HasIndex(e => e.MaNguoiGui, "fk_thongbao_nguoigui");

            entity.Property(e => e.MaThongBao)
                .HasColumnType("int(11)")
                .HasColumnName("maThongBao");
            entity.Property(e => e.LoaiThongBao)
                .HasMaxLength(50)
                .HasColumnName("loaiThongBao");
            entity.Property(e => e.MaNguoiGui)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiGui");
            entity.Property(e => e.NgayGui)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayGui");
            entity.Property(e => e.NoiDung)
                .HasColumnType("text")
                .HasColumnName("noiDung");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieuDe");

            entity.HasOne(d => d.MaNguoiGuiNavigation).WithMany(p => p.ThongBaos)
                .HasForeignKey(d => d.MaNguoiGui)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_thongbao_nguoigui");
        });

        modelBuilder.Entity<ThongKeHocTap>(entity =>
        {
            entity.HasKey(e => e.MaThongKe).HasName("PRIMARY");

            entity.ToTable("thongKeHocTap");

            entity.HasIndex(e => e.MaHocSinh, "fk_tkht_hs");

            entity.Property(e => e.MaThongKe)
                .HasColumnType("int(11)")
                .HasColumnName("maThongKe");
            entity.Property(e => e.DiemTrungBinh)
                .HasPrecision(5, 2)
                .HasColumnName("diemTrungBinh");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.TongBaiHoanThanh)
                .HasColumnType("int(11)")
                .HasColumnName("tongBaiHoanThanh");
            entity.Property(e => e.TongBaiTap)
                .HasColumnType("int(11)")
                .HasColumnName("tongBaiTap");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.ThongKeHocTaps)
                .HasForeignKey(d => d.MaHocSinh)
                .HasConstraintName("fk_tkht_hs");
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.MaVaiTro).HasName("PRIMARY");

            entity.ToTable("vaiTro");

            entity.HasIndex(e => e.TenVaiTro, "tenVaiTro").IsUnique();

            entity.Property(e => e.MaVaiTro)
                .HasColumnType("int(11)")
                .HasColumnName("maVaiTro");
            entity.Property(e => e.TenVaiTro)
                .HasMaxLength(50)
                .HasColumnName("tenVaiTro");
        });

        modelBuilder.Entity<YeuCauVaoLop>(entity =>
        {
            entity.HasKey(e => e.MaYeuCau).HasName("PRIMARY");

            entity.ToTable("yeuCauVaoLop");

            entity.HasIndex(e => e.MaHocSinh, "fk_ycvl_hs");

            entity.HasIndex(e => e.MaLop, "fk_ycvl_lop");

            entity.Property(e => e.MaYeuCau)
                .HasColumnType("int(11)")
                .HasColumnName("maYeuCau");
            entity.Property(e => e.MaHocSinh)
                .HasColumnType("int(11)")
                .HasColumnName("maHocSinh");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.NgayYeuCau)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("ngayYeuCau");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Cho_Duyet'")
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaHocSinhNavigation).WithMany(p => p.YeuCauVaoLops)
                .HasForeignKey(d => d.MaHocSinh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ycvl_hs");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.YeuCauVaoLops)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ycvl_lop");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
