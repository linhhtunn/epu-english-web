import React from "react";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: "Tổng học viên",
            count: "1,250",
            icon: "bi-people-fill",
            color: "linear-gradient(45deg, #005197, #0081f1)",
        },
        {
            title: "Khóa học đang mở",
            count: "45",
            icon: "bi-book-half",
            color: "linear-gradient(45deg, #28a745, #48d667)",
        },
        {
            title: "Doanh thu tháng",
            count: "540M",
            icon: "bi-cash-coin",
            color: "linear-gradient(45deg, #f39c12, #fbc531)",
        },
        {
            title: "Lớp học hôm nay",
            count: "12",
            icon: "bi-calendar-check",
            color: "linear-gradient(45deg, #e74c3c, #ff7675)",
        },
    ];

    const ongoingClasses = [
        {
            id: "HNI-PRI4-006",
            course: "IELTS Reading: Multiple Choice",
            teacher: "Nguyễn Thị Lan Anh",
            room: "Lab 1",
            time: "07:00 - 09:40",
            status: "Đang học",
        },
        {
            id: "IELTS-SPK",
            course: "IELTS Speaking: Part 3",
            teacher: "Mr. Steven Dang",
            room: "A302",
            time: "07:55 - 10:35",
            status: "Đang học",
        },
        {
            id: "TEST-002",
            course: "IELTS Mock Test: Listening",
            teacher: "Ban Khảo Thí",
            room: "Hội trường G3",
            time: "13:30 - 15:10",
            status: "Sắp bắt đầu",
        },
        {
            id: "ENG-WRT-02",
            course: "Academic Writing Task 2",
            teacher: "Ms. Thu Hà",
            room: "C101",
            time: "14:25 - 17:00",
            status: "Chờ dạy",
        },
    ];

    return (
        <div className="p-4 animate__animated animate__fadeIn">
            {/* --- HEADER: ĐÃ BỔ SUNG NÚT THÔNG BÁO & HỌC KỲ ĐỂ ĐỒNG BỘ --- */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-dark mb-1 text-uppercase">
                        Bảng điều khiển quản trị
                    </h2>
                    <p className="text-muted small mb-0">
                        Chào mừng trở lại,{" "}
                        <span className="fw-bold text-primary">
                            {user?.hoTen || "Quản trị viên"}
                        </span>
                        .
                    </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                    {/* 1. School Tag: Học kỳ (Đồng bộ với Teacher Dashboard) */}
                    <div className="bg-white p-2 px-3 rounded-4 shadow-sm border d-flex align-items-center d-none d-md-flex">
                        <div className="bg-primary-subtle p-2 rounded-3 me-3">
                            <i className="bi bi-calendar-check text-primary"></i>
                        </div>
                        <div className="text-start">
                            <span
                                className="small text-muted d-block fw-bold"
                                style={{
                                    fontSize: "9px",
                                    letterSpacing: "1px",
                                }}
                            >
                                HỌC KỲ
                            </span>
                            <span
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                            >
                                HK1 <span className="text-primary">2026</span>
                            </span>
                        </div>
                    </div>

                    {/* 2. Nút thông báo hình chuông (Đồng bộ với các trang khác) */}
                    <div
                        className="position-relative hover-up bg-white shadow-sm border rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "45px",
                            height: "45px",
                            cursor: "pointer",
                        }}
                    >
                        <i className="bi bi-bell-fill text-secondary fs-5"></i>
                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                            style={{ fontSize: "10px" }}
                        >
                            5
                        </span>
                    </div>
                </div>
            </div>

            {/* --- CÁC THẺ THỐNG KÊ NHANH --- */}
            <div className="row g-4 mb-5">
                {stats.map((item, index) => (
                    <div className="col-md-3" key={index}>
                        <div
                            className="card border-0 shadow-sm rounded-5 p-4 text-white h-100 shadow-hover"
                            style={{
                                background: item.color,
                                transition: "0.3s",
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="mb-1 fw-medium opacity-75 small text-uppercase">
                                        {item.title}
                                    </p>
                                    <h2 className="fw-bold mb-0">
                                        {item.count}
                                    </h2>
                                </div>
                                <div className="bg-white bg-opacity-25 rounded-4 p-2">
                                    <i
                                        className={`bi ${item.icon} fs-3 text-white`}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* --- DANH SÁCH LỚP ĐANG HỌC --- */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-5 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0 text-dark">
                                <i className="bi bi-play-circle-fill me-2 text-danger"></i>
                                Các lớp đang học & Sắp diễn ra
                            </h5>
                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                                Xem tất cả lịch dạy
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr className="small text-uppercase text-muted">
                                        <th className="border-0 rounded-start-4 ps-3">
                                            Mã lớp / Nội dung
                                        </th>
                                        <th className="border-0">Giảng viên</th>
                                        <th className="border-0">
                                            Phòng / Giờ
                                        </th>
                                        <th className="border-0 rounded-end-4">
                                            Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ongoingClasses.map((cls, idx) => (
                                        <tr
                                            key={idx}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td className="ps-3 py-3">
                                                <div className="fw-bold text-dark">
                                                    {cls.id}
                                                </div>
                                                <small className="text-primary fw-medium">
                                                    {cls.course}
                                                </small>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="bg-info-subtle text-info rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {cls.teacher
                                                            .split(" ")
                                                            .pop()
                                                            .charAt(0)}
                                                    </div>
                                                    <span className="small fw-bold text-secondary">
                                                        {cls.teacher}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="small fw-bold">
                                                    <i className="bi bi-geo-alt me-1"></i>{" "}
                                                    {cls.room}
                                                </div>
                                                <div className="small text-muted">
                                                    <i className="bi bi-clock me-1"></i>{" "}
                                                    {cls.time}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill px-3 py-2 ${
                                                        cls.status ===
                                                        "Đang học"
                                                            ? "bg-success text-white"
                                                            : cls.status ===
                                                                "Sắp bắt đầu"
                                                              ? "bg-warning text-dark"
                                                              : "bg-light text-muted border"
                                                    }`}
                                                >
                                                    {cls.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- CẢNH BÁO & THÔNG BÁO CHI TIẾT --- */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-5 p-4 h-100">
                        <h5 className="fw-bold mb-4 text-dark">
                            <i className="bi bi-bell-fill me-2 text-warning"></i>
                            Cảnh báo & Thông báo
                        </h5>
                        <div className="d-flex flex-column gap-3">
                            <div className="p-3 bg-danger-subtle rounded-4 border-start border-4 border-danger">
                                <div className="d-flex justify-content-between">
                                    <small className="fw-bold text-danger">
                                        ĐỀ XUẤT ĐỔI LỊCH
                                    </small>
                                    <small className="text-muted">10:20</small>
                                </div>
                                <p className="mb-0 small fw-bold mt-1">
                                    Giảng viên Bùi Khánh Linh yêu cầu đổi lịch
                                    dạy lớp IELTS-SPK.
                                </p>
                            </div>

                            <div className="p-3 bg-info-subtle rounded-4 border-start border-4 border-info">
                                <div className="d-flex justify-content-between">
                                    <small className="fw-bold text-info">
                                        SỰ KIỆN 8/3
                                    </small>
                                    <small className="text-muted">09:15</small>
                                </div>
                                <p className="mb-0 small fw-bold mt-1">
                                    Đã gửi thông báo chúc mừng tới toàn bộ nhân
                                    viên nữ.
                                </p>
                            </div>

                            <div className="p-3 bg-warning-subtle rounded-4 border-start border-4 border-warning">
                                <div className="d-flex justify-content-between">
                                    <small className="fw-bold text-warning">
                                        YÊU CẦU HỖ TRỢ
                                    </small>
                                    <small className="text-muted">08:00</small>
                                </div>
                                <p className="mb-0 small fw-bold mt-1">
                                    GV Lan Anh yêu cầu hỗ trợ kỹ thuật tại Phòng
                                    Lab 1.
                                </p>
                            </div>
                        </div>
                        <button className="btn btn-light w-100 mt-auto rounded-pill fw-bold border text-muted shadow-sm">
                            Xem tất cả nhật ký
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .shadow-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .hover-up:hover {
                    transform: scale(1.05);
                    transition: 0.2s;
                    cursor: pointer;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                table tr:hover {
                    background-color: #f8f9fa;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;

