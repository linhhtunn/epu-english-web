import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";

const statusConfig = {
    Cho_Nop: { label: "Chờ nộp", className: "bg-primary-subtle text-primary" },
    Da_Nop: { label: "Đã nộp", className: "bg-info-subtle text-info-emphasis" },
    Da_Cham: { label: "Đã chấm", className: "bg-success-subtle text-success" },
    Qua_Han: { label: "Quá hạn", className: "bg-danger-subtle text-danger" },
};

const formatDateTime = (value) => {
    if (!value) return "---";
    return new Date(value).toLocaleString("vi-VN");
};

const StudentHomeworkList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchHomeworks = async () => {
        if (!user?.profileId) {
            setLoading(false);
            setError("Không xác định được hồ sơ học sinh.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await studentService.getHomeworks(user.profileId);
            setItems(response);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Không thể tải danh sách bài tập.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Bài tập & Bài thi | EPU English";
        fetchHomeworks();
    }, [user?.profileId]);

    const filteredItems = useMemo(() => {
        if (statusFilter === "all") {
            return items;
        }
        return items.filter((item) => item.status === statusFilter);
    }, [items, statusFilter]);

    const summary = useMemo(() => {
        const counts = {
            total: items.length,
            pending: 0,
            graded: 0,
            overdue: 0,
        };
        items.forEach((item) => {
            if (item.status === "Cho_Nop") counts.pending += 1;
            if (item.status === "Da_Cham") counts.graded += 1;
            if (item.status === "Qua_Han") counts.overdue += 1;
        });
        return counts;
    }, [items]);

    return (
        <div
            className="p-4 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Bài tập và bài kiểm tra</h3>
                    <p className="text-muted mb-0">
                        Theo dõi tiến độ nộp bài và kết quả chấm điểm.
                    </p>
                </div>

                <select
                    className="form-select w-auto rounded-pill border-2 px-3 fw-bold"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Cho_Nop">Chờ nộp</option>
                    <option value="Da_Nop">Đã nộp</option>
                    <option value="Da_Cham">Đã chấm</option>
                    <option value="Qua_Han">Quá hạn</option>
                </select>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-3 col-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-primary text-white">
                        <small className="text-uppercase opacity-75 fw-bold">Tổng bài</small>
                        <h3 className="fw-bold mb-0 mt-2">{summary.total}</h3>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-warning text-dark">
                        <small className="text-uppercase opacity-75 fw-bold">Chờ nộp</small>
                        <h3 className="fw-bold mb-0 mt-2">{summary.pending}</h3>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-success text-white">
                        <small className="text-uppercase opacity-75 fw-bold">Đã chấm</small>
                        <h3 className="fw-bold mb-0 mt-2">{summary.graded}</h3>
                    </div>
                </div>
                <div className="col-md-3 col-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-danger text-white">
                        <small className="text-uppercase opacity-75 fw-bold">Quá hạn</small>
                        <h3 className="fw-bold mb-0 mt-2">{summary.overdue}</h3>
                    </div>
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
                        onClick={fetchHomeworks}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                    >
                        Thử lại
                    </button>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                    <i className="bi bi-inboxes fs-1 text-muted"></i>
                    <p className="text-muted mt-3 mb-0">
                        Không có bài tập phù hợp bộ lọc hiện tại.
                    </p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Bài tập</th>
                                    <th>Lớp</th>
                                    <th>Hạn nộp</th>
                                    <th>Trạng thái</th>
                                    <th>Điểm</th>
                                    <th>Nộp lúc</th>
                                    <th className="pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => {
                                    const status =
                                        statusConfig[item.status] ||
                                        statusConfig.Cho_Nop;
                                    return (
                                        <tr key={item.maBaiTap}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-primary">
                                                    {item.title}
                                                </div>
                                                <small className="text-muted">
                                                    {item.courseName}
                                                </small>
                                            </td>
                                            <td>{item.classCode}</td>
                                            <td>{formatDateTime(item.dueAt)}</td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill px-3 py-2 ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td>{item.submission?.diemSo ?? "---"}</td>
                                            <td>{formatDateTime(item.submission?.ngayNop)}</td>
                                            <td className="pe-4">
                                                <button
                                                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                                    onClick={() =>
                                                        navigate(
                                                            `/student/homework-list/${item.maBaiTap}`,
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-eye me-1"></i>
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentHomeworkList;
