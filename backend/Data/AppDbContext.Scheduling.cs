using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public partial class AppDbContext
{
    public virtual DbSet<ChiTietXepLich> ChiTietXepLiches { get; set; }

    public virtual DbSet<DotXepLich> DotXepLiches { get; set; }

    public virtual DbSet<KhungGioHoc> KhungGioHocs { get; set; }

    public virtual DbSet<PhongHoc> PhongHocs { get; set; }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PhongHoc>(entity =>
        {
            entity.HasKey(e => e.MaPhongHoc).HasName("PRIMARY");

            entity.ToTable("phongHoc");

            entity.HasIndex(e => e.TenPhong, "tenPhong").IsUnique();

            entity.Property(e => e.MaPhongHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maPhongHoc");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255)
                .HasColumnName("ghiChu");
            entity.Property(e => e.SucChua)
                .HasColumnType("int(11)")
                .HasColumnName("sucChua");
            entity.Property(e => e.TenPhong)
                .HasMaxLength(50)
                .HasColumnName("tenPhong");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Hoat_Dong'")
                .HasColumnName("trangThai");
        });

        modelBuilder.Entity<KhungGioHoc>(entity =>
        {
            entity.HasKey(e => e.MaKhungGio).HasName("PRIMARY");

            entity.ToTable("khungGioHoc");

            entity.HasIndex(e => e.TenKhungGio, "tenKhungGio").IsUnique();

            entity.Property(e => e.MaKhungGio)
                .HasColumnType("int(11)")
                .HasColumnName("maKhungGio");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.GioBatDau)
                .HasColumnType("time")
                .HasColumnName("gioBatDau");
            entity.Property(e => e.GioKetThuc)
                .HasColumnType("time")
                .HasColumnName("gioKetThuc");
            entity.Property(e => e.TenKhungGio)
                .HasMaxLength(50)
                .HasColumnName("tenKhungGio");
            entity.Property(e => e.ThuTu)
                .HasColumnType("int(11)")
                .HasColumnName("thuTu");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Hoat_Dong'")
                .HasColumnName("trangThai");
        });

        modelBuilder.Entity<DotXepLich>(entity =>
        {
            entity.HasKey(e => e.MaDotXepLich).HasName("PRIMARY");

            entity.ToTable("dotXepLich");

            entity.HasIndex(e => e.MaLop, "fk_dotxeplch_lop");
            entity.HasIndex(e => e.MaNguoiTao, "fk_dotxeplch_nguoitao");

            entity.Property(e => e.MaDotXepLich)
                .HasColumnType("int(11)")
                .HasColumnName("maDotXepLich");
            entity.Property(e => e.CheDoXepLich)
                .HasMaxLength(20)
                .HasColumnName("cheDoXepLich");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.DenNgay)
                .HasColumnName("denNgay");
            entity.Property(e => e.GhiChu)
                .HasColumnType("text")
                .HasColumnName("ghiChu");
            entity.Property(e => e.MaLop)
                .HasColumnType("int(11)")
                .HasColumnName("maLop");
            entity.Property(e => e.MaNguoiTao)
                .HasColumnType("int(11)")
                .HasColumnName("maNguoiTao");
            entity.Property(e => e.TongBuoiDaXep)
                .HasColumnType("int(11)")
                .HasColumnName("tongBuoiDaXep");
            entity.Property(e => e.TongBuoiDuKien)
                .HasColumnType("int(11)")
                .HasColumnName("tongBuoiDuKien");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasColumnName("trangThai");
            entity.Property(e => e.TuNgay)
                .HasColumnName("tuNgay");

            entity.HasOne<LopHoc>()
                .WithMany()
                .HasForeignKey(e => e.MaLop)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_dotxeplch_lop");

            entity.HasOne<NguoiDung>()
                .WithMany()
                .HasForeignKey(e => e.MaNguoiTao)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_dotxeplch_nguoitao");
        });

        modelBuilder.Entity<ChiTietXepLich>(entity =>
        {
            entity.HasKey(e => e.MaChiTietXepLich).HasName("PRIMARY");

            entity.ToTable("chiTietXepLich");

            entity.HasIndex(e => e.MaBuoiHoc, "uq_chitietxeplch_buoihoc").IsUnique();
            entity.HasIndex(e => e.MaDotXepLich, "fk_chitietxeplch_dot");
            entity.HasIndex(e => e.MaKhungGio, "fk_chitietxeplch_khunggio");
            entity.HasIndex(e => e.MaPhongHoc, "fk_chitietxeplch_phong");

            entity.Property(e => e.MaChiTietXepLich)
                .HasColumnType("int(11)")
                .HasColumnName("maChiTietXepLich");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.GhiChu)
                .HasColumnType("text")
                .HasColumnName("ghiChu");
            entity.Property(e => e.LoaiXepLich)
                .HasMaxLength(20)
                .HasColumnName("loaiXepLich");
            entity.Property(e => e.MaBuoiHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maBuoiHoc");
            entity.Property(e => e.MaDotXepLich)
                .HasColumnType("int(11)")
                .HasColumnName("maDotXepLich");
            entity.Property(e => e.MaKhungGio)
                .HasColumnType("int(11)")
                .HasColumnName("maKhungGio");
            entity.Property(e => e.MaPhongHoc)
                .HasColumnType("int(11)")
                .HasColumnName("maPhongHoc");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Hoat_Dong'")
                .HasColumnName("trangThai");

            entity.HasOne(d => d.MaBuoiHocNavigation)
                .WithMany()
                .HasForeignKey(d => d.MaBuoiHoc)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_chitietxeplch_buoihoc");

            entity.HasOne(d => d.MaDotXepLichNavigation)
                .WithMany(p => p.ChiTietXepLiches)
                .HasForeignKey(d => d.MaDotXepLich)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_chitietxeplch_dot");

            entity.HasOne(d => d.MaKhungGioNavigation)
                .WithMany(p => p.ChiTietXepLiches)
                .HasForeignKey(d => d.MaKhungGio)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_chitietxeplch_khunggio");

            entity.HasOne(d => d.MaPhongHocNavigation)
                .WithMany(p => p.ChiTietXepLiches)
                .HasForeignKey(d => d.MaPhongHoc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_chitietxeplch_phong");
        });
    }
}
