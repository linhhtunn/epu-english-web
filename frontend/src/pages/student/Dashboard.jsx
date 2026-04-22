import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        if (!user?.profileId) {
            setLoading(false);
            setError("Không xác định được hồ sơ học sinh.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const data = await studentService.getDashboard(user.profileId);
            setDashboardData(data);
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message ||
                "Không tải được dữ liệu dashboard.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [user?.profileId]);

    const stats = useMemo(() => {
        if (!dashboardData) {
            return [
                {
                    label: "Tham dự",
                    value: "0%",
                    bg: "#1e88e5",
                    icon: "bi-patch-check",
                },
                {
                    label: "Hoàn thành bài tập",
                    value: "0%",
                    bg: "#ec407a",
                    icon: "bi-journal-check",
                },
                {
                    label: "Điểm TB kiểm tra",
                    value: "0",
                    bg: "#e53935",
                    icon: "bi-book",
                },
            ];
        }

        return [
            {
                label: "Tham dự",
                value: `${Math.round(dashboardData.attendanceRate || 0)}%`,
                bg: "#1e88e5",
                icon: "bi-patch-check",
            },
            {
                label: "Hoàn thành bài tập",
                value: `${Math.round(dashboardData.homeworkCompletionRate || 0)}%`,
                bg: "#ec407a",
                icon: "bi-journal-check",
            },
            {
                label: "Điểm TB kiểm tra",
                value: `${dashboardData.testAverage || 0}`,
                bg: "#e53935",
                icon: "bi-book",
            },
        ];
    }, [dashboardData]);

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "70vh" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button
                        onClick={fetchDashboard}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="p-0 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            {/* TOPBAR */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2
                        className="fw-bold mb-1"
                        style={{ color: "#005197", letterSpacing: "-0.5px" }}
                    >
                        Xin chào,{" "}
                        {dashboardData?.studentName ||
                            user?.fullName ||
                            user?.username ||
                            "Học viên"}
                    </h2>
                    <p className="text-muted fw-500 mb-0">Hãy bắt đầu học!</p>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-pill shadow-sm border border-warning-subtle d-flex align-items-center">
                        <span
                            className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ width: "28px", height: "28px" }}
                        >
                            <i className="bi bi-star-fill text-white small"></i>
                        </span>
                        <span className="fw-bold text-dark">
                            {dashboardData?.aposPoints || 0} Apos
                        </span>
                    </div>
                    <div
                        className="bg-white p-2 rounded-circle shadow-sm border d-flex align-items-center justify-content-center position-relative"
                        style={{
                            width: "45px",
                            height: "45px",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/student/notifications")}
                    >
                        <i className="bi bi-bell-fill text-primary fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"></span>
                    </div>
                </div>
            </div>

            {/* BANNER HIỆN ĐẠI */}
            <div
                className="card border-0 rounded-5 mb-5 shadow-lg overflow-hidden text-white"
                style={{
                    background:
                        "linear-gradient(135deg, #005197 0%, #00a8ff 100%)",
                    minHeight: "280px",
                }}
            >
                <div className="card-body p-0 d-flex align-items-center">
                    <div className="row w-100 m-0 align-items-center text-white">
                        <div className="col-lg-7 p-5">
                            <h4 className="fw-bold mb-2 opacity-75">
                                EPU ENGLISH
                            </h4>
                            <h1 className="fw-800 display-5 mb-3">
                                TIẾP TỤC HÀNH TRÌNH HỌC TẬP
                            </h1>
                            <p className="lead fw-500 mb-4 opacity-90">
                                {dashboardData?.currentClass?.CourseName ||
                                    dashboardData?.currentClass?.courseName ||
                                    "Mỗi ngày một bước tiến bộ"}
                            </p>
                            <button
                                onClick={() =>
                                    navigate("/student/homework-list")
                                }
                                className="btn btn-warning btn-lg rounded-pill px-5 fw-bold text-white shadow"
                            >
                                XEM BÀI TẬP
                            </button>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                            <i
                                className="bi bi-rocket-takeoff position-absolute opacity-25"
                                style={{
                                    fontSize: "200px",
                                    right: "20px",
                                    top: "-100px",
                                }}
                            ></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS SECTION */}
            <div className="row g-4 mb-5">
                {stats.map((item, idx) => (
                    <div className="col-md-4" key={idx}>
                        <div
                            className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden text-white"
                            style={{ background: item.bg }}
                        >
                            <div className="card-body p-4 position-relative text-white">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3">
                                        <i
                                            className={`bi ${item.icon} fs-4`}
                                        ></i>
                                    </div>
                                    <span className="fw-bold text-uppercase small opacity-75 text-white">
                                        {item.label}
                                    </span>
                                </div>
                                <h2 className="display-5 fw-bold mb-0 text-white">
                                    {item.value}
                                </h2>
                                <i
                                    className="bi bi-graph-up-arrow position-absolute bottom-0 end-0 p-3 opacity-25"
                                    style={{ fontSize: "3rem" }}
                                ></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* LỚP HỌC HÔM NAY */}
            <div className="mb-4">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-danger rounded-3 p-2 me-3">
                        <i className="bi bi-calendar2-check text-white"></i>
                    </div>
                    <h5 className="fw-bold mb-0 text-dark">Lớp học hôm nay</h5>
                </div>

                {dashboardData?.todayClasses?.length > 0 ? (
                    <div className="row g-3">
                        {dashboardData.todayClasses.map((item) => (
                            <div key={item.maBuoiHoc} className="col-md-6">
                                <div className="card border-0 rounded-4 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="fw-bold text-primary mb-0">
                                                {item.courseName}
                                            </h6>
                                            <span className="badge bg-light text-dark border">
                                                {item.maLopHienThi}
                                            </span>
                                        </div>
                                        <p className="small text-muted mb-2">
                                            <i className="bi bi-clock me-2"></i>
                                            {item.startTime} - {item.endTime}
                                        </p>
                                        <p className="small text-muted mb-2">
                                            <i className="bi bi-person me-2"></i>
                                            {item.teacherName}
                                        </p>
                                        <p className="small mb-0">
                                            <strong>Điểm danh:</strong>{" "}
                                            {item.attendanceStatus ||
                                                "Chưa cập nhật"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-5 py-5 shadow-sm border border-dashed border-2 text-center">
                        <img
                            src="https://active.apollo.edu.vn/static/media/robot-empty.6200236a.png"
                            alt="robot"
                            style={{ width: "150px" }}
                            className="mb-4"
                        />
                        <h5 className="fw-bold text-dark">
                            Hiện chưa có lớp học nào
                        </h5>
                        <p className="text-muted">
                            Hãy quay lại sau hoặc xem lịch học chi tiết nhé!
                        </p>
                        <button
                            onClick={() => navigate("/student/schedule")}
                            className="btn btn-outline-primary rounded-pill px-4 fw-bold mt-2"
                        >
                            XEM LỊCH HỌC
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
