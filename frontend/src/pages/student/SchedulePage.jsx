import React, { useEffect, useMemo, useState } from "react";
import ScheduleNavigator from "../../components/ScheduleNavigator";
import ScheduleTable from "../../components/ScheduleTable";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import { getWeekRange } from "../../utils/schedule";

const SchedulePage = () => {
    const [viewDate, setViewDate] = useState(new Date());
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();

    const fetchSchedule = async () => {
        if (!user?.profileId) {
            setLoading(false);
            setError("Không xác định được hồ sơ học sinh.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const { fromDate, toDate } = getWeekRange(viewDate);
            const response = await studentService.getSchedule(
                user.profileId,
                fromDate,
                toDate,
            );
            setScheduleData(response);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Không thể tải lịch học.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Lịch học | EPU English";
        fetchSchedule();
    }, [viewDate, user?.profileId]);

    const stats = useMemo(() => {
        const examCount = scheduleData.filter(
            (item) => String(item.type).toLowerCase() === "exam",
        ).length;

        return [
            {
                label: "Tổng buổi tuần này",
                value: scheduleData.length,
                icon: "bi-calendar-week",
                tone: "#0d6efd",
                surface: "#eef4ff",
            },
            {
                label: "Lịch thi / kiểm tra",
                value: examCount,
                icon: "bi-journal-check",
                tone: "#fd7e14",
                surface: "#fff4e8",
            },
            {
                label: "Khung học khác nhau",
                value: new Set(scheduleData.map((item) => item.slot)).size,
                icon: "bi-grid-3x3-gap",
                tone: "#198754",
                surface: "#eefbf3",
            },
        ];
    }, [scheduleData]);

    const moveWeek = (amount) => {
        const date = new Date(viewDate);
        date.setDate(viewDate.getDate() + amount * 7);
        setViewDate(date);
    };

    return (
        <div className="p-4 animate__animated animate__fadeIn">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <div className="text-uppercase text-muted fw-semibold small mb-1">
                        Cổng học viên
                    </div>
                    <h2 className="fw-bold text-dark mb-1">Lịch học và lịch thi</h2>
                    <p className="text-muted mb-0">
                        Theo dõi toàn bộ buổi học trong tuần theo từng khung giờ.
                    </p>
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
                    currentDate={viewDate}
                    onToday={() => setViewDate(new Date())}
                    onPrev={() => moveWeek(-1)}
                    onNext={() => moveWeek(1)}
                />
            </div>

            {loading ? (
                <div className="rounded-4 border bg-white shadow-sm d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger d-flex justify-content-between align-items-center rounded-4 shadow-sm">
                    <span>{error}</span>
                    <button
                        onClick={fetchSchedule}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <ScheduleTable data={scheduleData} currentViewDate={viewDate} />
            )}
        </div>
    );
};

export default SchedulePage;
