using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;
using backend.Utilities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class SchedulePlannerService : ISchedulePlannerService
{
    private readonly AppDbContext _context;

    public SchedulePlannerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<object> GetScheduleOptionsAsync()
    {
        var classes = await _context.LopHocs
            .Include(l => l.MaKhoaHocNavigation)
            .Include(l => l.MaGiaoVienNavigation)
                .ThenInclude(g => g.MaNguoiDungNavigation)
            .OrderBy(l => l.MaLopHienThi)
            .Select(l => new
            {
                maLop = l.MaLop,
                maLopHienThi = l.MaLopHienThi,
                tenKhoaHoc = l.MaKhoaHocNavigation.TenKhoaHoc,
                maGiaoVien = l.MaGiaoVien,
                tenGiaoVien = l.MaGiaoVienNavigation != null
                    ? l.MaGiaoVienNavigation.MaNguoiDungNavigation.HoTen
                    : null,
                soHocSinh = l.HocSinhLopHocs.Count
            })
            .ToListAsync();

        var rooms = await _context.PhongHocs
            .Where(p => p.TrangThai == "Hoat_Dong")
            .OrderBy(p => p.SucChua)
            .ThenBy(p => p.TenPhong)
            .Select(p => new
            {
                maPhongHoc = p.MaPhongHoc,
                tenPhong = p.TenPhong,
                sucChua = p.SucChua,
                ghiChu = p.GhiChu
            })
            .ToListAsync();

        var slots = await _context.KhungGioHocs
            .Where(k => k.TrangThai == "Hoat_Dong")
            .OrderBy(k => k.ThuTu)
            .Select(k => new
            {
                maKhungGio = k.MaKhungGio,
                tenKhungGio = k.TenKhungGio,
                gioBatDau = k.GioBatDau.ToString("HH\\:mm"),
                gioKetThuc = k.GioKetThuc.ToString("HH\\:mm"),
                thuTu = k.ThuTu
            })
            .ToListAsync();

        return new
        {
            lopHocs = classes,
            phongHocs = rooms,
            khungGios = slots
        };
    }

    public async Task<object> GetAvailabilityAsync(int maLop, DateOnly ngayHoc, int? maGiaoVien = null)
    {
        var lopHoc = await _context.LopHocs
            .Include(l => l.MaGiaoVienNavigation)
                .ThenInclude(g => g.MaNguoiDungNavigation)
            .FirstOrDefaultAsync(l => l.MaLop == maLop);

        if (lopHoc == null)
        {
            return new
            {
                success = false,
                message = "Không tìm thấy lớp học."
            };
        }

        var teacherId = maGiaoVien ?? lopHoc.MaGiaoVien;
        var studentIds = await GetStudentIdsOfClassAsync(maLop);
        var rooms = await GetCandidateRoomsAsync(studentIds.Count, null);
        var slots = await _context.KhungGioHocs
            .Where(k => k.TrangThai == "Hoat_Dong")
            .OrderBy(k => k.ThuTu)
            .ToListAsync();

        var availability = new List<object>();

        foreach (var slot in slots)
        {
            var teacherConflict = teacherId.HasValue
                ? await HasTeacherConflictAsync(teacherId.Value, ngayHoc, slot.GioBatDau, slot.GioKetThuc)
                : false;
            var studentConflict = studentIds.Count > 0
                ? await HasStudentSessionConflictAsync(studentIds, ngayHoc, slot.GioBatDau, slot.GioKetThuc)
                : false;

            var roomStatuses = new List<object>();
            foreach (var room in rooms)
            {
                var roomConflict = await HasRoomConflictAsync(room.MaPhongHoc, ngayHoc, slot.GioBatDau, slot.GioKetThuc);
                roomStatuses.Add(new
                {
                    maPhongHoc = room.MaPhongHoc,
                    tenPhong = room.TenPhong,
                    sucChua = room.SucChua,
                    khaDung = !roomConflict,
                    lyDo = roomConflict ? "Phòng đã có lịch." : null
                });
            }

            availability.Add(new
            {
                maKhungGio = slot.MaKhungGio,
                tenKhungGio = slot.TenKhungGio,
                gioBatDau = slot.GioBatDau.ToString("HH\\:mm"),
                gioKetThuc = slot.GioKetThuc.ToString("HH\\:mm"),
                giaoVienTrong = !teacherConflict,
                hocSinhTrong = !studentConflict,
                phongHoc = roomStatuses,
                khaDung = !teacherConflict && !studentConflict && roomStatuses.Any(r => (bool)r.GetType().GetProperty("khaDung")!.GetValue(r)!)
            });
        }

        return new
        {
            success = true,
            maLop = maLop,
            ngayHoc = ngayHoc.ToString("yyyy-MM-dd"),
            maGiaoVien = teacherId,
            lichTrong = availability
        };
    }

    public async Task<(bool Success, object Payload, int StatusCode)> CreateManualScheduleAsync(
        ScheduleManualCreateDto dto,
        ClaimsPrincipal user)
    {
        var lopHoc = await _context.LopHocs.FirstOrDefaultAsync(l => l.MaLop == dto.MaLop);
        if (lopHoc == null)
        {
            return (false, new { message = "Không tìm thấy lớp học." }, StatusCodes.Status404NotFound);
        }

        var khungGio = await _context.KhungGioHocs
            .FirstOrDefaultAsync(k => k.MaKhungGio == dto.MaKhungGio && k.TrangThai == "Hoat_Dong");
        if (khungGio == null)
        {
            return (false, new { message = "Khung giờ không hợp lệ." }, StatusCodes.Status400BadRequest);
        }

        var phongHoc = await _context.PhongHocs
            .FirstOrDefaultAsync(p => p.MaPhongHoc == dto.MaPhongHoc && p.TrangThai == "Hoat_Dong");
        if (phongHoc == null)
        {
            return (false, new { message = "Phòng học không hợp lệ." }, StatusCodes.Status400BadRequest);
        }

        var teacherId = dto.MaGiaoVien ?? lopHoc.MaGiaoVien;
        if (!teacherId.HasValue)
        {
            return (false, new { message = "Lớp chưa được gán giáo viên." }, StatusCodes.Status400BadRequest);
        }

        var studentIds = await GetStudentIdsOfClassAsync(dto.MaLop);
        if (phongHoc.SucChua < studentIds.Count)
        {
            return (false, new { message = "Phòng học không đủ sức chứa cho lớp này." }, StatusCodes.Status400BadRequest);
        }

        var conflicts = await GetConflictsAsync(
            dto.MaLop,
            teacherId.Value,
            dto.MaPhongHoc,
            dto.NgayHoc,
            khungGio.GioBatDau,
            khungGio.GioKetThuc,
            studentIds);

        if (conflicts.Any())
        {
            return (false, new
            {
                message = "Không thể xếp lịch thủ công vì đang có xung đột.",
                conflicts
            }, StatusCodes.Status409Conflict);
        }

        var buoiHoc = new BuoiHoc
        {
            MaLop = dto.MaLop,
            NgayHoc = dto.NgayHoc,
            GioBatDau = khungGio.GioBatDau,
            GioKetThuc = khungGio.GioKetThuc,
            MaGiaoVien = teacherId.Value,
            TrangThaiGiaoVien = string.IsNullOrWhiteSpace(dto.TrangThaiGiaoVien) ? "Day" : dto.TrangThaiGiaoVien,
            GhiChu = dto.GhiChu
        };

        _context.BuoiHocs.Add(buoiHoc);
        await _context.SaveChangesAsync();

        var chiTiet = new ChiTietXepLich
        {
            MaBuoiHoc = buoiHoc.MaBuoiHoc,
            MaPhongHoc = dto.MaPhongHoc,
            MaKhungGio = dto.MaKhungGio,
            LoaiXepLich = "Thu_Cong",
            TrangThai = "Hoat_Dong",
            GhiChu = dto.GhiChu
        };

        _context.ChiTietXepLiches.Add(chiTiet);
        await _context.SaveChangesAsync();

        return (true, new
        {
            message = "Đã tạo lịch thủ công thành công.",
            session = new
            {
                maBuoiHoc = buoiHoc.MaBuoiHoc,
                maLop = buoiHoc.MaLop,
                ngayHoc = buoiHoc.NgayHoc.ToString("yyyy-MM-dd"),
                gioBatDau = buoiHoc.GioBatDau.ToString("HH\\:mm"),
                gioKetThuc = buoiHoc.GioKetThuc.ToString("HH\\:mm"),
                maGiaoVien = buoiHoc.MaGiaoVien,
                maPhongHoc = chiTiet.MaPhongHoc,
                maKhungGio = chiTiet.MaKhungGio
            }
        }, StatusCodes.Status201Created);
    }

    public async Task<(bool Success, object Payload, int StatusCode)> CreateAutoScheduleAsync(
        ScheduleAutoCreateDto dto,
        ClaimsPrincipal user)
    {
        if (dto.DenNgay < dto.TuNgay)
        {
            return (false, new { message = "Khoảng ngày không hợp lệ." }, StatusCodes.Status400BadRequest);
        }

        var lopHoc = await _context.LopHocs
            .Include(l => l.LichDays)
            .FirstOrDefaultAsync(l => l.MaLop == dto.MaLop);
        if (lopHoc == null)
        {
            return (false, new { message = "Không tìm thấy lớp học." }, StatusCodes.Status404NotFound);
        }

        var teacherId = dto.MaGiaoVien ?? lopHoc.MaGiaoVien;
        if (!teacherId.HasValue)
        {
            return (false, new { message = "Lớp chưa được gán giáo viên." }, StatusCodes.Status400BadRequest);
        }

        var patterns = await ResolveAutoPatternsAsync(lopHoc, dto);
        if (patterns.Count == 0)
        {
            return (false, new
            {
                message = "Không có mẫu lịch để xếp tự động. Hãy truyền mẫu lịch hoặc khai báo lichDay cho lớp."
            }, StatusCodes.Status400BadRequest);
        }

        var studentIds = await GetStudentIdsOfClassAsync(dto.MaLop);
        var candidateRooms = await GetCandidateRoomsAsync(studentIds.Count, dto.PhongHocUuTien);
        if (candidateRooms.Count == 0)
        {
            return (false, new { message = "Không có phòng học nào đủ điều kiện để xếp lịch." }, StatusCodes.Status400BadRequest);
        }

        var creatorId = GetCurrentUserId(user);
        if (!creatorId.HasValue)
        {
            return (false, new { message = "Không xác định được người tạo lịch." }, StatusCodes.Status401Unauthorized);
        }

        var targetDates = BuildTargetDates(dto.TuNgay, dto.DenNgay, patterns)
            .OrderBy(x => x.NgayHoc)
            .ThenBy(x => x.Pattern.MaKhungGio)
            .ToList();

        if (dto.SoBuoiToiDa.HasValue)
        {
            targetDates = targetDates.Take(dto.SoBuoiToiDa.Value).ToList();
        }

        var dotXepLich = new DotXepLich
        {
            MaLop = dto.MaLop,
            MaNguoiTao = creatorId.Value,
            CheDoXepLich = "Tu_Dong",
            TuNgay = dto.TuNgay,
            DenNgay = dto.DenNgay,
            TrangThai = "Dang_Xep",
            TongBuoiDuKien = targetDates.Count,
            TongBuoiDaXep = 0,
            GhiChu = dto.GhiChu
        };

        _context.DotXepLiches.Add(dotXepLich);
        await _context.SaveChangesAsync();

        var createdSessions = new List<object>();
        var skippedSessions = new List<object>();

        foreach (var item in targetDates)
        {
            var roomCandidates = item.Pattern.MaPhongHoc.HasValue
                ? candidateRooms.Where(r => r.MaPhongHoc == item.Pattern.MaPhongHoc.Value).ToList()
                : candidateRooms;

            if (roomCandidates.Count == 0)
            {
                skippedSessions.Add(new
                {
                    ngayHoc = item.NgayHoc.ToString("yyyy-MM-dd"),
                    maKhungGio = item.Pattern.MaKhungGio,
                    lyDo = "Không có phòng phù hợp."
                });
                continue;
            }

            var conflictBase = await GetConflictsAsync(
                dto.MaLop,
                teacherId.Value,
                null,
                item.NgayHoc,
                item.Pattern.KhungGio.GioBatDau,
                item.Pattern.KhungGio.GioKetThuc,
                studentIds);

            if (conflictBase.Any())
            {
                skippedSessions.Add(new
                {
                    ngayHoc = item.NgayHoc.ToString("yyyy-MM-dd"),
                    maKhungGio = item.Pattern.MaKhungGio,
                    lyDo = string.Join("; ", conflictBase.Select(c => c.GetType().GetProperty("message")?.GetValue(c)?.ToString()))
                });
                continue;
            }

            var selectedRoom = roomCandidates.FirstOrDefault(asyncRoom =>
                !HasRoomConflictAsync(asyncRoom.MaPhongHoc, item.NgayHoc, item.Pattern.KhungGio.GioBatDau, item.Pattern.KhungGio.GioKetThuc)
                    .GetAwaiter()
                    .GetResult());

            if (selectedRoom == null)
            {
                skippedSessions.Add(new
                {
                    ngayHoc = item.NgayHoc.ToString("yyyy-MM-dd"),
                    maKhungGio = item.Pattern.MaKhungGio,
                    lyDo = "Toàn bộ phòng phù hợp đều bận."
                });
                continue;
            }

            var buoiHoc = new BuoiHoc
            {
                MaLop = dto.MaLop,
                NgayHoc = item.NgayHoc,
                GioBatDau = item.Pattern.KhungGio.GioBatDau,
                GioKetThuc = item.Pattern.KhungGio.GioKetThuc,
                MaGiaoVien = teacherId.Value,
                TrangThaiGiaoVien = "Day",
                GhiChu = dto.GhiChu
            };

            _context.BuoiHocs.Add(buoiHoc);
            await _context.SaveChangesAsync();

            _context.ChiTietXepLiches.Add(new ChiTietXepLich
            {
                MaBuoiHoc = buoiHoc.MaBuoiHoc,
                MaPhongHoc = selectedRoom.MaPhongHoc,
                MaKhungGio = item.Pattern.MaKhungGio,
                MaDotXepLich = dotXepLich.MaDotXepLich,
                LoaiXepLich = "Tu_Dong",
                TrangThai = "Hoat_Dong",
                GhiChu = dto.GhiChu
            });
            await _context.SaveChangesAsync();

            createdSessions.Add(new
            {
                maBuoiHoc = buoiHoc.MaBuoiHoc,
                ngayHoc = buoiHoc.NgayHoc.ToString("yyyy-MM-dd"),
                khungGio = item.Pattern.KhungGio.TenKhungGio,
                phongHoc = selectedRoom.TenPhong
            });
        }

        dotXepLich.TongBuoiDaXep = createdSessions.Count;
        dotXepLich.TrangThai = createdSessions.Count == 0
            ? "That_Bai"
            : createdSessions.Count == dotXepLich.TongBuoiDuKien
                ? "Hoan_Tat"
                : "Mot_Phan";

        await _context.SaveChangesAsync();

        return (true, new
        {
            message = createdSessions.Count == 0
                ? "Không thể xếp được buổi nào."
                : "Đã hoàn tất xếp lịch tự động.",
            maDotXepLich = dotXepLich.MaDotXepLich,
            trangThai = dotXepLich.TrangThai,
            tongBuoiDuKien = dotXepLich.TongBuoiDuKien,
            tongBuoiDaXep = dotXepLich.TongBuoiDaXep,
            createdSessions,
            skippedSessions
        }, StatusCodes.Status200OK);
    }

    public async Task<(bool Success, object Payload, int StatusCode)> ProcessRescheduleRequestAsync(
        int maYeuCau,
        AdminRescheduleProcessDto dto,
        ClaimsPrincipal user)
    {
        var request = await _context.YeuCauDoiLiches
            .Include(r => r.MaBuoiHocNavigation)
                .ThenInclude(b => b.MaLopNavigation)
            .Include(r => r.MaGiaoVienNavigation)
                .ThenInclude(g => g.MaNguoiDungNavigation)
            .Include(r => r.MaKhungGioDeXuatNavigation)
            .Include(r => r.MaPhongHocDeXuatNavigation)
            .FirstOrDefaultAsync(r => r.MaYeuCau == maYeuCau);

        if (request == null)
        {
            return (false, new { message = "Không tìm thấy yêu cầu đổi lịch." }, StatusCodes.Status404NotFound);
        }

        if (request.TrangThai != "Cho_Duyet")
        {
            return (false, new { message = "Yêu cầu này đã được xử lý trước đó." }, StatusCodes.Status409Conflict);
        }

        var processorId = GetCurrentUserId(user);
        if (!processorId.HasValue)
        {
            return (false, new { message = "Không xác định được người xử lý." }, StatusCodes.Status401Unauthorized);
        }

        var normalizedStatus = (dto.TrangThai ?? string.Empty).Trim();
        if (normalizedStatus != "Da_Duyet" && normalizedStatus != "Tu_Choi")
        {
            return (false, new { message = "Trạng thái xử lý không hợp lệ." }, StatusCodes.Status400BadRequest);
        }

        if (normalizedStatus == "Tu_Choi")
        {
            request.TrangThai = "Tu_Choi";
            request.MaNguoiXuLy = processorId.Value;
            request.NgayXuLy = DateTime.Now;
            request.GhiChuXuLy = dto.GhiChuXuLy;
            await _context.SaveChangesAsync();

            return (true, new
            {
                message = "Đã từ chối yêu cầu đổi lịch.",
                requestId = request.MaYeuCau,
                trangThai = request.TrangThai
            }, StatusCodes.Status200OK);
        }

        var buoiHoc = request.MaBuoiHocNavigation;
        var chiTietXepLich = await _context.ChiTietXepLiches
            .FirstOrDefaultAsync(c => c.MaBuoiHoc == buoiHoc.MaBuoiHoc && c.TrangThai == "Hoat_Dong");

        var targetDate = dto.NgayHocMoi ?? request.NgayDeXuatMoi;
        var targetSlotId = dto.MaKhungGio ?? request.MaKhungGioDeXuat;
        var targetRoomId = dto.MaPhongHoc ?? request.MaPhongHocDeXuat ?? chiTietXepLich?.MaPhongHoc;

        if (!targetRoomId.HasValue)
        {
            return (false, new { message = "Cần chọn phòng học để đổi lịch." }, StatusCodes.Status400BadRequest);
        }

        var khungGio = await _context.KhungGioHocs
            .FirstOrDefaultAsync(k => k.MaKhungGio == targetSlotId && k.TrangThai == "Hoat_Dong");
        if (khungGio == null)
        {
            return (false, new { message = "Khung giờ không hợp lệ." }, StatusCodes.Status400BadRequest);
        }

        var phongHoc = await _context.PhongHocs
            .FirstOrDefaultAsync(p => p.MaPhongHoc == targetRoomId.Value && p.TrangThai == "Hoat_Dong");
        if (phongHoc == null)
        {
            return (false, new { message = "Phòng học không hợp lệ." }, StatusCodes.Status400BadRequest);
        }

        var studentIds = await GetStudentIdsOfClassAsync(buoiHoc.MaLop);
        if (phongHoc.SucChua < studentIds.Count)
        {
            return (false, new { message = "Phòng học không đủ sức chứa cho lớp này." }, StatusCodes.Status400BadRequest);
        }

        var conflicts = new List<object>();

        if (await HasTeacherConflictAsync(
                buoiHoc.MaGiaoVien,
                targetDate,
                khungGio.GioBatDau,
                khungGio.GioKetThuc,
                buoiHoc.MaBuoiHoc))
        {
            conflicts.Add(new
            {
                type = "Teacher",
                message = "Giáo viên đã có lịch ở khung giờ mới."
            });
        }

        if (await HasRoomConflictAsync(
                phongHoc.MaPhongHoc,
                targetDate,
                khungGio.GioBatDau,
                khungGio.GioKetThuc,
                buoiHoc.MaBuoiHoc))
        {
            conflicts.Add(new
            {
                type = "Room",
                message = "Phòng học đã có lịch ở khung giờ mới."
            });
        }

        if (await HasStudentSessionConflictAsync(
                studentIds,
                targetDate,
                khungGio.GioBatDau,
                khungGio.GioKetThuc,
                buoiHoc.MaBuoiHoc))
        {
            conflicts.Add(new
            {
                type = "Student",
                message = "Một số học sinh của lớp bị trùng lịch với lớp khác."
            });
        }

        if (conflicts.Any())
        {
            return (false, new
            {
                message = "Không thể đổi lịch do phát sinh xung đột.",
                conflicts
            }, StatusCodes.Status409Conflict);
        }

        buoiHoc.NgayHoc = targetDate;
        buoiHoc.GioBatDau = khungGio.GioBatDau;
        buoiHoc.GioKetThuc = khungGio.GioKetThuc;

        if (chiTietXepLich != null)
        {
            chiTietXepLich.MaPhongHoc = phongHoc.MaPhongHoc;
            chiTietXepLich.MaKhungGio = khungGio.MaKhungGio;
        }

        request.TrangThai = "Da_Duyet";
        request.MaNguoiXuLy = processorId.Value;
        request.NgayXuLy = DateTime.Now;
        request.GhiChuXuLy = dto.GhiChuXuLy;
        request.MaPhongHocDeXuat = phongHoc.MaPhongHoc;

        await _context.SaveChangesAsync();

        return (true, new
        {
            message = "Đã cập nhật lịch dạy theo yêu cầu.",
            requestId = request.MaYeuCau,
            trangThai = request.TrangThai,
            session = new
            {
                maBuoiHoc = buoiHoc.MaBuoiHoc,
                maLop = buoiHoc.MaLop,
                ngayHoc = buoiHoc.NgayHoc.ToString("yyyy-MM-dd"),
                gioBatDau = buoiHoc.GioBatDau.ToString("HH\\:mm"),
                gioKetThuc = buoiHoc.GioKetThuc.ToString("HH\\:mm"),
                maPhongHoc = phongHoc.MaPhongHoc,
                tenPhong = phongHoc.TenPhong,
                maKhungGio = khungGio.MaKhungGio,
                tenKhungGio = khungGio.TenKhungGio
            }
        }, StatusCodes.Status200OK);
    }

    private async Task<List<(int Thu, int MaKhungGio, int? MaPhongHoc, KhungGioHoc KhungGio)>> ResolveAutoPatternsAsync(
        LopHoc lopHoc,
        ScheduleAutoCreateDto dto)
    {
        var patterns = new List<(int Thu, int MaKhungGio, int? MaPhongHoc, KhungGioHoc KhungGio)>();

        if (dto.MauXepLich != null && dto.MauXepLich.Count > 0)
        {
            var slotIds = dto.MauXepLich.Select(m => m.MaKhungGio).Distinct().ToList();
            var slots = await _context.KhungGioHocs
                .Where(k => slotIds.Contains(k.MaKhungGio) && k.TrangThai == "Hoat_Dong")
                .ToDictionaryAsync(k => k.MaKhungGio);

            foreach (var item in dto.MauXepLich)
            {
                if (slots.TryGetValue(item.MaKhungGio, out var khungGio))
                {
                    patterns.Add((item.Thu, item.MaKhungGio, item.MaPhongHoc, khungGio));
                }
            }

            return patterns;
        }

        if (!dto.SuDungLichDayMacDinh)
        {
            return patterns;
        }

        var availableSlots = await _context.KhungGioHocs
            .Where(k => k.TrangThai == "Hoat_Dong")
            .ToListAsync();

        foreach (var lich in lopHoc.LichDays)
        {
            if (!lich.Thu.HasValue || !lich.GioBatDau.HasValue || !lich.GioKetThuc.HasValue)
            {
                continue;
            }

            var matchedSlot = availableSlots.FirstOrDefault(k =>
                k.GioBatDau == lich.GioBatDau.Value && k.GioKetThuc == lich.GioKetThuc.Value);

            if (matchedSlot == null)
            {
                continue;
            }

            patterns.Add((lich.Thu.Value, matchedSlot.MaKhungGio, null, matchedSlot));
        }

        if (patterns.Count > 0)
        {
            return patterns;
        }

        foreach (var lich in ClassScheduleParser.Parse(lopHoc.LichHoc))
        {
            var matchedSlot = availableSlots.FirstOrDefault(k =>
                k.GioBatDau == lich.GioBatDau && k.GioKetThuc == lich.GioKetThuc);

            if (matchedSlot == null)
            {
                continue;
            }

            patterns.Add((lich.Thu, matchedSlot.MaKhungGio, null, matchedSlot));
        }

        return patterns;
    }

    private IEnumerable<(DateOnly NgayHoc, (int Thu, int MaKhungGio, int? MaPhongHoc, KhungGioHoc KhungGio) Pattern)> BuildTargetDates(
        DateOnly from,
        DateOnly to,
        List<(int Thu, int MaKhungGio, int? MaPhongHoc, KhungGioHoc KhungGio)> patterns)
    {
        for (var day = from; day <= to; day = day.AddDays(1))
        {
            var legacyThu = ToLegacyDayOfWeek(day.DayOfWeek);
            foreach (var pattern in patterns.Where(p => p.Thu == legacyThu))
            {
                yield return (day, pattern);
            }
        }
    }

    private async Task<List<int>> GetStudentIdsOfClassAsync(int maLop)
    {
        return await _context.HocSinhLopHocs
            .Where(h => h.MaLop == maLop && h.TrangThai == "Dang_Hoc")
            .Select(h => h.MaHocSinh)
            .ToListAsync();
    }

    private async Task<List<PhongHoc>> GetCandidateRoomsAsync(int studentCount, List<int>? preferredRoomIds)
    {
        var query = _context.PhongHocs
            .Where(p => p.TrangThai == "Hoat_Dong" && p.SucChua >= studentCount);

        if (preferredRoomIds != null && preferredRoomIds.Count > 0)
        {
            query = query.Where(p => preferredRoomIds.Contains(p.MaPhongHoc));
        }

        return await query
            .OrderBy(p => p.SucChua)
            .ThenBy(p => p.TenPhong)
            .ToListAsync();
    }

    private async Task<bool> HasTeacherConflictAsync(
        int maGiaoVien,
        DateOnly ngayHoc,
        TimeOnly gioBatDau,
        TimeOnly gioKetThuc,
        int? ignoreBuoiHocId = null)
    {
        return await _context.BuoiHocs.AnyAsync(b =>
            b.MaGiaoVien == maGiaoVien &&
            b.NgayHoc == ngayHoc &&
            (!ignoreBuoiHocId.HasValue || b.MaBuoiHoc != ignoreBuoiHocId.Value) &&
            IsOverlap(b.GioBatDau, b.GioKetThuc, gioBatDau, gioKetThuc));
    }

    private async Task<bool> HasRoomConflictAsync(
        int maPhongHoc,
        DateOnly ngayHoc,
        TimeOnly gioBatDau,
        TimeOnly gioKetThuc,
        int? ignoreBuoiHocId = null)
    {
        var existingSessions = await _context.ChiTietXepLiches
            .Where(c => c.MaPhongHoc == maPhongHoc && c.TrangThai == "Hoat_Dong")
            .Select(c => new
            {
                c.MaBuoiHoc,
                c.MaBuoiHocNavigation.NgayHoc,
                c.MaBuoiHocNavigation.GioBatDau,
                c.MaBuoiHocNavigation.GioKetThuc
            })
            .ToListAsync();

        return existingSessions.Any(b =>
            b.NgayHoc == ngayHoc &&
            (!ignoreBuoiHocId.HasValue || b.MaBuoiHoc != ignoreBuoiHocId.Value) &&
            IsOverlap(b.GioBatDau, b.GioKetThuc, gioBatDau, gioKetThuc));
    }

    private async Task<bool> HasStudentSessionConflictAsync(
        List<int> studentIds,
        DateOnly ngayHoc,
        TimeOnly gioBatDau,
        TimeOnly gioKetThuc,
        int? ignoreBuoiHocId = null)
    {
        if (studentIds.Count == 0)
        {
            return false;
        }

        var candidateClassIds = await _context.HocSinhLopHocs
            .Where(h => studentIds.Contains(h.MaHocSinh))
            .Select(h => h.MaLop)
            .Distinct()
            .ToListAsync();

        return await _context.BuoiHocs.AnyAsync(b =>
            candidateClassIds.Contains(b.MaLop) &&
            b.NgayHoc == ngayHoc &&
            (!ignoreBuoiHocId.HasValue || b.MaBuoiHoc != ignoreBuoiHocId.Value) &&
            IsOverlap(b.GioBatDau, b.GioKetThuc, gioBatDau, gioKetThuc));
    }

    private async Task<List<object>> GetConflictsAsync(
        int maLop,
        int maGiaoVien,
        int? maPhongHoc,
        DateOnly ngayHoc,
        TimeOnly gioBatDau,
        TimeOnly gioKetThuc,
        List<int> studentIds)
    {
        var conflicts = new List<object>();

        if (await HasTeacherConflictAsync(maGiaoVien, ngayHoc, gioBatDau, gioKetThuc))
        {
            conflicts.Add(new
            {
                type = "Teacher",
                message = "Giáo viên đã có lịch ở khung giờ này."
            });
        }

        if (maPhongHoc.HasValue && await HasRoomConflictAsync(maPhongHoc.Value, ngayHoc, gioBatDau, gioKetThuc))
        {
            conflicts.Add(new
            {
                type = "Room",
                message = "Phòng học đã có lịch ở khung giờ này."
            });
        }

        if (await HasStudentSessionConflictAsync(studentIds, ngayHoc, gioBatDau, gioKetThuc))
        {
            conflicts.Add(new
            {
                type = "Student",
                message = "Có học sinh của lớp bị trùng lịch với lớp khác."
            });
        }

        return conflicts;
    }

    private static bool IsOverlap(TimeOnly existingStart, TimeOnly existingEnd, TimeOnly targetStart, TimeOnly targetEnd)
    {
        return existingStart < targetEnd && targetStart < existingEnd;
    }

    private static int ToLegacyDayOfWeek(DayOfWeek dayOfWeek)
    {
        return dayOfWeek == DayOfWeek.Sunday ? 1 : (int)dayOfWeek + 1;
    }

    private static int? GetCurrentUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirstValue("userId")
            ?? user.FindFirstValue(ClaimTypes.NameIdentifier);

        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
