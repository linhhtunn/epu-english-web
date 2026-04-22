import React, { useEffect, useMemo, useState } from "react";
import ScheduleNavigator from "../../components/ScheduleNavigator";
import ScheduleTable from "../../components/ScheduleTable";
import { useAuth } from "../../context/AuthContext";
import { teacherService } from "../../services/teacherService";
import { getWeekRange } from "../../utils/schedule";

const TeacherSchedule = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [classes, setClasses] = useState([]);
    const [requests, setRequests] = useState([]);
    const [slotOptions, setSlotOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [form, setForm] = useState({
        maBuoiHoc: "",
        ngayDeXuatMoi: "",
        maKhungGioDeXuat: "",
        lyDo: "",
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const { fromDate, toDate } = getWeekRange(currentDate);
            const [scheduleData, optionsData, requestData] = await Promise.all([
                teacherService.getSchedule(fromDate, toDate),
                teacherService.getRescheduleOptions(),
                teacherService.getRescheduleRequests(),
            ]);

            setClasses(scheduleData);
            setSlotOptions(optionsData.khungGios || []);
            setRequests(requestData || []);
        } catch (err) {
            console.error("Lỗi khi tải lịch dạy:", err);
            setClasses([]);
            setSlotOptions([]);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Lịch dạy | EPU English";
        loadData();
    }, [currentDate]);

    const stats = useMemo(() => {
        const totalHours = classes.reduce((sum, item) => {
            const [startRaw, endRaw] = String(item.time || "").split(" - ");
            if (!startRaw || !endRaw) {
                return sum;
            }

            const [startHour, startMinute] = startRaw.split(":").map(Number);
            const [endHour, endMinute] = endRaw.split(":").map(Number);
            const start = startHour * 60 + startMinute;
            const end = endHour * 60 + endMinute;

            return sum + Math.max(end - start, 0) / 60;
        }, 0);

        return [
            {
                label: "Buổi dạy trong tuần",
                value: classes.length,
                icon: "bi-easel2",
                tone: "#0d6efd",
                surface: "#eef4ff",
            },
            {
                label: "Tổng giờ đứng lớp",
                value: totalHours.toFixed(totalHours % 1 === 0 ? 0 : 1),
                icon: "bi-clock-history",
                tone: "#6f42c1",
                surface: "#f5f0ff",
            },
            {
                label: "Yêu cầu chờ duyệt",
                value: requests.filter((item) => item.trangThai === "Cho_Duyet").length,
                icon: "bi-arrow-repeat",
                tone: "#198754",
                surface: "#eefbf3",
            },
        ];
    }, [classes, requests]);

    const availableSessions = useMemo(() => {
        return classes.filter((item) => !item.hasPendingRequest);
    }, [classes]);

    const moveWeek = (amount) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + amount * 7);
        setCurrentDate(nextDate);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback(null);
        setSubmitting(true);

        try {
            const payload = {
                maBuoiHoc: Number(form.maBuoiHoc),
                ngayDeXuatMoi: form.ngayDeXuatMoi,
                maKhungGioDeXuat: Number(form.maKhungGioDeXuat),
                lyDo: form.lyDo.trim() || null,
            };

            const response = await teacherService.createRescheduleRequest(payload);
            setFeedback({ type: "success", message: response.message || "Đã gửi yêu cầu đổi lịch." });
            setForm({
                maBuoiHoc: "",
                ngayDeXuatMoi: "",
                maKhungGioDeXuat: "",
                lyDo: "",
            });
            await loadData();
        } catch (err) {
            const message = err?.response?.data?.message || "Không gửi được yêu cầu đổi lịch.";
            setFeedback({ type: "danger", message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 animate__animated animate__fadeIn">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <div className="text-uppercase text-muted fw-semibold small mb-1">
                        Lịch dạy cá nhân
                    </div>
                    <h2 className="fw-bold text-dark mb-1">Điều phối lịch đứng lớp</h2>
                    <p className="text-muted mb-0">
                        Theo dõi từng buổi dạy trong tuần của{" "}
                        <span className="fw-semibold text-dark">
                            {user?.fullName || "giảng viên"}
                        </span>
                        .
                    </p>
                </div>

                <div className="badge text-bg-light border rounded-pill px-3 py-2">
                    Mã hồ sơ: {user?.profileId || user?.username || "N/A"}
                </div>
            </div>

            <div className="row g-3 mb-4">
                {stats.map((item) => (
                    <div key={item.label} className="col-md-4">
                        <div
                            className="rounded-4 border h-100 p-4 shadow-sm"
                            style={{ backgroundColor: item.surface }}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="text-muted small fw-semibold mb-2">
                                        {item.label}
                                    </div>
                                    <div className="display-6 fw-bold text-dark mb-0">
                                        {item.value}
                                    </div>
                                </div>
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "46px",
                                        height: "46px",
                                        color: item.tone,
                                        backgroundColor: "#ffffff",
                                    }}
                                >
                                    <i className={`bi ${item.icon} fs-4`} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <ScheduleNavigator
                    currentDate={currentDate}
                    onToday={() => setCurrentDate(new Date())}
                    onPrev={() => moveWeek(-1)}
                    onNext={() => moveWeek(1)}
                    accent="#198754"
                />
            </div>

            {loading ? (
                <div className="rounded-4 border bg-white shadow-sm d-flex justify-content-center py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <ScheduleTable data={classes} currentViewDate={currentDate} />
            )}

            <div className="row g-4 mt-1">
                <div className="col-xl-6">
                    <div className="rounded-4 border bg-white shadow-sm p-4 h-100">
                        <div className="text-uppercase text-muted fw-semibold small mb-1">
                            Yêu cầu đổi lịch
                        </div>
                        <h5 className="fw-bold text-dark mb-3">Gửi đề xuất cho admin</h5>

                        {feedback && (
                            <div className={`alert alert-${feedback.type}`} role="alert">
                                {feedback.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label fw-semibold">Chọn buổi cần đổi</label>
                                <select
                                    className="form-select"
                                    value={form.maBuoiHoc}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, maBuoiHoc: event.target.value }))
                                    }
                                    required
                                >
                                    <option value="">Chọn buổi học</option>
                                    {availableSessions.map((item) => (
                                        <option key={item.maBuoiHoc} value={item.maBuoiHoc}>
                                            {item.code} | {item.date} | {item.time}
                                        </option>
                                    ))}
                                </select>
                                {availableSessions.length === 0 && (
                                    <div className="small text-muted mt-2">
                                        Tất cả buổi trong tuần đang có yêu cầu chờ duyệt hoặc chưa có lịch.
                                    </div>
                                )}
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Ngày muốn đổi</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.ngayDeXuatMoi}
                                        onChange={(event) =>
                                            setForm((prev) => ({ ...prev, ngayDeXuatMoi: event.target.value }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Tiết / khung giờ</label>
                                    <select
                                        className="form-select"
                                        value={form.maKhungGioDeXuat}
                                        onChange={(event) =>
                                            setForm((prev) => ({ ...prev, maKhungGioDeXuat: event.target.value }))
                                        }
                                        required
                                    >
                                        <option value="">Chọn khung giờ</option>
                                        {slotOptions.map((slot) => (
                                            <option key={slot.maKhungGio} value={slot.maKhungGio}>
                                                {slot.tenKhungGio} | {slot.gioBatDau} - {slot.gioKetThuc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="form-label fw-semibold">Lý do</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={form.lyDo}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, lyDo: event.target.value }))
                                    }
                                    placeholder="Ví dụ: trùng lịch công tác, xin chuyển sang ca tối..."
                                />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-success px-4"
                                    disabled={
                                        submitting ||
                                        !form.maBuoiHoc ||
                                        !form.ngayDeXuatMoi ||
                                        !form.maKhungGioDeXuat
                                    }
                                >
                                    {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-xl-6">
                    <div className="rounded-4 border bg-white shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <div className="text-uppercase text-muted fw-semibold small mb-1">
                                    Danh sách yêu cầu
                                </div>
                                <h5 className="fw-bold text-dark mb-0">Theo dõi trạng thái xử lý</h5>
                            </div>
                            <span className="badge text-bg-light border rounded-pill">
                                {requests.length}
                            </span>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            {requests.length === 0 && (
                                <div className="rounded-4 border bg-light-subtle p-4 text-muted">
                                    Bạn chưa gửi yêu cầu đổi lịch nào.
                                </div>
                            )}

                            {requests.map((item) => (
                                <div key={item.id} className="rounded-4 border p-3">
                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                        <div>
                                            <div className="fw-bold text-dark">{item.classCode}</div>
                                            <div className="small text-muted">
                                                Hiện tại: {item.currentDate} | {item.currentTime}
                                            </div>
                                            <div className="small text-muted">
                                                Đề xuất: {item.requestedDate} | {item.requestedSlotLabel} ({item.requestedSlotTime})
                                            </div>
                                        </div>
                                        <span
                                            className={`badge rounded-pill px-3 py-2 ${
                                                item.trangThai === "Da_Duyet"
                                                    ? "text-bg-success"
                                                    : item.trangThai === "Tu_Choi"
                                                      ? "text-bg-danger"
                                                      : "text-bg-warning"
                                            }`}
                                        >
                                            {item.trangThai}
                                        </span>
                                    </div>

                                    {item.lyDo && (
                                        <div className="small text-dark mt-2">
                                            <span className="fw-semibold">Lý do:</span> {item.lyDo}
                                        </div>
                                    )}

                                    {item.ghiChuXuLy && (
                                        <div className="small text-dark mt-2">
                                            <span className="fw-semibold">Phản hồi admin:</span> {item.ghiChuXuLy}
                                        </div>
                                    )}

                                    <div className="small text-muted mt-2">Gửi lúc {item.ngayTao}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-4 border-start border-4 border-success bg-white p-4 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-info-circle-fill text-success" />
                    <span className="text-uppercase text-muted fw-semibold small">
                        Nhắc việc
                    </span>
                </div>
                <p className="text-muted mb-0">
                    Vui lòng thực hiện điểm danh trong 15 phút đầu của mỗi buổi để dữ liệu chuyên cần đồng bộ chính xác với hệ thống.
                </p>
            </div>
        </div>
    );
};

export default TeacherSchedule;
