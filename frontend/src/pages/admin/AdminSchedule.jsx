import React, { useEffect, useMemo, useState } from "react";
import ScheduleNavigator from "../../components/ScheduleNavigator";
import { adminService } from "../../services/adminService";
import { getWeekDays, getWeekRange } from "../../utils/schedule";

const TIME_SLOTS = [
    { id: 1, name: "Ca 1", time: "07:30 - 09:30", tone: "#0d6efd" },
    { id: 2, name: "Ca 2", time: "09:45 - 11:45", tone: "#2563eb" },
    { id: 3, name: "Ca 3", time: "13:30 - 15:30", tone: "#7c3aed" },
    { id: 4, name: "Ca 4", time: "15:45 - 17:45", tone: "#9333ea" },
    { id: 5, name: "Ca 5", time: "18:00 - 20:00", tone: "#ea580c" },
    { id: 6, name: "Ca 6", time: "20:15 - 22:15", tone: "#dc2626" },
];

const initialManualForm = {
    maLop: "",
    ngayHoc: "",
    maKhungGio: "",
    maPhongHoc: "",
    ghiChu: "",
};

const initialAutoForm = {
    maLop: "",
    tuNgay: "",
    denNgay: "",
    soBuoiToiDa: "",
    ghiChu: "",
};

const AdminSchedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [manualSubmitting, setManualSubmitting] = useState(false);
    const [autoSubmitting, setAutoSubmitting] = useState(false);
    const [scheduledClasses, setScheduledClasses] = useState([]);
    const [rescheduleRequests, setRescheduleRequests] = useState([]);
    const [selectedBoardItem, setSelectedBoardItem] = useState(null);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [scheduleOptions, setScheduleOptions] = useState({
        lopHocs: [],
        phongHocs: [],
        khungGios: [],
    });
    const [availability, setAvailability] = useState(null);
    const [manualAvailability, setManualAvailability] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [manualFeedback, setManualFeedback] = useState(null);
    const [autoFeedback, setAutoFeedback] = useState(null);
    const [form, setForm] = useState({
        ngayHocMoi: "",
        maKhungGio: "",
        maPhongHoc: "",
        ghiChuXuLy: "",
    });
    const [manualForm, setManualForm] = useState(initialManualForm);
    const [autoForm, setAutoForm] = useState(initialAutoForm);

    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

    const selectedRequest = useMemo(
        () => rescheduleRequests.find((item) => item.id === selectedRequestId) || null,
        [rescheduleRequests, selectedRequestId],
    );

    const selectedClassOption = useMemo(
        () =>
            (scheduleOptions.lopHocs || []).find(
                (item) => item.maLop === Number(manualForm.maLop || autoForm.maLop),
            ) || null,
        [scheduleOptions.lopHocs, manualForm.maLop, autoForm.maLop],
    );

    const manualSelectedClass = useMemo(
        () =>
            (scheduleOptions.lopHocs || []).find(
                (item) => item.maLop === Number(manualForm.maLop),
            ) || null,
        [scheduleOptions.lopHocs, manualForm.maLop],
    );

    const loadSchedule = async () => {
        try {
            setLoading(true);
            const { fromDate, toDate } = getWeekRange(currentDate);
            const data = await adminService.getSchedule(fromDate, toDate);
            const sessions = data.scheduledClasses || [];
            const requests = data.rescheduleRequests || [];

            setScheduledClasses(sessions);
            setRescheduleRequests(requests);
            setSelectedBoardItem((previous) => {
                if (!previous) {
                    return sessions[0] ?? null;
                }

                if (previous.emptySlot) {
                    return previous;
                }

                return sessions.find((item) => item.id === previous.id) ?? sessions[0] ?? null;
            });
            setSelectedRequestId((previous) => {
                if (requests.length === 0) {
                    return null;
                }
                return requests.some((item) => item.id === previous) ? previous : requests[0].id;
            });
        } catch (err) {
            console.error("Lỗi tải lịch admin:", err);
            setScheduledClasses([]);
            setRescheduleRequests([]);
            setSelectedBoardItem(null);
            setSelectedRequestId(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Điều phối lịch | EPU English";

        const loadPage = async () => {
            await Promise.all([
                loadSchedule(),
                adminService
                    .getScheduleOptions()
                    .then((data) => setScheduleOptions(data))
                    .catch((err) => {
                        console.error("Lỗi tải option lịch:", err);
                        setScheduleOptions({ lopHocs: [], phongHocs: [], khungGios: [] });
                    }),
            ]);
        };

        loadPage();
    }, [currentDate]);

    useEffect(() => {
        if (!selectedRequest) {
            setForm({
                ngayHocMoi: "",
                maKhungGio: "",
                maPhongHoc: "",
                ghiChuXuLy: "",
            });
            setAvailability(null);
            return;
        }

        setForm({
            ngayHocMoi: selectedRequest.requestedDate || "",
            maKhungGio: selectedRequest.requestedSlotId ? String(selectedRequest.requestedSlotId) : "",
            maPhongHoc: selectedRequest.requestedRoomId ? String(selectedRequest.requestedRoomId) : "",
            ghiChuXuLy: "",
        });
    }, [selectedRequest]);

    useEffect(() => {
        if (!selectedRequest || !form.ngayHocMoi) {
            setAvailability(null);
            return;
        }

        const fetchAvailability = async () => {
            try {
                const data = await adminService.getAvailability(
                    selectedRequest.maLop,
                    form.ngayHocMoi,
                    selectedRequest.maGiaoVien,
                );
                setAvailability(data);
            } catch (err) {
                console.error("Lỗi tải lịch trống:", err);
                setAvailability(null);
            }
        };

        fetchAvailability();
    }, [selectedRequest, form.ngayHocMoi]);

    useEffect(() => {
        if (!manualForm.maLop || !manualForm.ngayHoc) {
            setManualAvailability(null);
            return;
        }

        const fetchManualAvailability = async () => {
            try {
                const data = await adminService.getAvailability(
                    Number(manualForm.maLop),
                    manualForm.ngayHoc,
                    manualSelectedClass?.maGiaoVien || null,
                );
                setManualAvailability(data);
            } catch (err) {
                console.error("Lỗi tải lịch trống thủ công:", err);
                setManualAvailability(null);
            }
        };

        fetchManualAvailability();
    }, [manualForm.maLop, manualForm.ngayHoc, manualSelectedClass?.maGiaoVien]);

    const boardStats = useMemo(() => {
        const occupiedSlots = scheduledClasses.length;
        const totalSlots = weekDays.length * TIME_SLOTS.length;
        const teachers = new Set(scheduledClasses.map((item) => item.teacher)).size;

        return [
            {
                label: "Buổi đã xếp",
                value: occupiedSlots,
                icon: "bi-calendar-check",
                surface: "#eef4ff",
                tone: "#0d6efd",
            },
            {
                label: "Tỷ lệ kín lịch",
                value: `${totalSlots === 0 ? 0 : Math.round((occupiedSlots / totalSlots) * 100)}%`,
                icon: "bi-grid-1x2",
                surface: "#eefbf3",
                tone: "#198754",
            },
            {
                label: "Giảng viên trong tuần",
                value: teachers,
                icon: "bi-people",
                surface: "#fff4e8",
                tone: "#fd7e14",
            },
            {
                label: "Yêu cầu chờ duyệt",
                value: rescheduleRequests.length,
                icon: "bi-arrow-repeat",
                surface: "#f5f0ff",
                tone: "#6f42c1",
            },
        ];
    }, [scheduledClasses, rescheduleRequests.length, weekDays.length]);

    const highlightItems = useMemo(() => scheduledClasses.slice(0, 5), [scheduledClasses]);

    const selectedAvailabilitySlot = useMemo(() => {
        if (!availability || !form.maKhungGio) {
            return null;
        }

        return (availability.lichTrong || []).find(
            (item) => item.maKhungGio === Number(form.maKhungGio),
        ) || null;
    }, [availability, form.maKhungGio]);

    const availableRooms = useMemo(
        () => (selectedAvailabilitySlot?.phongHoc || []).filter((item) => item.khaDung),
        [selectedAvailabilitySlot],
    );

    const manualSelectedSlot = useMemo(() => {
        if (!manualAvailability || !manualForm.maKhungGio) {
            return null;
        }

        return (manualAvailability.lichTrong || []).find(
            (item) => item.maKhungGio === Number(manualForm.maKhungGio),
        ) || null;
    }, [manualAvailability, manualForm.maKhungGio]);

    const manualAvailableRooms = useMemo(
        () => (manualSelectedSlot?.phongHoc || []).filter((item) => item.khaDung),
        [manualSelectedSlot],
    );

    const handleMoveWeek = (amount) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + amount * 7);
        setCurrentDate(nextDate);
    };

    const renderCell = (day, slot) => {
        const sessions = scheduledClasses.filter(
            (item) => item.dayIdx === day.index && item.slotId === slot.id,
        );

        if (sessions.length === 0) {
            return (
                <button
                    type="button"
                    className="w-100 rounded-4 border border-dashed bg-light-subtle text-start p-3 h-100"
                    style={{ minHeight: "128px" }}
                    onClick={() =>
                        setSelectedBoardItem({
                            emptySlot: true,
                            dayLabel: `${day.label} ${day.dateNumber}/${day.monthNumber}`,
                            slotName: slot.name,
                            slotTime: slot.time,
                        })
                    }
                >
                    <div className="small text-muted fw-semibold mb-2">Ô trống</div>
                    <div className="fw-bold text-dark mb-1">Chưa có buổi học</div>
                    <div className="small text-muted">
                        Có thể dùng khung này để xếp thêm lịch.
                    </div>
                </button>
            );
        }

        return (
            <div className="d-flex flex-column gap-2 h-100">
                {sessions.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`w-100 text-start rounded-4 border p-3 shadow-sm ${
                            selectedBoardItem?.id === item.id ? "border-primary" : ""
                        }`}
                        onClick={() => setSelectedBoardItem(item)}
                        style={{
                            backgroundColor: "#ffffff",
                            borderLeft: `5px solid ${slot.tone}`,
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <div>
                                <div className="fw-bold text-dark">{item.classCode}</div>
                                <div className="small text-muted">{item.teacher}</div>
                            </div>
                            <span className="badge text-bg-light border rounded-pill px-3 py-2">
                                {item.room}
                            </span>
                        </div>

                        <div className="small text-muted d-flex align-items-center gap-2">
                            <i className="bi bi-clock" />
                            {slot.time}
                        </div>
                    </button>
                ))}
            </div>
        );
    };

    const handleProcess = async (status) => {
        if (!selectedRequest) {
            return;
        }

        setFeedback(null);
        setProcessing(true);

        try {
            const payload =
                status === "Da_Duyet"
                    ? {
                          trangThai: status,
                          ngayHocMoi: form.ngayHocMoi,
                          maKhungGio: Number(form.maKhungGio),
                          maPhongHoc: Number(form.maPhongHoc),
                          ghiChuXuLy: form.ghiChuXuLy.trim() || null,
                      }
                    : {
                          trangThai: status,
                          ghiChuXuLy: form.ghiChuXuLy.trim() || null,
                      };

            const response = await adminService.processRescheduleRequest(selectedRequest.id, payload);
            setFeedback({ type: "success", message: response.message || "Đã xử lý yêu cầu." });
            await loadSchedule();
        } catch (err) {
            const message = err?.response?.data?.message || "Không xử lý được yêu cầu đổi lịch.";
            setFeedback({ type: "danger", message });
        } finally {
            setProcessing(false);
        }
    };

    const handleCreateManualSchedule = async (event) => {
        event.preventDefault();
        setManualFeedback(null);
        setManualSubmitting(true);

        try {
            const response = await adminService.createManualSchedule({
                maLop: Number(manualForm.maLop),
                ngayHoc: manualForm.ngayHoc,
                maKhungGio: Number(manualForm.maKhungGio),
                maPhongHoc: Number(manualForm.maPhongHoc),
                ghiChu: manualForm.ghiChu.trim() || null,
            });

            setManualFeedback({
                type: "success",
                message: response.message || "Đã tạo lịch thủ công.",
            });
            setManualForm(initialManualForm);
            setManualAvailability(null);
            await loadSchedule();
        } catch (err) {
            const message = err?.response?.data?.message || "Không tạo được lịch thủ công.";
            setManualFeedback({ type: "danger", message });
        } finally {
            setManualSubmitting(false);
        }
    };

    const handleCreateAutoSchedule = async (event) => {
        event.preventDefault();
        setAutoFeedback(null);
        setAutoSubmitting(true);

        try {
            const response = await adminService.createAutoSchedule({
                maLop: Number(autoForm.maLop),
                tuNgay: autoForm.tuNgay,
                denNgay: autoForm.denNgay,
                soBuoiToiDa: autoForm.soBuoiToiDa ? Number(autoForm.soBuoiToiDa) : null,
                suDungLichDayMacDinh: true,
                ghiChu: autoForm.ghiChu.trim() || null,
            });

            setAutoFeedback({
                type: "success",
                message: response.message || "Đã lên lịch tự động.",
            });
            setAutoForm(initialAutoForm);
            await loadSchedule();
        } catch (err) {
            const message = err?.response?.data?.message || "Không lên lịch tự động được.";
            setAutoFeedback({ type: "danger", message });
        } finally {
            setAutoSubmitting(false);
        }
    };

    return (
        <div className="p-4 animate__animated animate__fadeIn">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <div className="text-uppercase text-muted fw-semibold small mb-1">
                        Bảng lập lịch
                    </div>
                    <h2 className="fw-bold text-dark mb-1">Điều phối lịch dạy và học</h2>
                    <p className="text-muted mb-0">
                        Sinh viên trong lớp sẽ xem lịch trực tiếp từ buổi học đã xếp, nên khi admin đổi lịch thì lịch của giảng viên và sinh viên cùng cập nhật.
                    </p>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {boardStats.map((item) => (
                    <div key={item.label} className="col-md-6 col-xl-3">
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

            <div className="row g-4 mb-4">
                <div className="col-xl-6">
                    <div className="rounded-4 border bg-white shadow-sm p-4 h-100">
                        <div className="text-uppercase text-muted fw-semibold small mb-1">
                            Lên lịch thủ công
                        </div>
                        <h5 className="fw-bold text-dark mb-3">Admin tự chọn lớp, ngày, ca và phòng</h5>

                        {manualFeedback && (
                            <div className={`alert alert-${manualFeedback.type}`} role="alert">
                                {manualFeedback.message}
                            </div>
                        )}

                        <form onSubmit={handleCreateManualSchedule} className="d-flex flex-column gap-3">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Lớp học</label>
                                    <select
                                        className="form-select"
                                        value={manualForm.maLop}
                                        onChange={(event) =>
                                            setManualForm((prev) => ({
                                                ...prev,
                                                maLop: event.target.value,
                                                maKhungGio: "",
                                                maPhongHoc: "",
                                            }))
                                        }
                                        required
                                    >
                                        <option value="">Chọn lớp</option>
                                        {(scheduleOptions.lopHocs || []).map((item) => (
                                            <option key={item.maLop} value={item.maLop}>
                                                {item.maLopHienThi} | {item.tenKhoaHoc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Ngày học</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={manualForm.ngayHoc}
                                        onChange={(event) =>
                                            setManualForm((prev) => ({
                                                ...prev,
                                                ngayHoc: event.target.value,
                                                maKhungGio: "",
                                                maPhongHoc: "",
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Khung giờ</label>
                                    <select
                                        className="form-select"
                                        value={manualForm.maKhungGio}
                                        onChange={(event) =>
                                            setManualForm((prev) => ({
                                                ...prev,
                                                maKhungGio: event.target.value,
                                                maPhongHoc: "",
                                            }))
                                        }
                                        required
                                    >
                                        <option value="">Chọn khung giờ</option>
                                        {(manualAvailability?.lichTrong || []).map((slot) => (
                                            <option
                                                key={slot.maKhungGio}
                                                value={slot.maKhungGio}
                                                disabled={!slot.khaDung}
                                            >
                                                {slot.tenKhungGio} | {slot.gioBatDau} - {slot.gioKetThuc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Phòng học</label>
                                    <select
                                        className="form-select"
                                        value={manualForm.maPhongHoc}
                                        onChange={(event) =>
                                            setManualForm((prev) => ({
                                                ...prev,
                                                maPhongHoc: event.target.value,
                                            }))
                                        }
                                        required
                                    >
                                        <option value="">Chọn phòng</option>
                                        {manualAvailableRooms.map((room) => (
                                            <option key={room.maPhongHoc} value={room.maPhongHoc}>
                                                {room.tenPhong} | sức chứa {room.sucChua}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="form-label fw-semibold">Ghi chú</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={manualForm.ghiChu}
                                    onChange={(event) =>
                                        setManualForm((prev) => ({
                                            ...prev,
                                            ghiChu: event.target.value,
                                        }))
                                    }
                                    placeholder="Ví dụ: lớp bù, điều chỉnh lịch tháng 5..."
                                />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={
                                        manualSubmitting ||
                                        !manualForm.maLop ||
                                        !manualForm.ngayHoc ||
                                        !manualForm.maKhungGio ||
                                        !manualForm.maPhongHoc
                                    }
                                >
                                    {manualSubmitting ? "Đang tạo..." : "Thêm lịch thủ công"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-xl-6">
                    <div className="rounded-4 border bg-white shadow-sm p-4 h-100">
                        <div className="text-uppercase text-muted fw-semibold small mb-1">
                            Lên lịch tự động
                        </div>
                        <h5 className="fw-bold text-dark mb-3">Admin nhấn là hệ thống tự sinh buổi học theo `lichDay`</h5>

                        {autoFeedback && (
                            <div className={`alert alert-${autoFeedback.type}`} role="alert">
                                {autoFeedback.message}
                            </div>
                        )}

                        <form onSubmit={handleCreateAutoSchedule} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label fw-semibold">Lớp học</label>
                                <select
                                    className="form-select"
                                    value={autoForm.maLop}
                                    onChange={(event) =>
                                        setAutoForm((prev) => ({
                                            ...prev,
                                            maLop: event.target.value,
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Chọn lớp</option>
                                    {(scheduleOptions.lopHocs || []).map((item) => (
                                        <option key={item.maLop} value={item.maLop}>
                                            {item.maLopHienThi} | {item.tenKhoaHoc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Từ ngày</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={autoForm.tuNgay}
                                        onChange={(event) =>
                                            setAutoForm((prev) => ({
                                                ...prev,
                                                tuNgay: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Đến ngày</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={autoForm.denNgay}
                                        onChange={(event) =>
                                            setAutoForm((prev) => ({
                                                ...prev,
                                                denNgay: event.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label fw-semibold">Giới hạn số buổi</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    value={autoForm.soBuoiToiDa}
                                    onChange={(event) =>
                                        setAutoForm((prev) => ({
                                            ...prev,
                                            soBuoiToiDa: event.target.value,
                                        }))
                                    }
                                    placeholder="Để trống nếu muốn xếp hết trong khoảng ngày"
                                />
                            </div>

                            <div>
                                <label className="form-label fw-semibold">Ghi chú</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={autoForm.ghiChu}
                                    onChange={(event) =>
                                        setAutoForm((prev) => ({
                                            ...prev,
                                            ghiChu: event.target.value,
                                        }))
                                    }
                                    placeholder="Ví dụ: mở lịch tháng mới theo lịch dạy mặc định"
                                />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-success px-4"
                                    disabled={
                                        autoSubmitting ||
                                        !autoForm.maLop ||
                                        !autoForm.tuNgay ||
                                        !autoForm.denNgay
                                    }
                                >
                                    {autoSubmitting ? "Đang xếp..." : "Lên lịch tự động"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <ScheduleNavigator
                    currentDate={currentDate}
                    onToday={() => setCurrentDate(new Date())}
                    onPrev={() => handleMoveWeek(-1)}
                    onNext={() => handleMoveWeek(1)}
                    accent="#111827"
                />
            </div>

            <div className="row g-4">
                <div className="col-xl-8">
                    <div className="rounded-4 border bg-white shadow-sm overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center px-4 py-4 border-bottom bg-light-subtle">
                            <div>
                                <div className="text-uppercase text-muted fw-semibold small mb-1">
                                    Ma trận lịch
                                </div>
                                <h4 className="fw-bold text-dark mb-0">
                                    Toàn bộ khung xếp lịch trong tuần
                                </h4>
                            </div>
                            <span className="badge text-bg-light border rounded-pill px-3 py-2">
                                {scheduledClasses.length} buổi đã được gán
                            </span>
                        </div>

                        {loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table
                                    className="table align-middle mb-0"
                                    style={{ minWidth: "1120px", tableLayout: "fixed" }}
                                >
                                    <thead>
                                        <tr>
                                            <th className="bg-white border-0 px-4 py-3" style={{ width: "150px" }}>
                                                <div className="text-uppercase text-muted small fw-semibold">
                                                    Ca học
                                                </div>
                                            </th>
                                            {weekDays.map((day) => (
                                                <th key={day.isoDate} className="bg-white border-0 px-3 py-3">
                                                    <div
                                                        className="rounded-4 border px-3 py-3"
                                                        style={{
                                                            backgroundColor: day.isToday ? "#eef4ff" : "#f8fafc",
                                                            borderColor: day.isToday ? "#bfdbfe" : "#e2e8f0",
                                                        }}
                                                    >
                                                        <div className="fw-bold text-dark">{day.label}</div>
                                                        <div className="small text-muted">
                                                            {day.dateNumber}/{day.monthNumber}
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TIME_SLOTS.map((slot) => (
                                            <tr key={slot.id}>
                                                <td className="px-4 py-3 bg-light-subtle border-end">
                                                    <div
                                                        className="rounded-4 p-3 text-white shadow-sm"
                                                        style={{ backgroundColor: slot.tone }}
                                                    >
                                                        <div className="fw-bold">{slot.name}</div>
                                                        <div className="small opacity-75">{slot.time}</div>
                                                    </div>
                                                </td>
                                                {weekDays.map((day) => (
                                                    <td
                                                        key={`${day.isoDate}_${slot.id}`}
                                                        className="p-3 align-top"
                                                        style={{ backgroundColor: "#fcfdff" }}
                                                    >
                                                        {renderCell(day, slot)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="d-flex flex-column gap-4">
                        <div className="rounded-4 border bg-white shadow-sm p-4">
                            <div className="text-uppercase text-muted fw-semibold small mb-1">
                                Khung đang chọn
                            </div>
                            <h5 className="fw-bold text-dark mb-3">
                                {selectedBoardItem?.emptySlot
                                    ? "Ô lịch trống"
                                    : selectedBoardItem?.classCode || "Chưa chọn buổi"}
                            </h5>

                            {!selectedBoardItem && (
                                <p className="text-muted mb-0">
                                    Chọn một ô trong bảng để xem chi tiết điều phối.
                                </p>
                            )}

                            {selectedBoardItem?.emptySlot && (
                                <div className="d-flex flex-column gap-2 small">
                                    <div>
                                        <span className="text-muted">Ngày:</span>{" "}
                                        <span className="fw-semibold text-dark">{selectedBoardItem.dayLabel}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted">Ca học:</span>{" "}
                                        <span className="fw-semibold text-dark">{selectedBoardItem.slotName}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted">Thời gian:</span>{" "}
                                        <span className="fw-semibold text-dark">{selectedBoardItem.slotTime}</span>
                                    </div>
                                </div>
                            )}

                            {selectedBoardItem && !selectedBoardItem.emptySlot && (
                                <div className="d-flex flex-column gap-3 small">
                                    <div className="rounded-4 border bg-light-subtle p-3">
                                        <div className="text-muted mb-1">Ngày học</div>
                                        <div className="fw-semibold text-dark">{selectedBoardItem.date}</div>
                                    </div>
                                    <div className="rounded-4 border bg-light-subtle p-3">
                                        <div className="text-muted mb-1">Giảng viên</div>
                                        <div className="fw-semibold text-dark">{selectedBoardItem.teacher}</div>
                                    </div>
                                    <div className="rounded-4 border bg-light-subtle p-3">
                                        <div className="text-muted mb-1">Phòng</div>
                                        <div className="fw-semibold text-dark">{selectedBoardItem.room}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="rounded-4 border bg-white shadow-sm p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <div className="text-uppercase text-muted fw-semibold small mb-1">
                                        Buổi nổi bật
                                    </div>
                                    <h6 className="fw-bold text-dark mb-0">Xem nhanh lịch đã xếp</h6>
                                </div>
                                <span className="badge text-bg-light border rounded-pill">
                                    {highlightItems.length}
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                {highlightItems.length === 0 && (
                                    <div className="text-muted small">Chưa có buổi học nào trong tuần này.</div>
                                )}

                                {highlightItems.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="btn btn-light text-start rounded-4 border px-3 py-3"
                                        onClick={() => setSelectedBoardItem(item)}
                                    >
                                        <div className="fw-bold text-dark">{item.classCode}</div>
                                        <div className="small text-muted">{item.teacher}</div>
                                        <div className="small text-muted mt-1">{item.room}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-4 border bg-dark text-white shadow-sm p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <div className="text-uppercase text-warning fw-semibold small mb-1">
                                        Yêu cầu đổi lịch
                                    </div>
                                    <h6 className="fw-bold mb-0">Xử lý hàng chờ</h6>
                                </div>
                                <span className="badge text-bg-light border rounded-pill">
                                    {rescheduleRequests.length}
                                </span>
                            </div>

                            {feedback && (
                                <div className={`alert alert-${feedback.type}`} role="alert">
                                    {feedback.message}
                                </div>
                            )}

                            {rescheduleRequests.length === 0 ? (
                                <div className="small text-white-50">
                                    Hiện chưa có yêu cầu đổi lịch nào từ giảng viên.
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex flex-column gap-2">
                                        {rescheduleRequests.map((req) => (
                                            <button
                                                key={req.id}
                                                type="button"
                                                className={`btn text-start rounded-4 border px-3 py-3 ${
                                                    req.id === selectedRequestId ? "btn-light" : "btn-outline-light"
                                                }`}
                                                onClick={() => setSelectedRequestId(req.id)}
                                            >
                                                <div className="fw-bold">{req.classCode}</div>
                                                <div className="small opacity-75">{req.teacher}</div>
                                                <div className="small opacity-75">
                                                    {`${req.currentDate} -> ${req.requestedDate}`}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {selectedRequest && (
                                        <div className="rounded-4 border border-light border-opacity-10 bg-white bg-opacity-10 p-3">
                                            <div className="fw-bold mb-2">{selectedRequest.classCode}</div>
                                            <div className="small text-white-50 mb-1">
                                                Hiện tại: {selectedRequest.currentDate} | {selectedRequest.currentTime}
                                            </div>
                                            <div className="small text-white-50 mb-3">
                                                Đề xuất: {selectedRequest.requestedDate} | {selectedRequest.requestedSlotLabel} ({selectedRequest.requestedSlotTime})
                                            </div>

                                            {selectedRequest.lyDo && (
                                                <div className="small mb-3">
                                                    <span className="fw-semibold">Lý do:</span> {selectedRequest.lyDo}
                                                </div>
                                            )}

                                            <div className="d-flex flex-column gap-3">
                                                <div>
                                                    <label className="form-label small fw-semibold text-white">
                                                        Ngày duyệt
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={form.ngayHocMoi}
                                                        onChange={(event) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                ngayHocMoi: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <label className="form-label small fw-semibold text-white">
                                                        Khung giờ
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        value={form.maKhungGio}
                                                        onChange={(event) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                maKhungGio: event.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <option value="">Chọn khung giờ</option>
                                                        {(scheduleOptions.khungGios || []).map((slot) => (
                                                            <option key={slot.maKhungGio} value={slot.maKhungGio}>
                                                                {slot.tenKhungGio} | {slot.gioBatDau} - {slot.gioKetThuc}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="form-label small fw-semibold text-white">
                                                        Phòng học
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        value={form.maPhongHoc}
                                                        onChange={(event) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                maPhongHoc: event.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <option value="">Chọn phòng học</option>
                                                        {availableRooms.map((room) => (
                                                            <option key={room.maPhongHoc} value={room.maPhongHoc}>
                                                                {room.tenPhong} | sức chứa {room.sucChua}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="form-label small fw-semibold text-white">
                                                        Ghi chú xử lý
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        value={form.ghiChuXuLy}
                                                        onChange={(event) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                ghiChuXuLy: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>

                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-success flex-fill"
                                                        onClick={() => handleProcess("Da_Duyet")}
                                                        disabled={
                                                            processing ||
                                                            !form.ngayHocMoi ||
                                                            !form.maKhungGio ||
                                                            !form.maPhongHoc
                                                        }
                                                    >
                                                        {processing ? "Đang xử lý..." : "Duyệt và đổi lịch"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-light flex-fill"
                                                        onClick={() => handleProcess("Tu_Choi")}
                                                        disabled={processing}
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSchedule;
