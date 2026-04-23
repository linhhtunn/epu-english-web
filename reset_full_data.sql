USE QuanLyTrungTam;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE nguoiNhanThongBao;
TRUNCATE TABLE nhanXetBaiLam;
TRUNCATE TABLE ketQuaKiemTra;
TRUNCATE TABLE baiKiemTra;
TRUNCATE TABLE baiGiang;
TRUNCATE TABLE chuDeBaiGiang;
TRUNCATE TABLE yeuCauVaoLop;
TRUNCATE TABLE baoCaoPhuHuynh;
TRUNCATE TABLE lichDay;
TRUNCATE TABLE diemDanhGiaoVien;
TRUNCATE TABLE thongBao;
TRUNCATE TABLE nhatKyApos;
TRUNCATE TABLE baiNopHocSinh;
TRUNCATE TABLE baiTapVeNha;
TRUNCATE TABLE chiTietKyNang;
TRUNCATE TABLE baoCaoBaiHoc;
TRUNCATE TABLE diemDanh;
TRUNCATE TABLE buoiHoc;
TRUNCATE TABLE hocSinhLopHoc;
TRUNCATE TABLE baiTapGoc;
TRUNCATE TABLE dangBai;
TRUNCATE TABLE lopHoc;
TRUNCATE TABLE thongKeHocTap;
TRUNCATE TABLE hocSinh;
TRUNCATE TABLE phuHuynh;
TRUNCATE TABLE giaoVien;
TRUNCATE TABLE quanTriVien;
TRUNCATE TABLE nguoiDung;
TRUNCATE TABLE khoaHoc;
TRUNCATE TABLE sachGiaoTrinh;
TRUNCATE TABLE loaiBaiTap;
TRUNCATE TABLE kyNang;
TRUNCATE TABLE vaiTro;

SET FOREIGN_KEY_CHECKS = 1;

-- 1) Master data
INSERT INTO vaiTro (maVaiTro, tenVaiTro) VALUES
(1, 'Admin'),
(2, 'Giao_Vien'),
(3, 'Phu_Huynh'),
(4, 'Hoc_Sinh');

INSERT INTO kyNang (maKyNang, tenKyNang) VALUES
(1, 'Nghe'),
(2, 'Noi'),
(3, 'Doc'),
(4, 'Viet'),
(5, 'Ngu_Phap'),
(6, 'Tu_Vung');

INSERT INTO loaiBaiTap (maLoaiBaiTap, tenLoai, moTa, nhomPhanLoai, yeuCauChamDiem, diemAposGoiY) VALUES
(1, 'Trac_Nghiem', 'Bai tap chon dap an dung', 'Luyen_Tap', TRUE, 10),
(2, 'Tu_Luan', 'Bai tap viet ngan', 'Luyen_Tap', TRUE, 20),
(3, 'Nghe_Dien_Thong_Tin', 'Bai tap nghe va dien thong tin', 'Kiem_Tra', TRUE, 15),
(4, 'Noi_Theo_Chu_De', 'Bai tap noi theo chu de', 'Thuc_Hanh', TRUE, 25);

INSERT INTO sachGiaoTrinh (maSach, tenSach, nhaXuatBan, tacGia, phienBan, moTa) VALUES
(1, 'English Grammar in Use', 'Cambridge', 'Raymond Murphy', '5th', 'Core grammar for lower and mid levels'),
(2, 'Cambridge IELTS 16', 'Cambridge', 'Cambridge Team', '2021', 'IELTS exam practice set'),
(3, 'Destination B1', 'Macmillan', 'Malcolm Mann', '2nd', 'General English for teens');

INSERT INTO khoaHoc (maKhoaHoc, tenKhoaHoc, capDo, moTa, ngayTao) VALUES
(1, 'IELTS Foundation', 'Beginner', 'Build grammar and vocabulary foundation before IELTS', '2025-12-15 09:00:00'),
(2, 'IELTS Intermediate', 'Intermediate', 'Strengthen listening, reading, and writing skills', '2025-12-18 09:30:00'),
(3, 'IELTS Intensive', 'Advanced', 'Intensive IELTS preparation toward target band', '2025-12-20 10:00:00'),
(4, 'Teen Communication', 'A2-B1', 'Daily communication for teenagers', '2025-12-22 10:30:00');

-- 2) User accounts
INSERT INTO nguoiDung (
    maNguoiDung, tenDangNhap, email, matKhau, salt, hoTen, maVaiTro,
    anhDaiDien, trangThai, lanDangNhapCuoi, ngayTao, updatedAt
) VALUES
(1, 'admin_01', 'admin@example.com', '123456', 'salt_u001', 'Le Admin', 1, NULL, 'Hoat_Dong', '2026-04-21 08:10:00', '2026-01-02 08:00:00', '2026-04-21 08:10:00'),
(2, 'gv_anna', 'anna.teacher@example.com', '123456', 'salt_u002', 'Tran Anna', 2, NULL, 'Hoat_Dong', '2026-04-21 07:50:00', '2026-01-03 08:00:00', '2026-04-21 07:50:00'),
(3, 'gv_minh', 'minh.teacher@example.com', '123456', 'salt_u003', 'Nguyen Minh', 2, NULL, 'Hoat_Dong', '2026-04-21 07:40:00', '2026-01-03 08:10:00', '2026-04-21 07:40:00'),
(4, 'gv_lan', 'lan.teacher@example.com', '123456', 'salt_u004', 'Pham Lan', 2, NULL, 'Hoat_Dong', '2026-04-20 21:20:00', '2026-01-03 08:20:00', '2026-04-20 21:20:00'),
(5, 'ph_hoa', 'hoa.parent@example.com', '123456', 'salt_u005', 'Do Hoa', 3, NULL, 'Hoat_Dong', '2026-04-21 06:55:00', '2026-01-05 09:00:00', '2026-04-21 06:55:00'),
(6, 'ph_tuan', 'tuan.parent@example.com', '123456', 'salt_u006', 'Vu Tuan', 3, NULL, 'Hoat_Dong', '2026-04-21 06:40:00', '2026-01-05 09:05:00', '2026-04-21 06:40:00'),
(7, 'ph_thao', 'thao.parent@example.com', '123456', 'salt_u007', 'Bui Thao', 3, NULL, 'Hoat_Dong', '2026-04-20 22:05:00', '2026-01-05 09:10:00', '2026-04-20 22:05:00'),
(8, 'hs_nam', 'nam.student@example.com', '123456', 'salt_u008', 'Nguyen Nam', 4, NULL, 'Hoat_Dong', '2026-04-21 19:15:00', '2026-01-07 10:00:00', '2026-04-21 19:15:00'),
(9, 'hs_linh', 'linh.student@example.com', '123456', 'salt_u009', 'Tran Linh', 4, NULL, 'Hoat_Dong', '2026-04-21 19:00:00', '2026-01-07 10:10:00', '2026-04-21 19:00:00'),
(10, 'hs_khoi', 'khoi.student@example.com', '123456', 'salt_u010', 'Le Khoi', 4, NULL, 'Hoat_Dong', '2026-04-21 20:10:00', '2026-01-08 10:00:00', '2026-04-21 20:10:00'),
(11, 'hs_an', 'an.student@example.com', '123456', 'salt_u011', 'Pham An', 4, NULL, 'Hoat_Dong', '2026-04-21 20:00:00', '2026-01-08 10:15:00', '2026-04-21 20:00:00'),
(12, 'hs_my', 'my.student@example.com', '123456', 'salt_u012', 'Hoang My', 4, NULL, 'Hoat_Dong', '2026-04-21 18:45:00', '2026-01-09 09:30:00', '2026-04-21 18:45:00'),
(13, 'hs_duy', 'duy.student@example.com', '123456', 'salt_u013', 'Do Duy', 4, NULL, 'Hoat_Dong', '2026-04-21 21:15:00', '2026-01-09 09:35:00', '2026-04-21 21:15:00'),
(14, 'hs_ha', 'ha.student@example.com', '123456', 'salt_u014', 'Vu Ha', 4, NULL, 'Hoat_Dong', '2026-04-21 17:55:00', '2026-01-09 09:40:00', '2026-04-21 17:55:00');

-- 3) Profile tables
INSERT INTO quanTriVien (maQuanTri, maNguoiDung, phongBan) VALUES
(1, 1, 'Ban_Dieu_Hanh');

INSERT INTO giaoVien (maGiaoVien, maNguoiDung, chuyenMon, quocTich, tieuSu) VALUES
(1, 2, 'IELTS Writing', 'Viet Nam', '7 years teaching IELTS classes'),
(2, 3, 'IELTS Listening', 'Viet Nam', 'Focused on listening and note-taking'),
(3, 4, 'Communication', 'Viet Nam', 'Specialized in speaking classes for teens');

INSERT INTO phuHuynh (maPhuHuynh, maNguoiDung, soDienThoai, diaChi) VALUES
(1, 5, '0901000001', 'District 1, HCM'),
(2, 6, '0901000002', 'District 7, HCM'),
(3, 7, '0901000003', 'Thu Duc, HCM');

INSERT INTO hocSinh (maHocSinh, maNguoiDung, maPhuHuynh, ngaySinh, diemTongApos, updatedAt) VALUES
(1, 8, 1, '2011-05-12', 130, '2026-04-21 19:15:00'),
(2, 9, 1, '2010-11-03', 160, '2026-04-21 19:00:00'),
(3, 10, 2, '2011-01-20', 120, '2026-04-21 20:10:00'),
(4, 11, 2, '2010-08-15', 95, '2026-04-21 20:00:00'),
(5, 12, 3, '2011-03-02', 175, '2026-04-21 18:45:00'),
(6, 13, 3, '2009-12-22', 210, '2026-04-21 21:15:00'),
(7, 14, 3, '2011-09-09', 140, '2026-04-21 17:55:00');

-- 4) Classes and schedules
INSERT INTO lopHoc (maLop, maLopHienThi, maKhoaHoc, maGiaoVien, lichHoc, ngayTao, updatedAt) VALUES
(1, 'IELTS-FDN-01', 1, 1, 'Mon-Wed-Fri 18:00-19:30', '2026-01-05 08:00:00', '2026-04-20 10:00:00'),
(2, 'IELTS-INT-02', 2, 2, 'Tue-Thu-Sat 19:30-21:00', '2026-01-06 08:15:00', '2026-04-20 10:10:00'),
(3, 'IELTS-ADV-03', 3, 1, 'Sat-Sun 20:00-21:30', '2026-01-07 08:30:00', '2026-04-20 10:20:00'),
(4, 'COMM-A2-01', 4, 3, 'Tue-Thu 17:30-19:00', '2026-01-08 08:45:00', '2026-04-20 10:30:00');

INSERT INTO hocSinhLopHoc (maHocSinh, maLop, ngayThamGia, trangThai) VALUES
(1, 1, '2026-01-10', 'Dang_Hoc'),
(2, 1, '2026-01-10', 'Dang_Hoc'),
(5, 1, '2026-01-12', 'Dang_Hoc'),
(3, 2, '2026-01-11', 'Dang_Hoc'),
(4, 2, '2026-01-11', 'Dang_Hoc'),
(6, 3, '2026-01-15', 'Dang_Hoc'),
(7, 4, '2026-01-16', 'Dang_Hoc');

INSERT INTO lichDay (maLich, maLop, thu, gioBatDau, gioKetThuc) VALUES
(1, 1, 2, '18:00:00', '19:30:00'),
(2, 1, 4, '18:00:00', '19:30:00'),
(3, 2, 3, '19:30:00', '21:00:00'),
(4, 2, 5, '19:30:00', '21:00:00'),
(5, 3, 7, '20:00:00', '21:30:00'),
(6, 4, 3, '17:30:00', '19:00:00');

-- 5) Learning content
INSERT INTO dangBai (maDangBai, tenDangBai, maKyNang, soLuongCauMacDinh) VALUES
(1, 'Multiple_Choice', 3, 30),
(2, 'Fill_Blank', 5, 25),
(3, 'Essay', 4, 1),
(4, 'Speaking_Task', 2, 1);

INSERT INTO baiTapGoc (
    maBaiTapGoc, tieuDe, noiDung, maSach, maKhoaHoc, donViBai, trang, link,
    maLoaiBaiTap, doKho, thoiGianLamBaiPhut, trangThai, loaiHocThuat,
    maDangBai, capDoHoc, chungChi
) VALUES
(1, 'Present Simple Drill', 'Choose correct verb forms in daily routines.', 1, 1, 'Unit 1', '12-15', 'https://example.com/present-simple', 1, 'De', 25, 'Hoat_Dong', 'Grammar', 2, 7, 'THCS'),
(2, 'Listening Form Completion', 'Listen and fill missing details from conversations.', 2, 2, 'Test 1', '21-24', 'https://example.com/listening-form', 3, 'Trung_Binh', 30, 'Hoat_Dong', 'Nghe', 1, 9, 'THPT'),
(3, 'Opinion Essay Technology', 'Write an opinion essay about technology in school.', 2, 3, 'Writing Pack', '5-7', 'https://example.com/opinion-essay', 2, 'Kho', 45, 'Hoat_Dong', 'Viet', 3, 11, 'IELTS'),
(4, 'Vocabulary Education Topic', 'Study and apply topic vocabulary in context.', 3, 1, 'Unit 4', '44-46', 'https://example.com/vocab-edu', 1, 'Trung_Binh', 20, 'Hoat_Dong', 'Tu_Vung', 1, 8, 'THCS'),
(5, 'Speaking Part 2 Daily Routine', 'Speak for 2 minutes on a daily routine topic.', 2, 2, 'Speaking Set A', '9', 'https://example.com/speaking-part2', 4, 'Kho', 15, 'Hoat_Dong', 'Noi', 4, 10, 'THPT'),
(6, 'Reading Matching Headings', 'Match headings to paragraphs in an IELTS text.', 2, 3, 'Test 2', '56-59', 'https://example.com/matching-headings', 1, 'Rat_Kho', 40, 'Hoat_Dong', 'Doc', 1, 12, 'IELTS');

-- 6) Class sessions and attendance
INSERT INTO buoiHoc (maBuoiHoc, maLop, ngayHoc, gioBatDau, gioKetThuc, maGiaoVien, trangThaiGiaoVien, ghiChu) VALUES
(1, 1, '2026-03-03', '18:00:00', '19:30:00', 1, 'Day', 'Opening grammar review'),
(2, 1, '2026-03-05', '18:00:00', '19:30:00', 1, 'Day', 'Practice and correction'),
(3, 1, '2026-03-10', '18:00:00', '19:30:00', 1, 'Day', 'Short quiz in class'),
(4, 1, '2026-03-12', '18:00:00', '19:30:00', 2, 'Day_Thay', 'Substitute class due to teacher schedule'),
(5, 2, '2026-03-04', '19:30:00', '21:00:00', 2, 'Day', 'Listening strategy lesson'),
(6, 2, '2026-03-06', '19:30:00', '21:00:00', 2, 'Day', 'Dictation and summary'),
(7, 2, '2026-03-11', '19:30:00', '21:00:00', 2, 'Day', 'Mini mock test'),
(8, 4, '2026-03-03', '17:30:00', '19:00:00', 3, 'Day', 'Warm-up speaking session'),
(9, 4, '2026-03-05', '17:30:00', '19:00:00', 3, 'Day', 'Pair speaking practice'),
(10, 3, '2026-03-08', '20:00:00', '21:30:00', 1, 'Day', 'Advanced writing feedback'),
-- New sessions for April/May (Today is 2026-04-22)
(11, 1, '2026-04-14', '18:00:00', '19:30:00', 1, 'Day', 'Mid-term grammar review'),
(12, 1, '2026-04-16', '18:00:00', '19:30:00', 1, 'Day', 'Vocabulary builder'),
(13, 1, '2026-04-21', '18:00:00', '19:30:00', 1, 'Day', 'Sentence structure practice'),
(14, 1, '2026-04-23', '18:00:00', '19:30:00', 1, 'Day', 'Upcoming session: Essay planning'),
(15, 2, '2026-04-15', '19:30:00', '21:00:00', 2, 'Day', 'Advanced listening skills'),
(16, 2, '2026-04-17', '19:30:00', '21:00:00', 2, 'Day', 'Note-taking techniques'),
(17, 2, '2026-04-22', '19:30:00', '21:00:00', 2, 'Day', 'Today session: Mock Test Part 1'),
(18, 2, '2026-04-24', '19:30:00', '21:00:00', 2, 'Day', 'Next session: Detailed feedback'),
(19, 3, '2026-04-12', '20:00:00', '21:30:00', 1, 'Day', 'Argumentative writing workshop'),
(20, 3, '2026-04-19', '20:00:00', '21:30:00', 1, 'Day', 'Peer review session'),
(21, 3, '2026-04-26', '20:00:00', '21:30:00', 1, 'Day', 'Upcoming: Advanced vocabulary'),
(22, 4, '2026-04-15', '17:30:00', '19:00:00', 3, 'Day', 'Social communication'),
(23, 4, '2026-04-22', '17:30:00', '19:00:00', 3, 'Day', 'Today: Presentation skills'),
(24, 4, '2026-04-29', '17:30:00', '19:00:00', 3, 'Day', 'Future: Feedback and wrap-up');

INSERT INTO diemDanh (maBuoiHoc, maHocSinh, trangThai) VALUES
(1, 1, 'Co_Mat'), (1, 2, 'Co_Mat'), (1, 5, 'Muon'),
(2, 1, 'Co_Mat'), (2, 2, 'Vang'), (2, 5, 'Co_Phep'),
(3, 1, 'Co_Mat'), (3, 2, 'Co_Mat'), (3, 5, 'Co_Mat'),
(4, 1, 'Co_Mat'), (4, 2, 'Muon'), (4, 5, 'Co_Mat'),
(5, 3, 'Co_Mat'), (5, 4, 'Co_Mat'),
(6, 3, 'Co_Mat'), (6, 4, 'Vang'),
(7, 3, 'Muon'), (7, 4, 'Co_Mat'),
(8, 7, 'Co_Mat'),
(9, 7, 'Co_Mat'),
(10, 6, 'Co_Mat'),
-- New attendance (sessions 11, 12, 13, 15, 16, 19, 20, 22 are past or today before now)
(11, 1, 'Co_Mat'), (11, 2, 'Co_Mat'), (11, 5, 'Co_Mat'),
(12, 1, 'Co_Mat'), (12, 2, 'Muon'), (12, 5, 'Co_Mat'),
(13, 1, 'Vang'), (13, 2, 'Co_Mat'), (13, 5, 'Co_Mat'),
(15, 3, 'Co_Mat'), (15, 4, 'Co_Mat'),
(16, 3, 'Co_Mat'), (16, 4, 'Co_Phep'),
(19, 6, 'Co_Mat'),
(20, 6, 'Co_Mat'),
(22, 7, 'Co_Mat');

INSERT INTO diemDanhGiaoVien (maDiemDanh, maGiaoVien, maLop, ngayDay, trangThai, ghiChu, createdAt) VALUES
(1, 1, 1, '2026-03-03', 'Co_Mat', 'On time', '2026-03-03 21:00:00'),
(2, 1, 1, '2026-03-05', 'Co_Mat', 'On time', '2026-03-05 21:00:00'),
(3, 1, 1, '2026-03-10', 'Co_Mat', 'On time', '2026-03-10 21:00:00'),
(4, 2, 1, '2026-03-12', 'Co_Mat', 'Substitute class', '2026-03-12 21:00:00'),
(5, 2, 2, '2026-03-04', 'Co_Mat', 'On time', '2026-03-04 22:00:00'),
(6, 2, 2, '2026-03-06', 'Co_Mat', 'On time', '2026-03-06 22:00:00'),
(7, 2, 2, '2026-03-11', 'Muon', 'Late 10 minutes', '2026-03-11 22:00:00'),
(8, 3, 4, '2026-03-03', 'Co_Mat', 'On time', '2026-03-03 20:00:00'),
(9, 3, 4, '2026-03-05', 'Co_Mat', 'On time', '2026-03-05 20:00:00'),
(10, 1, 3, '2026-03-08', 'Co_Mat', 'On time', '2026-03-08 22:00:00');

-- 7) Reports and skill breakdown
INSERT INTO baoCaoBaiHoc (maBaoCao, maHocSinh, maGiaoVien, tieuDe, ngayHoc, tienDoHoanThanh, mucTieuBaiHoc, updatedAt) VALUES
(1, 1, 1, 'Weekly progress week 1', '2026-03-10', 78, 'Improve sentence accuracy in writing tasks.', '2026-03-10 20:10:00'),
(2, 2, 1, 'Weekly progress week 1', '2026-03-10', 70, 'Increase homework completion consistency.', '2026-03-10 20:12:00'),
(3, 5, 1, 'Weekly progress week 1', '2026-03-10', 82, 'Maintain strong speaking confidence.', '2026-03-10 20:15:00'),
(4, 3, 2, 'Listening report week 1', '2026-03-11', 75, 'Focus on key-word note taking.', '2026-03-11 21:40:00'),
(5, 4, 2, 'Listening report week 1', '2026-03-11', 68, 'Improve attendance and review vocabulary.', '2026-03-11 21:45:00'),
(6, 6, 1, 'Advanced writing report', '2026-03-08', 85, 'Develop argument depth for IELTS Task 2.', '2026-03-08 22:30:00'),
(7, 7, 3, 'Speaking report week 1', '2026-03-05', 80, 'Practice fluency and response extension.', '2026-03-05 19:20:00'),
(8, 1, 1, 'Grammar progress April', '2026-04-14', 85, 'Reviewing complex sentence structures.', '2026-04-14 20:00:00'),
(9, 2, 1, 'Grammar progress April', '2026-04-14', 75, 'Focus on relative clauses.', '2026-04-14 20:05:00'),
(10, 3, 2, 'Listening update', '2026-04-15', 80, 'Improving section 3 accuracy.', '2026-04-15 21:30:00'),
(11, 6, 1, 'Advanced Writing Prep', '2026-04-12', 90, 'Focus on cohesion and coherence.', '2026-04-12 22:00:00'),
(12, 7, 3, 'Communication Skills', '2026-04-15', 85, 'Discussing social topics with ease.', '2026-04-15 19:30:00');

INSERT INTO chiTietKyNang (maBaoCao, maKyNang, diemSo, nhanXetGiaoVien) VALUES
(1, 4, 76, 'Writing structure is clear but needs more linking words.'),
(1, 5, 80, 'Grammar control is improving week by week.'),
(2, 4, 68, 'Ideas are good, but examples need detail.'),
(2, 6, 72, 'Vocabulary usage is acceptable for current level.'),
(3, 2, 84, 'Strong delivery and good eye contact.'),
(3, 6, 80, 'Topic vocabulary is used accurately.'),
(4, 1, 74, 'Listening for detail has improved.'),
(4, 3, 76, 'Reading speed is stable under time pressure.'),
(5, 1, 66, 'Missed key details in section 2.'),
(5, 6, 70, 'Need to revise topic vocabulary before class.'),
(6, 4, 86, 'Argument coherence is strong.'),
(6, 3, 84, 'Reads prompts carefully and responds accurately.'),
(7, 2, 82, 'Fluency improved compared to previous class.'),
(7, 6, 78, 'Needs wider lexical resource for abstract topics.'),
(8, 5, 82, 'Excellent use of complex grammar.'),
(9, 5, 70, 'Still confusing some relative pronouns.'),
(10, 1, 85, 'Great focus during the listening task.'),
(11, 4, 88, 'Strong logic and flow in the essay.'),
(12, 2, 84, 'Very natural interaction and good pronunciation.');

-- 8) Homework and submissions
INSERT INTO baiTapVeNha (maBaiTap, maBaiTapGoc, maLop, ngayGiao, hanNop, thuongApos, link, trangThai, kieuNop) VALUES
(1, 1, 1, '2026-03-03 20:00:00', '2026-03-09 23:59:00', 10, 'https://example.com/homework/1', 'Dong', 'Text'),
(2, 4, 1, '2026-03-10 20:00:00', '2026-03-16 23:59:00', 12, 'https://example.com/homework/2', 'Dong', 'Text'),
(3, 2, 2, '2026-04-01 21:10:00', '2026-04-08 23:59:00', 15, 'https://example.com/homework/3', 'Dong', 'File'),
(4, 5, 4, '2026-04-10 19:10:00', '2026-04-20 23:59:00', 20, 'https://example.com/homework/4', 'Dang_Mo', 'Ket_Hop'),
(5, 6, 3, '2026-04-12 21:40:00', '2026-04-22 23:59:00', 25, 'https://example.com/homework/5', 'Dang_Mo', 'File'),
(6, 1, 1, '2026-04-14 20:00:00', '2026-04-20 23:59:00', 10, 'https://example.com/homework/6', 'Dong', 'Text'),
(7, 4, 1, '2026-04-16 20:00:00', '2026-04-23 23:59:00', 15, 'https://example.com/homework/7', 'Dang_Mo', 'Text'),
(8, 2, 2, '2026-04-17 21:10:00', '2026-04-25 23:59:00', 20, 'https://example.com/homework/8', 'Dang_Mo', 'File'),
(9, 5, 4, '2026-04-22 19:10:00', '2026-05-01 23:59:00', 30, 'https://example.com/homework/9', 'Dang_Mo', 'Ket_Hop'),
(10, 6, 3, '2026-04-20 21:40:00', '2026-05-05 23:59:00', 35, 'https://example.com/homework/10', 'Dang_Mo', 'File');

INSERT INTO baiNopHocSinh (maBaiNop, maBaiTap, maHocSinh, ngayNop, duongDanBaiLam, diemSo, loiPheGiaoVien, trangThai) VALUES
(1, 1, 1, '2026-03-08 20:12:00', 'https://files.example.com/submissions/1', 8.50, 'Good effort, revise tense consistency.', 'Da_Cham'),
(2, 1, 2, '2026-03-09 22:02:00', 'https://files.example.com/submissions/2', 7.00, 'Need to check verb agreement.', 'Da_Cham'),
(3, 1, 5, '2026-03-08 18:30:00', 'https://files.example.com/submissions/3', 9.00, 'Clear and accurate response.', 'Da_Cham'),
(4, 2, 1, '2026-03-15 21:00:00', 'https://files.example.com/submissions/4', 8.00, 'Good progress on vocabulary use.', 'Da_Cham'),
(5, 2, 2, '2026-03-16 23:15:00', 'https://files.example.com/submissions/5', 6.50, 'Need more complete answers.', 'Can_Lam_Lai'),
(6, 3, 3, '2026-04-07 22:40:00', 'https://files.example.com/submissions/6', 7.80, 'Listening details are mostly correct.', 'Da_Cham'),
(7, 3, 4, '2026-04-08 22:10:00', 'https://files.example.com/submissions/7', 6.90, 'Missed names and numbers in part 3.', 'Da_Cham'),
(8, 4, 7, '2026-04-18 18:00:00', 'https://files.example.com/submissions/8', NULL, NULL, 'Cho_Cham'),
(9, 5, 6, '2026-04-21 21:20:00', 'https://files.example.com/submissions/9', NULL, NULL, 'Cho_Cham'),
(10, 6, 1, '2026-04-19 18:00:00', 'https://files.example.com/submissions/10', 8.20, 'Good grammar accuracy.', 'Da_Cham'),
(11, 6, 2, '2026-04-20 10:00:00', 'https://files.example.com/submissions/11', 7.50, 'Ideas are fine but need more depth.', 'Da_Cham'),
(12, 7, 1, '2026-04-21 20:00:00', 'https://files.example.com/submissions/12', NULL, NULL, 'Cho_Cham'),
(13, 8, 3, '2026-04-22 15:00:00', 'https://files.example.com/submissions/13', NULL, NULL, 'Cho_Cham');

INSERT INTO nhanXetBaiLam (maNhanXet, maBaiNop, noiDung, viTriBatDau, viTriKetThuc, nguoiNhanXet, ngayTao) VALUES
(1, 1, 'Use present simple instead of present continuous in line 2.', 45, 68, 'Giao_Vien', '2026-03-09 09:00:00'),
(2, 2, 'Please add one more supporting example in paragraph 1.', 90, 140, 'Giao_Vien', '2026-03-10 09:10:00'),
(3, 5, 'I rewrote this paragraph as requested.', 10, 80, 'Hoc_Sinh', '2026-03-17 07:30:00'),
(4, 6, 'Great note-taking, keep this method for test day.', 0, 0, 'Giao_Vien', '2026-04-08 08:40:00');

INSERT INTO nhatKyApos (maLog, maHocSinh, soDiem, lyDo, ngayTao) VALUES
(1, 1, 10, 'Submit homework on time', '2026-03-09 23:00:00'),
(2, 2, -5, 'Late submission', '2026-03-16 23:30:00'),
(3, 3, 10, 'Active participation in listening class', '2026-04-07 21:30:00'),
(4, 5, 15, 'Best score in grammar quiz', '2026-03-10 20:30:00'),
(5, 6, 20, 'Excellent writing improvement', '2026-04-21 22:00:00'),
(6, 7, 10, 'Completed speaking task early', '2026-04-18 18:30:00');

-- 9) Notifications
INSERT INTO thongBao (maThongBao, tieuDe, noiDung, loaiThongBao, maNguoiGui, ngayGui) VALUES
(1, 'Welcome to term 2026', 'Please review your class schedule and profile information.', 'He_Thong', 1, '2026-01-05 09:00:00'),
(2, 'Homework deadline reminder', 'Class IELTS-FDN-01 homework #2 closes at 23:59 on Mar 16.', 'Hoc_Tap', 2, '2026-03-16 10:00:00'),
(3, 'Mock test announcement', 'IELTS-INT-02 mock listening test is on Apr 20.', 'Kiem_Tra', 3, '2026-04-15 12:00:00'),
(4, 'Parent meeting notice', 'Parent consultation window opens from Apr 25 to Apr 27.', 'Phu_Huynh', 1, '2026-04-18 08:30:00'),
(5, 'Class schedule update', 'Next Monday session for IELTS-FDN-01 moved to 18:30.', 'Hoc_Tap', 1, '2026-04-21 10:00:00'),
(6, 'New lecture material available', 'Check the resources section for new PDF on Advanced Writing.', 'He_Thong', 2, '2026-04-22 09:00:00');

INSERT INTO nguoiNhanThongBao (maThongBao, maNguoiDung, daDoc) VALUES
(1, 2, TRUE),
(1, 3, TRUE),
(1, 4, TRUE),
(1, 8, FALSE),
(1, 9, TRUE),
(2, 8, TRUE),
(2, 9, FALSE),
(2, 12, TRUE),
(3, 10, FALSE),
(3, 11, FALSE),
(4, 5, FALSE),
(4, 6, FALSE),
(4, 7, TRUE),
(5, 8, FALSE), (5, 9, FALSE), (5, 12, TRUE),
(6, 13, FALSE), (6, 14, TRUE);

-- 10) Parent reports and class requests
INSERT INTO baoCaoPhuHuynh (
    maBaoCao, maHocSinh, maPhuHuynh, thang, nam, nhanXetGiaoVien,
    tienDoHocTap, soBuoiVang, tongDiemApos, tinhTrangHocPhi, ngayTao
) VALUES
(1, 1, 1, 3, 2026, 'Steady progress in grammar and writing.', 'Tot', 0, 130, 'Da_Dong', '2026-03-31 20:00:00'),
(2, 2, 1, 3, 2026, 'Needs better consistency in homework routines.', 'Trung_Binh', 1, 160, 'Da_Dong', '2026-03-31 20:05:00'),
(3, 3, 2, 3, 2026, 'Listening skills are improving gradually.', 'Tot', 0, 120, 'Da_Dong', '2026-03-31 20:10:00'),
(4, 4, 2, 3, 2026, 'Attendance should improve next month.', 'Can_Cai_Thien', 1, 95, 'Da_Dong', '2026-03-31 20:15:00'),
(5, 5, 3, 3, 2026, 'Strong speaking confidence and class engagement.', 'Tot', 0, 175, 'Da_Dong', '2026-03-31 20:20:00'),
(6, 6, 3, 3, 2026, 'Advanced writing has clear improvements.', 'Tot', 0, 210, 'Da_Dong', '2026-03-31 20:25:00'),
(7, 7, 3, 3, 2026, 'Needs wider vocabulary for conversation topics.', 'Trung_Binh', 0, 140, 'Da_Dong', '2026-03-31 20:30:00');

INSERT INTO yeuCauVaoLop (maYeuCau, maHocSinh, maLop, trangThai, ngayYeuCau) VALUES
(1, 4, 3, 'Cho_Duyet', '2026-04-18 09:00:00'),
(2, 2, 4, 'Tu_Choi', '2026-02-10 10:30:00'),
(3, 3, 1, 'Da_Duyet', '2026-01-09 15:20:00');

-- 11) Lecture content and tests
INSERT INTO chuDeBaiGiang (maChuDe, maLop, tenChuDe) VALUES
(1, 1, 'Tense Revision'),
(2, 2, 'Listening for Details'),
(3, 3, 'Argument Structure'),
(4, 4, 'Daily Communication');

INSERT INTO baiGiang (maBaiGiang, maChuDe, tieuDe, noiDung, fileDinhKem, ngayDang) VALUES
(1, 1, 'Present Simple vs Present Continuous', 'Key usage patterns with class examples.', 'https://files.example.com/lessons/tense-revision.pdf', '2026-03-03 20:05:00'),
(2, 1, 'Common Grammar Errors', 'Frequent mistakes and how to self-check.', 'https://files.example.com/lessons/grammar-errors.pdf', '2026-03-05 20:10:00'),
(3, 2, 'Predicting Before Listening', 'Techniques to improve detail retention.', 'https://files.example.com/lessons/listening-predict.pdf', '2026-03-04 21:05:00'),
(4, 3, 'Building Strong Arguments', 'Task 2 paragraph planning strategies.', 'https://files.example.com/lessons/argument-structure.pdf', '2026-03-08 21:40:00'),
(5, 4, 'Conversation Openers', 'Practical phrases for everyday speaking.', 'https://files.example.com/lessons/conversation-openers.pdf', '2026-03-03 19:05:00');

INSERT INTO baiKiemTra (maKiemTra, maLop, tieuDe, thoiGianLamPhut, hanKetThuc, tongDiem) VALUES
(1, 1, 'Grammar Checkpoint 1', 30, '2026-03-20 21:00:00', 100),
(2, 2, 'Listening Mini Mock', 40, '2026-04-20 21:30:00', 100),
(3, 4, 'Speaking Topic Quiz', 15, '2026-04-25 19:30:00', 100),
(4, 1, 'Monthly Grammar Review', 45, '2026-04-30 21:00:00', 100),
(5, 2, 'Listening Progress Test', 30, '2026-04-28 21:30:00', 100);

INSERT INTO ketQuaKiemTra (maKiemTra, maHocSinh, diemSo, nhanXetGiaoVien, ngayNop) VALUES
(1, 1, 82.50, 'Solid grammar accuracy overall.', '2026-03-20 20:30:00'),
(1, 2, 74.00, 'Needs better attention in tense forms.', '2026-03-20 20:35:00'),
(1, 5, 88.00, 'Very good control and speed.', '2026-03-20 20:40:00'),
(2, 3, 79.50, 'Good detail extraction in section 2.', '2026-04-20 21:10:00'),
(2, 4, 70.00, 'Missed proper nouns and numbers.', '2026-04-20 21:12:00'),
(3, 7, 84.00, 'Fluent response with clear ideas.', '2026-04-25 19:20:00'),
(4, 1, 88.50, 'Very consistent performance.', '2026-04-22 10:00:00'),
(4, 2, 80.00, 'Good improvement.', '2026-04-22 10:15:00');

-- 12) Student statistics snapshot
INSERT INTO thongKeHocTap (maThongKe, maHocSinh, tongBaiTap, tongBaiHoanThanh, diemTrungBinh) VALUES
(1, 1, 4, 4, 8.40),
(2, 2, 4, 4, 7.30),
(3, 3, 2, 2, 7.85),
(4, 4, 2, 2, 7.00),
(5, 5, 2, 2, 8.90),
(6, 6, 3, 2, 8.20),
(7, 7, 2, 1, 8.40);

-- Done: database is cleaned and reseeded with consistent data.
