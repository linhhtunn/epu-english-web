/* =============================================================
   0. THIẾT LẬP CHUNG
   DROP DATABASE IF EXISTS QuanLyTrungTam;
============================================================= */
CREATE DATABASE IF NOT EXISTS QuanLyTrungTam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE QuanLyTrungTam;

/* =============================================================
   1. HỆ THỐNG DANH MỤC & TÀI KHOẢN
============================================================= */

CREATE TABLE vaiTro (
    maVaiTro INT AUTO_INCREMENT PRIMARY KEY,
    tenVaiTro VARCHAR(50) NOT NULL UNIQUE 
);

CREATE TABLE kyNang (
    maKyNang INT AUTO_INCREMENT PRIMARY KEY,
    tenKyNang VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE loaiBaiTap (
    maLoaiBaiTap INT AUTO_INCREMENT PRIMARY KEY,
    tenLoai VARCHAR(50) NOT NULL UNIQUE,
    moTa VARCHAR(255),
    nhomPhanLoai VARCHAR(50) DEFAULT 'Luyen_Tap',
    yeuCauChamDiem BOOLEAN DEFAULT TRUE,
    diemAposGoiY INT DEFAULT 10
);

/* =============================================================
   1.x. DANH MỤC HỌC THUẬT
============================================================= */

CREATE TABLE sachGiaoTrinh (
    maSach INT AUTO_INCREMENT PRIMARY KEY,
    tenSach VARCHAR(150) NOT NULL,
    nhaXuatBan VARCHAR(100),
    tacGia VARCHAR(100),
    phienBan VARCHAR(50),
    moTa TEXT
);

CREATE TABLE khoaHoc (
    maKhoaHoc INT AUTO_INCREMENT PRIMARY KEY,
    tenKhoaHoc VARCHAR(100) NOT NULL,
    capDo VARCHAR(50),
    moTa TEXT,
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nguoiDung (
    maNguoiDung INT AUTO_INCREMENT PRIMARY KEY,
    tenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    matKhau VARCHAR(255) NOT NULL,
    salt VARCHAR(255),
    hoTen VARCHAR(100) NOT NULL,
    maVaiTro INT NOT NULL,
    anhDaiDien VARCHAR(255),
    trangThai VARCHAR(20) NOT NULL CHECK (trangThai IN ('Hoat_Dong', 'Tam_Khoa', 'Khoa')),
    lanDangNhapCuoi DATETIME NULL,
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_nguoidung_vaitro FOREIGN KEY (maVaiTro) REFERENCES vaiTro(maVaiTro)
);

CREATE INDEX idxNguoiDungVaiTro ON nguoiDung(maVaiTro);

/* =============================================================
   2. HỒ SƠ CHI TIẾT (ACTOR PROFILES)
============================================================= */

CREATE TABLE quanTriVien (
    maQuanTri INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung INT NOT NULL UNIQUE,
    phongBan VARCHAR(100),
    CONSTRAINT fk_qtv_nguoidung FOREIGN KEY (maNguoiDung) REFERENCES nguoiDung(maNguoiDung) ON DELETE CASCADE
);

CREATE TABLE giaoVien (
    maGiaoVien INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung INT NOT NULL UNIQUE,
    chuyenMon VARCHAR(100),
    quocTich VARCHAR(50),
    tieuSu TEXT,
    CONSTRAINT fk_giaovien_nguoidung FOREIGN KEY (maNguoiDung) REFERENCES nguoiDung(maNguoiDung) ON DELETE CASCADE
);

CREATE TABLE phuHuynh (
    maPhuHuynh INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung INT NOT NULL UNIQUE,
    soDienThoai VARCHAR(20),
    diaChi TEXT,
    CONSTRAINT fk_phuhuynh_nguoidung FOREIGN KEY (maNguoiDung) REFERENCES nguoiDung(maNguoiDung) ON DELETE CASCADE
);

CREATE TABLE hocSinh (
    maHocSinh INT AUTO_INCREMENT PRIMARY KEY,
    maNguoiDung INT NOT NULL UNIQUE,
    maPhuHuynh INT NULL,
    ngaySinh DATE,
    diemTongApos INT DEFAULT 0,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hocsinh_nguoidung FOREIGN KEY (maNguoiDung) REFERENCES nguoiDung(maNguoiDung) ON DELETE CASCADE,
    CONSTRAINT fk_hocsinh_phuhuynh FOREIGN KEY (maPhuHuynh) REFERENCES phuHuynh(maPhuHuynh)
);

/* =============================================================
   3. LỚP HỌC & NGÂN HÀNG ĐỀ
============================================================= */

CREATE TABLE lopHoc (
    maLop INT AUTO_INCREMENT PRIMARY KEY,
    maLopHienThi VARCHAR(20) UNIQUE,
    maKhoaHoc INT NOT NULL,
    maGiaoVien INT NULL,
    lichHoc VARCHAR(255),
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lophoc_giaovien FOREIGN KEY (maGiaoVien) REFERENCES giaoVien(maGiaoVien) ON DELETE SET NULL,
    CONSTRAINT fk_lophoc_khoahoc FOREIGN KEY (maKhoaHoc) REFERENCES khoaHoc(maKhoaHoc)
);

CREATE TABLE dangBai (
    maDangBai INT AUTO_INCREMENT PRIMARY KEY,
    tenDangBai VARCHAR(100) NOT NULL,
    maKyNang INT NOT NULL,
    soLuongCauMacDinh INT,
    CONSTRAINT fk_dangbai_kynang FOREIGN KEY (maKyNang) REFERENCES kyNang(maKyNang)
);

CREATE TABLE baiTapGoc (
    maBaiTapGoc INT AUTO_INCREMENT PRIMARY KEY,
    tieuDe VARCHAR(255) NOT NULL,
    noiDung TEXT,
    maSach INT NULL,
    maKhoaHoc INT NULL,
    donViBai VARCHAR(50),
    trang VARCHAR(20),
    link VARCHAR(500),
    maLoaiBaiTap INT NOT NULL,
    doKho VARCHAR(20) DEFAULT 'Trung_Binh' CHECK (doKho IN ('De', 'Trung_Binh', 'Kho', 'Rat_Kho')),
    thoiGianLamBaiPhut INT DEFAULT 30,
    trangThai VARCHAR(20) DEFAULT 'Hoat_Dong' CHECK (trangThai IN ('Hoat_Dong', 'An')),
    loaiHocThuat VARCHAR(50) CHECK (loaiHocThuat IN ('Grammar', 'Tu_Vung', 'Doc', 'Nghe', 'Viet', 'Noi')),
    maDangBai INT NULL,
    capDoHoc INT CHECK (capDoHoc BETWEEN 6 AND 12),
    chungChi VARCHAR(20) CHECK (chungChi IN ('IELTS', 'THCS', 'THPT')),
    CONSTRAINT fk_baitapgoc_sach FOREIGN KEY (maSach) REFERENCES sachGiaoTrinh(maSach),
    CONSTRAINT fk_baitapgoc_khoahoc FOREIGN KEY (maKhoaHoc) REFERENCES khoaHoc(maKhoaHoc),
    CONSTRAINT fk_baitapgoc_loai FOREIGN KEY (maLoaiBaiTap) REFERENCES loaiBaiTap(maLoaiBaiTap),
    CONSTRAINT fk_baitapgoc_dangbai FOREIGN KEY (maDangBai) REFERENCES dangBai(maDangBai)
);

CREATE TABLE hocSinhLopHoc (
    maHocSinh INT NOT NULL,
    maLop INT NOT NULL,
    ngayThamGia DATE DEFAULT (CURRENT_DATE),
    trangThai VARCHAR(20) CHECK (trangThai IN ('Dang_Hoc', 'Da_Ket_Thuc')),
    PRIMARY KEY (maHocSinh, maLop),
    CONSTRAINT fk_hslh_hocsinh FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh) ON DELETE CASCADE,
    CONSTRAINT fk_hslh_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop) ON DELETE CASCADE
);

/* =============================================================
   3. TIẾP: BUỔI HỌC & ĐIỂM DANH
============================================================= */

CREATE TABLE buoiHoc (
    maBuoiHoc INT AUTO_INCREMENT PRIMARY KEY,
    maLop INT NOT NULL,
    ngayHoc DATE NOT NULL,
    gioBatDau TIME NOT NULL,
    gioKetThuc TIME NOT NULL,
    maGiaoVien INT NOT NULL,
    trangThaiGiaoVien VARCHAR(20) CHECK (trangThaiGiaoVien IN ('Day', 'Nghi', 'Day_Thay')),
    ghiChu VARCHAR(255),
    CONSTRAINT uqBuoiHoc UNIQUE (maLop, ngayHoc, gioBatDau),
    CONSTRAINT fk_buoihoc_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop),
    CONSTRAINT fk_buoihoc_gv FOREIGN KEY (maGiaoVien) REFERENCES giaoVien(maGiaoVien)
);

CREATE TABLE diemDanh (
    maBuoiHoc INT NOT NULL,
    maHocSinh INT NOT NULL,
    trangThai VARCHAR(20) CHECK (trangThai IN ('Co_Mat', 'Vang', 'Muon', 'Co_Phep')),
    PRIMARY KEY (maBuoiHoc, maHocSinh),
    CONSTRAINT fk_diemdanh_buoi FOREIGN KEY (maBuoiHoc) REFERENCES buoiHoc(maBuoiHoc) ON DELETE CASCADE,
    CONSTRAINT fk_diemdanh_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh) ON DELETE CASCADE
);

/* =============================================================
   4. BÁO CÁO & BÀI TẬP
============================================================= */

CREATE TABLE baoCaoBaiHoc (
    maBaoCao INT AUTO_INCREMENT PRIMARY KEY,
    maHocSinh INT NOT NULL,
    maGiaoVien INT NOT NULL,
    tieuDe VARCHAR(255),
    ngayHoc DATE,
    tienDoHoanThanh INT CHECK (tienDoHoanThanh BETWEEN 0 AND 100),
    mucTieuBaiHoc TEXT,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_baocao_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh) ON DELETE CASCADE,
    CONSTRAINT fk_baocao_gv FOREIGN KEY (maGiaoVien) REFERENCES giaoVien(maGiaoVien) ON DELETE NO ACTION
);

CREATE TABLE chiTietKyNang (
    maBaoCao INT NOT NULL,
    maKyNang INT NOT NULL,
    diemSo INT CHECK (diemSo BETWEEN 0 AND 100),
    nhanXetGiaoVien TEXT,
    PRIMARY KEY (maBaoCao, maKyNang),
    CONSTRAINT fk_ctkn_baocao FOREIGN KEY (maBaoCao) REFERENCES baoCaoBaiHoc(maBaoCao) ON DELETE CASCADE,
    CONSTRAINT fk_ctkn_kynang FOREIGN KEY (maKyNang) REFERENCES kyNang(maKyNang)
);

CREATE TABLE baiTapVeNha (
    maBaiTap INT AUTO_INCREMENT PRIMARY KEY,
    maBaiTapGoc INT NOT NULL,
    maLop INT NOT NULL,
    ngayGiao DATETIME DEFAULT CURRENT_TIMESTAMP,
    hanNop DATETIME NOT NULL,
    thuongApos INT DEFAULT 0,
    link VARCHAR(500),
    trangThai VARCHAR(20) DEFAULT 'Dang_Mo' CHECK (trangThai IN ('Dang_Mo', 'Dong', 'Huy')),
    kieuNop VARCHAR(50) CHECK (kieuNop IN ('File', 'Hinh_Anh', 'Text', 'Ket_Hop')),
    CONSTRAINT fk_btvn_goc FOREIGN KEY (maBaiTapGoc) REFERENCES baiTapGoc(maBaiTapGoc),
    CONSTRAINT fk_btvn_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop)
);

CREATE TABLE baiNopHocSinh (
    maBaiNop INT AUTO_INCREMENT PRIMARY KEY,
    maBaiTap INT NOT NULL,
    maHocSinh INT NOT NULL,
    ngayNop DATETIME DEFAULT CURRENT_TIMESTAMP,
    duongDanBaiLam TEXT,
    diemSo DECIMAL(5,2),
    loiPheGiaoVien TEXT,
    trangThai VARCHAR(20) CHECK (trangThai IN ('Cho_Cham', 'Da_Cham', 'Can_Lam_Lai')),
    CONSTRAINT uqBaiNop UNIQUE (maBaiTap, maHocSinh),
    CONSTRAINT fk_bainop_btvn FOREIGN KEY (maBaiTap) REFERENCES baiTapVeNha(maBaiTap) ON DELETE CASCADE,
    CONSTRAINT fk_bainop_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh) ON DELETE CASCADE
);

CREATE TABLE nhatKyApos (
    maLog INT AUTO_INCREMENT PRIMARY KEY,
    maHocSinh INT NOT NULL,
    soDiem INT,
    lyDo VARCHAR(255),
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_apos_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh) ON DELETE CASCADE
);

/* =============================================================
   6. THÔNG BÁO & LỊCH TRÌNH
============================================================= */

CREATE TABLE thongBao (
    maThongBao INT AUTO_INCREMENT PRIMARY KEY,
    tieuDe VARCHAR(255),
    noiDung TEXT,
    loaiThongBao VARCHAR(50),
    maNguoiGui INT NULL,
    ngayGui DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_thongbao_nguoigui FOREIGN KEY (maNguoiGui) REFERENCES nguoiDung(maNguoiDung) ON DELETE SET NULL
);

CREATE TABLE nguoiNhanThongBao (
    maThongBao INT NOT NULL,
    maNguoiDung INT NOT NULL,
    daDoc BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (maThongBao, maNguoiDung),
    CONSTRAINT fk_nntb_tb FOREIGN KEY (maThongBao) REFERENCES thongBao(maThongBao) ON DELETE CASCADE,
    CONSTRAINT fk_nntb_nd FOREIGN KEY (maNguoiDung) REFERENCES nguoiDung(maNguoiDung) ON DELETE CASCADE
);

CREATE TABLE diemDanhGiaoVien (
    maDiemDanh INT AUTO_INCREMENT PRIMARY KEY,
    maGiaoVien INT NOT NULL,
    maLop INT NOT NULL,
    ngayDay DATE NOT NULL,
    trangThai VARCHAR(20) NOT NULL CHECK (trangThai IN ('Co_Mat', 'Vang', 'Muon', 'Nghi_Phep')),
    ghiChu VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uqDiemDanhGV UNIQUE (maGiaoVien, maLop, ngayDay),
    CONSTRAINT fk_ddgv_gv FOREIGN KEY (maGiaoVien) REFERENCES giaoVien(maGiaoVien),
    CONSTRAINT fk_ddgv_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop)
);

CREATE TABLE lichDay (
    maLich INT AUTO_INCREMENT PRIMARY KEY,
    maLop INT,
    thu INT,
    gioBatDau TIME,
    gioKetThuc TIME,
    CONSTRAINT fk_lichday_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop)
);

CREATE TABLE baoCaoPhuHuynh (
    maBaoCao INT AUTO_INCREMENT PRIMARY KEY,
    maHocSinh INT NOT NULL,
    maPhuHuynh INT NOT NULL,
    thang INT NOT NULL CHECK (thang BETWEEN 1 AND 12),
    nam INT NOT NULL,
    nhanXetGiaoVien TEXT,
    tienDoHocTap VARCHAR(255),
    soBuoiVang INT DEFAULT 0,
    tongDiemApos INT DEFAULT 0,
    tinhTrangHocPhi VARCHAR(100),
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uqBaoCaoPh UNIQUE (maHocSinh, thang, nam),
    CONSTRAINT fk_bcph_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh),
    CONSTRAINT fk_bcph_ph FOREIGN KEY (maPhuHuynh) REFERENCES phuHuynh(maPhuHuynh)
);

CREATE TABLE yeuCauVaoLop (
    maYeuCau INT AUTO_INCREMENT PRIMARY KEY,
    maHocSinh INT NOT NULL,
    maLop INT NOT NULL,
    trangThai VARCHAR(20) DEFAULT 'Cho_Duyet' CHECK (trangThai IN ('Cho_Duyet', 'Da_Duyet', 'Tu_Choi')),
    ngayYeuCau DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ycvl_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh),
    CONSTRAINT fk_ycvl_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop)
);

CREATE TABLE yeuCauDoiLich (
    maYeuCau INT AUTO_INCREMENT PRIMARY KEY,
    maBuoiHoc INT NOT NULL,
    maGiaoVien INT NOT NULL,
    ngayDeXuatMoi DATE NOT NULL,
    maKhungGioDeXuat INT NOT NULL,
    maPhongHocDeXuat INT NULL,
    lyDo VARCHAR(500),
    trangThai VARCHAR(20) DEFAULT 'Cho_Duyet' CHECK (trangThai IN ('Cho_Duyet', 'Da_Duyet', 'Tu_Choi')),
    maNguoiXuLy INT NULL,
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngayXuLy DATETIME NULL,
    ghiChuXuLy VARCHAR(500),
    CONSTRAINT fk_ycdl_buoihoc FOREIGN KEY (maBuoiHoc) REFERENCES buoiHoc(maBuoiHoc),
    CONSTRAINT fk_ycdl_giaovien FOREIGN KEY (maGiaoVien) REFERENCES giaoVien(maGiaoVien),
    CONSTRAINT fk_ycdl_khunggio FOREIGN KEY (maKhungGioDeXuat) REFERENCES khungGioHoc(maKhungGio),
    CONSTRAINT fk_ycdl_phonghoc FOREIGN KEY (maPhongHocDeXuat) REFERENCES phongHoc(maPhongHoc) ON DELETE SET NULL,
    CONSTRAINT fk_ycdl_nguoixuly FOREIGN KEY (maNguoiXuLy) REFERENCES nguoiDung(maNguoiDung) ON DELETE SET NULL
);

CREATE TABLE chuDeBaiGiang (
    maChuDe INT AUTO_INCREMENT PRIMARY KEY,
    maLop INT NOT NULL,
    tenChuDe VARCHAR(255),
    CONSTRAINT fk_cdbg_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop)
);

CREATE TABLE baiGiang (
    maBaiGiang INT AUTO_INCREMENT PRIMARY KEY,
    maChuDe INT NOT NULL,
    tieuDe VARCHAR(255),
    noiDung TEXT,
    fileDinhKem VARCHAR(500),
    ngayDang DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_baigiang_chude FOREIGN KEY (maChuDe) REFERENCES chuDeBaiGiang(maChuDe)
);

CREATE TABLE baiKiemTra (
    maKiemTra INT AUTO_INCREMENT PRIMARY KEY,
    maLop INT NOT NULL,
    tieuDe VARCHAR(255),
    thoiGianLamPhut INT,
    hanKetThuc DATETIME,
    tongDiem INT DEFAULT 100,
    CONSTRAINT fk_bkt_lop FOREIGN KEY (maLop) REFERENCES lopHoc(maLop)
);

CREATE TABLE ketQuaKiemTra (
    maKiemTra INT NOT NULL,
    maHocSinh INT NOT NULL,
    diemSo DECIMAL(5,2),
    nhanXetGiaoVien TEXT,
    ngayNop DATETIME,
    PRIMARY KEY (maKiemTra, maHocSinh),
    CONSTRAINT fk_kqkt_bkt FOREIGN KEY (maKiemTra) REFERENCES baiKiemTra(maKiemTra),
    CONSTRAINT fk_kqkt_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh)
);

CREATE TABLE nhanXetBaiLam (
    maNhanXet INT AUTO_INCREMENT PRIMARY KEY,
    maBaiNop INT NOT NULL,
    noiDung TEXT,
    viTriBatDau INT,
    viTriKetThuc INT,
    nguoiNhanXet VARCHAR(20) CHECK (nguoiNhanXet IN ('Giao_Vien', 'Hoc_Sinh')),
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nxbl_bainop FOREIGN KEY (maBaiNop) REFERENCES baiNopHocSinh(maBaiNop)
);

CREATE TABLE thongKeHocTap (
    maThongKe INT AUTO_INCREMENT PRIMARY KEY,
    maHocSinh INT,
    tongBaiTap INT,
    tongBaiHoanThanh INT,
    diemTrungBinh DECIMAL(5,2),
    CONSTRAINT fk_tkht_hs FOREIGN KEY (maHocSinh) REFERENCES hocSinh(maHocSinh)
);
USE QuanLyTrungTam;

-- 1. Tạo vai trò Học Sinh (Mã vai trò thường gán là 4)
INSERT IGNORE INTO vaiTro (maVaiTro, tenVaiTro) VALUES (4, 'Hoc_Sinh');

-- 2. Tạo tài khoản đăng nhập (Pass: 123456)
INSERT INTO nguoiDung (tenDangNhap, email, matKhau, salt, hoTen, maVaiTro, trangThai)
VALUES (
    'hs01', 
    'hs01@apollo.edu.vn', 
    'nhan1234@', 
    'salt123', 
    'Nguyễn Văn Học', 
    4, 
    'Hoat_Dong'
);

-- 3. Đưa tài khoản này vào bảng Hồ sơ Học Sinh (Cho sẵn 150 điểm Apos)
SET @idNguoiDung = LAST_INSERT_ID();
INSERT INTO hocSinh (maNguoiDung, diemTongApos) VALUES (@idNguoiDung, 150);
