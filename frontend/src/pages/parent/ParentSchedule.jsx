import React, { useEffect, useMemo, useState } from "react";
import ScheduleNavigator from "../../components/ScheduleNavigator";
import ScheduleTable from "../../components/ScheduleTable";
import { parentService } from "../../services/parentService";
import { getWeekRange } from "../../utils/schedule";

const ParentSchedule = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Lịch học của con | EPU English";
        const fetchChildren = async () => {
            try {
                const data = await parentService.getChildrenDashboard();
                if (data && data.length > 0) {
                    setChildren(data);
                    setSelectedChild(data[0]);
                }
            } catch (err) {
                console.error("Không tải được danh sách học sinh", err);
            }
        };
        fetchChildren();
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedChild?.maHocSinh) {
                return;
            }

            try {
                setLoading(true);
                const { fromDate, toDate } = getWeekRange(currentDate);
                const data = await parentService.getChildSchedule(
                    selectedChild.maHocSinh,
                    fromDate,
                    toDate,
                );
                setFilteredSchedule(data);
            } catch (err) {
                console.error("Lỗi khi tải lịch học", err);
                setFilteredSchedule([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [selectedChild, currentDate]);

    const summary = useMemo(() => {
        return [
            {
                label: "Buổi trong tuần",
                value: filteredSchedule.length,
                icon: "bi-calendar-heart",
                tone: "#0d6efd",
                surface: "#eef4ff",
            },
            {
                label: "Khung thi / kiểm tra",
                value: filteredSchedule.filter((item) => item.type === "exam").length,
                icon: "bi-patch-check",
                tone: "#fd7e14",
                surface: "#fff4e8",
            },
            {
                label: "Lớp / mã lịch",
                value: new Set(filteredSchedule.map((item) => item.code)).size,
                icon: "bi-mortarboard",
                tone: "#6f42c1",
                surface: "#f5f0ff",
            },
        ];
    }, [filteredSchedule]);

    const changeWeek = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + offset * 7);
        setCurrentDate(newDate);
    };

    return (
        <div className="container-fluid p-4 animate__animated animate__fadeIn">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <div className="text-uppercase text-muted fw-semibold small mb-1">
                        Cổng phụ huynh
                    </div>
                    <h2 className="fw-bold text-dark mb-1">Lịch học của học sinh</h2>
                    <p className="text-muted mb-0">
                        Theo dõi buổi học theo tuần và đổi nhanh giữa các con trong cùng
                        tài khoản.
                    </p>
                </div>

                <div className="dropdown">
                    <button
                        className="btn btn-outline-primary dropdown-toggle rounded-pill fw-semibold px-4 shadow-sm"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        {selectedChild
                            ? `${selectedChild.tenCon} • HS${selectedChild.maHocSinh}`
                            : "Chọn học sinh"}
                    </button>
                    <ul className="dropdown-menu shadow border-0 mt-2 rounded-4">
                        {children.map((child) => (
                            <li key={child.maHocSinh}>
                                <button
                                    className="dropdown-item py-2 fw-medium"
                                    onClick={() => setSelectedChild(child)}
                                >
                                    {child.tenCon} - HS{child.maHocSinh}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {summary.map((item) => (
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
                    onPrev={() => changeWeek(-1)}
                    onNext={() => changeWeek(1)}
                    accent="#6f42c1"
                />
            </div>

            <div className="rounded-4 border bg-white p-4 shadow-sm mb-4">
                <div className="d-flex flex-wrap justify-content-between gap-3 align-items-center">
                    <div>
                        <div className="text-uppercase text-muted fw-semibold small mb-1">
                            Học sinh đang xem
                        </div>
                        <div className="fw-bold text-dark">
                            {selectedChild?.tenCon || "Chưa chọn học sinh"}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                        <span className="badge text-bg-light border px-3 py-2">
                            {selectedChild?.lop || "Chưa xếp lớp"}
                        </span>
                        <span className="badge text-bg-light border px-3 py-2">
                            {selectedChild?.khoaHoc || "Chưa có khóa học"}
                        </span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-4 border bg-white shadow-sm d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <ScheduleTable
                    data={filteredSchedule}
                    currentViewDate={currentDate}
                />
            )}
        </div>
    );
};

export default ParentSchedule;
