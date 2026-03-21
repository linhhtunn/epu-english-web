-- ===========
-- ===========
USE QuanLyTrungTam;

-- MOCK DATA FOR VAI TRO (ROLES)
-- 1: Admin, 2: Giao_Vien, 3: Phu_Huynh, 4: Hoc_Sinh
INSERT IGNORE INTO vaiTro (maVaiTro, tenVaiTro) VALUES 
(1, 'Admin'),
(2, 'Giao_Vien'),
(3, 'Phu_Huynh'),
(4, 'Hoc_Sinh');

-- MOCK DATA FOR USERS (nguoiDung)
-- Passwords will be simple for testing or hashed if backend uses a specific hash. 
-- Assuming raw or simple hash initially. Let's use 'password123' as placeholder.
INSERT IGNORE INTO nguoiDung (maNguoiDung, tenDangNhap, email, matKhau, salt, hoTen, maVaiTro, trangThai) VALUES
(1, 'admin_01', 'admin@example.com', 'hashed_pw', 'salt123', 'Quáº£n Trá»‹ ViÃªn 1', 1, 'Hoat_Dong'),
(2, 'gv_01', 'gv01@example.com', 'hashed_pw', 'salt123', 'GiÃ¡o ViÃªn 1', 2, 'Hoat_Dong'),
(3, 'gv_02', 'gv02@example.com', 'hashed_pw', 'salt123', 'GiÃ¡o ViÃªn 2', 2, 'Hoat_Dong'),
(4, 'ph_01', 'ph01@example.com', 'hashed_pw', 'salt123', 'Phá»¥ Huynh 1', 3, 'Hoat_Dong'),
(5, 'hs_01', 'hs01@example.com', 'hashed_pw', 'salt123', 'Há»c Sinh 1', 4, 'Hoat_Dong'),
(6, 'hs_02', 'hs02@example.com', 'hashed_pw', 'salt123', 'Há»c Sinh 2', 4, 'Hoat_Dong');

-- Há»’ SÆ  CHI TIáº¾T
INSERT IGNORE INTO quanTriVien (maNguoiDung, phongBan) VALUES (1, 'Ban GiÃ¡m Äá»‘c');
INSERT IGNORE INTO giaoVien (maNguoiDung, chuyenMon) VALUES (2, 'IELTS'), (3, 'Giao Tiáº¿p');
INSERT IGNORE INTO phuHuynh (maNguoiDung, soDienThoai) VALUES (4, '0901234567');
INSERT IGNORE INTO hocSinh (maHocSinh, maNguoiDung, maPhuHuynh, diemTongApos) VALUES 
(1, 5, 1, 100), -- Assuming maPhuHuynh=1 corresponds to the first inserted phuHuynh
(2, 6, 1, 150);

-- MOCK DATA FOR COURSES (khoaHoc)
INSERT IGNORE INTO khoaHoc (maKhoaHoc, tenKhoaHoc, capDo, moTa) VALUES
(1, 'IELTS Foundation', 'Beginner', 'KhÃ³a há»c ná»n táº£ng IELTS'),
(2, 'Giao Tiáº¿p CÆ¡ Báº£n', 'Beginner', 'Tiáº¿ng Anh giao tiáº¿p hÃ ng ngÃ y'),
(3, 'IELTS Intensive', 'Advanced', 'KhÃ³a há»c luyá»‡n thi IELTS cÆ°á»ng Ä‘á»™ cao');

-- MOCK DATA FOR CLASSES (lopHoc)
-- maKhoaHoc references khoaHoc, maGiaoVien references giaoVien(maGiaoVien)
INSERT IGNORE INTO lopHoc (maLop, maLopHienThi, maKhoaHoc, maGiaoVien, lichHoc) VALUES
(1, 'IELTS-F01', 1, 1, 'T2-T4-T6 18:00-19:30'),
(2, 'GT-CB01', 2, 2, 'T3-T5-T7 19:30-21:00');

-- MOCK DATA FOR CLASS ASSIGNMENT (hocSinhLopHoc)
INSERT IGNORE INTO hocSinhLopHoc (maHocSinh, maLop, trangThai) VALUES
(1, 1, 'Dang_Hoc'),
(2, 1, 'Dang_Hoc'),
(1, 2, 'Dang_Hoc');

