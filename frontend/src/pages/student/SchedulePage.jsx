import React, { useEffect, useState } from "react";
import ScheduleTable from "../../components/ScheduleTable";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";

const SchedulePage = () => {
    const [viewDate, setViewDate] = useState(new Date());
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getWeekRange = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(start.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return {
            fromDate: formatDate(monday),
            toDate: formatDate(sunday),
        };
    };

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
        fetchSchedule();
    }, [viewDate, user?.profileId]);

    const handlePrevWeek = () => {
        const d = new Date(viewDate);
        d.setDate(viewDate.getDate() - 7);
        setViewDate(d);
    };

    const handleNextWeek = () => {
        const d = new Date(viewDate);
        d.setDate(viewDate.getDate() + 7);
        setViewDate(d);
    };

    const handleToday = () => setViewDate(new Date());

    return (
        <div
            className="p-4 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h3 className="fw-bold text-dark mb-0">
                    Lịch học, lịch thi theo tuần
                </h3>

                <div className="d-flex gap-2 bg-white p-1 rounded-pill shadow-sm border">
                    <button
                        onClick={handleToday}
                        className="btn btn-primary btn-sm rounded-pill px-3 fw-bold"
                    >
                        Hiện tại
                    </button>
                    <button
                        onClick={handlePrevWeek}
                        className="btn btn-outline-secondary btn-sm rounded-pill border-0 px-2"
                    >
                        <i className="bi bi-chevron-left"></i> Trở về
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="btn btn-outline-secondary btn-sm rounded-pill border-0 px-2"
                    >
                        Tiếp <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
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

            <div className="mt-4 d-flex flex-wrap gap-4 fw-bold small text-muted">
                <div className="d-flex align-items-center">
                    <span
                        className="me-2"
                        style={{
                            width: "25px",
                            height: "12px",
                            backgroundColor: "#f0f7ff",
                            border: "1px solid #ddd",
                        }}
                    ></span>{" "}
                    Lý thuyết
                </div>
                <div className="d-flex align-items-center">
                    <span
                        className="me-2"
                        style={{
                            width: "25px",
                            height: "12px",
                            backgroundColor: "#f6ffed",
                            border: "1px solid #ddd",
                        }}
                    ></span>{" "}
                    Thực hành
                </div>
                <div className="d-flex align-items-center">
                    <span
                        className="me-2"
                        style={{
                            width: "25px",
                            height: "12px",
                            backgroundColor: "#fffdf0",
                            border: "1px solid #ddd",
                        }}
                    ></span>{" "}
                    Lịch thi
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
