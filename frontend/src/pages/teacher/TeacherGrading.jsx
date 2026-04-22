import React, { useEffect, useMemo, useState } from "react";
import { teacherService } from "../../services/teacherService";

const statusConfig = {
    Cho_Cham: {
        label: "Chờ chấm",
        className: "bg-warning-subtle text-warning-emphasis",
    },
    Da_Cham: {
        label: "Đã chấm",
        className: "bg-success-subtle text-success",
    },
    Can_Lam_Lai: {
        label: "Cần làm lại",
        className: "bg-danger-subtle text-danger",
    },
};

const formatDateTime = (value) => {
    if (!value) return "---";
    return new Date(value).toLocaleString("vi-VN");
};

const TeacherGrading = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [classes, setClasses] = useState([]);

    // Grading modal state
    const [gradingItem, setGradingItem] = useState(null);
    const [gradeScore, setGradeScore] = useState("");
    const [gradeComment, setGradeComment] = useState("");
    const [grading, setGrading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const [subData, classData] = await Promise.all([
                teacherService.getSubmissions(),
                teacherService.getClasses()
            ]);
            setSubmissions(subData);
            setClasses(classData);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Không thể tải danh sách dữ liệu.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Chấm điểm | EPU English";
        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        return submissions.filter((s) => {
            const matchStatus = statusFilter === "all" || s.trangThai === statusFilter;
            const matchClass = classFilter === "all" || s.classCode === classFilter;
            return matchStatus && matchClass;
        });
    }, [submissions, statusFilter, classFilter]);

    const summary = useMemo(() => {
        const counts = { total: submissions.length, pending: 0, graded: 0 };
        submissions.forEach((s) => {
            if (s.trangThai === "Cho_Cham") counts.pending += 1;
            if (s.trangThai === "Da_Cham") counts.graded += 1;
        });
        return counts;
    }, [submissions]);

    const openGradeModal = (item) => {
        setGradingItem(item);
        setGradeScore(item.diemSo != null ? String(item.diemSo) : "");
        setGradeComment(item.loiPheGiaoVien || "");
    };

    const closeGradeModal = () => {
        setGradingItem(null);
        setGradeScore("");
        setGradeComment("");
    };

    const submitGrade = async () => {
        if (!gradingItem) return;
        const score = parseFloat(gradeScore);
        if (isNaN(score) || score < 0 || score > 10) {
            alert("Điểm phải từ 0 đến 10.");
            return;
        }

        try {
            setGrading(true);
            await teacherService.gradeSubmission(gradingItem.maBaiNop, {
                diemSo: score,
                nhanXet: gradeComment || null,
            });

            // Update local state
            setSubmissions((prev) =>
                prev.map((s) =>
                    s.maBaiNop === gradingItem.maBaiNop
                        ? {
                              ...s,
                              diemSo: score,
                              loiPheGiaoVien: gradeComment,
                              trangThai: "Da_Cham",
                          }
                        : s,
                ),
            );
            closeGradeModal();
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message || "Chấm điểm thất bại.",
            );
        } finally {
            setGrading(false);
        }
    };

    return (
        <div
            className="p-4 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Chấm điểm bài nộp</h3>
                    <p className="text-muted mb-0">
                        Xem và chấm điểm bài nộp của học sinh từ các lớp bạn
                        đang dạy.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <select
                        className="form-select w-auto rounded-pill border-2 px-3 fw-bold"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                    >
                        <option value="all">Tất cả lớp</option>
                        {classes.map((c) => (
                            <option key={c.maLop} value={c.maLopHienThi}>
                                {c.maLopHienThi}
                            </option>
                        ))}
                    </select>
                    <select
                        className="form-select w-auto rounded-pill border-2 px-3 fw-bold"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Cho_Cham">Chờ chấm</option>
                        <option value="Da_Cham">Đã chấm</option>
                        <option value="Can_Lam_Lai">Cần làm lại</option>
                    </select>
                </div>
            </div>

            {/* Summary cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4 col-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-primary text-white">
                        <small className="text-uppercase opacity-75 fw-bold">
                            Tổng bài nộp
                        </small>
                        <h3 className="fw-bold mb-0 mt-2">{summary.total}</h3>
                    </div>
                </div>
                <div className="col-md-4 col-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-warning text-dark">
                        <small className="text-uppercase opacity-75 fw-bold">
                            Chờ chấm
                        </small>
                        <h3 className="fw-bold mb-0 mt-2">
                            {summary.pending}
                        </h3>
                    </div>
                </div>
                <div className="col-md-4 col-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-success text-white">
                        <small className="text-uppercase opacity-75 fw-bold">
                            Đã chấm
                        </small>
                        <h3 className="fw-bold mb-0 mt-2">{summary.graded}</h3>
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
                        onClick={fetchSubmissions}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                    >
                        Thử lại
                    </button>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                    <i className="bi bi-inboxes fs-1 text-muted"></i>
                    <p className="text-muted mt-3 mb-0">
                        Không có bài nộp phù hợp bộ lọc hiện tại.
                    </p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Học sinh</th>
                                    <th>Bài tập</th>
                                    <th>Lớp</th>
                                    <th>Ngày nộp</th>
                                    <th>Trạng thái</th>
                                    <th>Điểm</th>
                                    <th className="pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => {
                                    const status =
                                        statusConfig[item.trangThai] ||
                                        statusConfig.Cho_Cham;
                                    return (
                                        <tr key={item.maBaiNop}>
                                            <td className="ps-4">
                                                <div className="fw-bold">
                                                    {item.studentName}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-primary">
                                                    {item.homeworkTitle}
                                                </div>
                                            </td>
                                            <td>{item.classCode}</td>
                                            <td>
                                                {formatDateTime(item.ngayNop)}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill px-3 py-2 ${status.className}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="fw-bold">
                                                {item.diemSo != null
                                                    ? item.diemSo
                                                    : "---"}
                                            </td>
                                            <td className="pe-4">
                                                <div className="d-flex gap-2">
                                                    {item.duongDanBaiLam && (
                                                        <a
                                                            href={
                                                                item.duongDanBaiLam
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                                        >
                                                            <i className="bi bi-eye me-1"></i>
                                                            Xem bài
                                                        </a>
                                                    )}
                                                    <button
                                                        className="btn btn-primary btn-sm rounded-pill px-3"
                                                        onClick={() =>
                                                            openGradeModal(item)
                                                        }
                                                    >
                                                        <i className="bi bi-pencil-square me-1"></i>
                                                        {item.trangThai ===
                                                        "Da_Cham"
                                                            ? "Sửa điểm"
                                                            : "Chấm điểm"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Grading Modal */}
            {gradingItem && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeGradeModal();
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="bi bi-pencil-square text-primary me-2"></i>
                                    Chấm điểm bài nộp
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeGradeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="bg-light rounded-3 p-3 mb-3">
                                    <div className="small text-muted">
                                        Học sinh
                                    </div>
                                    <div className="fw-bold">
                                        {gradingItem.studentName}
                                    </div>
                                    <div className="small text-muted mt-2">
                                        Bài tập
                                    </div>
                                    <div className="fw-bold text-primary">
                                        {gradingItem.homeworkTitle}
                                    </div>
                                    <div className="small text-muted mt-2">
                                        Lớp
                                    </div>
                                    <div className="fw-bold">
                                        {gradingItem.classCode}
                                    </div>
                                </div>

                                {gradingItem.duongDanBaiLam && (
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">
                                            Link bài làm
                                        </label>
                                        <a
                                            href={gradingItem.duongDanBaiLam}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="d-block text-primary text-truncate"
                                        >
                                            {gradingItem.duongDanBaiLam}
                                        </a>
                                    </div>
                                )}

                                {gradingItem.homeworkLink && (
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">
                                            Link đề bài gốc
                                        </label>
                                        <a
                                            href={gradingItem.homeworkLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="d-block text-secondary text-truncate"
                                        >
                                            {gradingItem.homeworkLink}
                                        </a>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label fw-bold small">
                                        Điểm số (0 - 10)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control rounded-3"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={gradeScore}
                                        onChange={(e) =>
                                            setGradeScore(e.target.value)
                                        }
                                        placeholder="Nhập điểm..."
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">
                                        Nhận xét
                                    </label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows="3"
                                        value={gradeComment}
                                        onChange={(e) =>
                                            setGradeComment(e.target.value)
                                        }
                                        placeholder="Nhận xét cho học sinh..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button
                                    className="btn btn-light rounded-pill px-4"
                                    onClick={closeGradeModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn btn-primary rounded-pill px-4 fw-bold"
                                    onClick={submitGrade}
                                    disabled={grading}
                                >
                                    {grading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg me-1"></i>
                                            Lưu điểm
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherGrading;
