import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";

const statusConfig = {
    Cho_Nop: { label: "Chờ nộp", className: "bg-primary-subtle text-primary", icon: "bi-hourglass-split" },
    Da_Nop: { label: "Đã nộp", className: "bg-info-subtle text-info-emphasis", icon: "bi-send-check" },
    Da_Cham: { label: "Đã chấm", className: "bg-success-subtle text-success", icon: "bi-check-circle" },
    Qua_Han: { label: "Quá hạn", className: "bg-danger-subtle text-danger", icon: "bi-exclamation-triangle" },
    Can_Lam_Lai: { label: "Cần làm lại", className: "bg-warning-subtle text-warning-emphasis", icon: "bi-arrow-repeat" },
};

const difficultyMap = {
    De: { label: "Dễ", color: "success" },
    Trung_Binh: { label: "Trung bình", color: "warning" },
    Kho: { label: "Khó", color: "danger" },
    Rat_Kho: { label: "Rất khó", color: "dark" },
};

const skillMap = {
    Grammar: "Ngữ pháp",
    Tu_Vung: "Từ vựng",
    Doc: "Đọc",
    Nghe: "Nghe",
    Viet: "Viết",
    Noi: "Nói",
};

const formatDateTime = (value) => {
    if (!value) return "---";
    return new Date(value).toLocaleString("vi-VN");
};

const StudentHomeworkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [homework, setHomework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submissionLink, setSubmissionLink] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        document.title = "Chi tiết bài tập | EPU English";
        const fetchDetail = async () => {
            if (!user?.profileId || !id) {
                setLoading(false);
                setError("Không xác định được thông tin.");
                return;
            }
            try {
                setLoading(true);
                setError("");
                const data = await studentService.getHomeworkDetail(
                    user.profileId,
                    id,
                );
                setHomework(data);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                        "Không thể tải chi tiết bài tập.",
                );
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [user?.profileId, id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const data = await studentService.getHomeworkDetail(user.profileId, id);
            setHomework(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submissionLink.trim()) {
            alert("Vui lòng nhập link bài làm.");
            return;
        }

        try {
            setSubmitting(true);
            await studentService.submitHomework(user.profileId, id, {
                submissionLink: submissionLink.trim(),
            });
            alert("Nộp bài thành công!");
            setShowSubmitModal(false);
            setSubmissionLink("");
            fetchDetail(); // Refresh data
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Có lỗi xảy ra khi nộp bài.");
        } finally {
            setSubmitting(false);
        }
    };

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
                        onClick={() => navigate(-1)}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!homework) return null;

    const status = statusConfig[homework.status] || statusConfig.Cho_Nop;
    const diff = difficultyMap[homework.difficulty] || { label: homework.difficulty, color: "secondary" };
    const skill = skillMap[homework.skillType] || homework.skillType || "---";

    return (
        <div
            className="p-4 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            {/* Header */}
            <div className="d-flex align-items-center mb-4 gap-3">
                <button
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                    <h3 className="fw-bold mb-1">{homework.title}</h3>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <span className={`badge rounded-pill px-3 py-2 ${status.className}`}>
                            <i className={`bi ${status.icon} me-1`}></i>
                            {status.label}
                        </span>
                        <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                            {homework.classCode}
                        </span>
                        <span className={`badge bg-${diff.color}-subtle text-${diff.color} rounded-pill px-3 py-2`}>
                            {diff.label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left: Homework info */}
                <div className="col-lg-7">
                    <div className="card border-0 rounded-4 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">
                                <i className="bi bi-file-earmark-text text-primary me-2"></i>
                                Thông tin bài tập
                            </h5>

                            <div className="bg-light rounded-3 p-3 mb-3">
                                <p className="mb-0 text-dark">
                                    {homework.description || "Không có mô tả."}
                                </p>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                    <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                        Khóa học
                                    </div>
                                    <div className="fw-bold">
                                        {homework.courseName}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                        Kỹ năng
                                    </div>
                                    <div className="fw-bold">{skill}</div>
                                </div>
                                <div className="col-6">
                                    <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                        Thời gian làm bài
                                    </div>
                                    <div className="fw-bold">
                                        {homework.duration
                                            ? `${homework.duration} phút`
                                            : "---"}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                        Điểm thưởng Apos
                                    </div>
                                    <div className="fw-bold text-success">
                                        +{homework.rewardPoints || 0}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                        Ngày giao
                                    </div>
                                    <div className="fw-bold">
                                        {formatDateTime(homework.assignedAt)}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                        Hạn nộp
                                    </div>
                                    <div className="fw-bold text-danger">
                                        {formatDateTime(homework.dueAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Homework link */}
                            {homework.homeworkLink && (
                                <div className="border rounded-4 p-3 bg-primary-subtle">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="small text-muted fw-bold">
                                                Link bài tập
                                            </div>
                                            <a
                                                href={homework.homeworkLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-truncate d-block"
                                                style={{ maxWidth: 300 }}
                                            >
                                                {homework.homeworkLink}
                                            </a>
                                        </div>
                                        <button
                                            onClick={() => setShowSubmitModal(true)}
                                            className="btn btn-primary rounded-pill px-4 fw-bold"
                                            disabled={homework.status === "Da_Nop" || homework.status === "Da_Cham"}
                                        >
                                            <i className="bi bi-send me-1"></i>
                                            {homework.submission ? "Nộp lại" : "Làm bài"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Submission result */}
                <div className="col-lg-5">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">
                                <i className="bi bi-clipboard-check text-success me-2"></i>
                                Kết quả nộp bài
                            </h5>

                            {homework.submission ? (
                                <>
                                    {/* Score display */}
                                    {homework.submission.diemSo != null && (
                                        <div className="text-center mb-4">
                                            <div
                                                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white"
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    fontSize: 28,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {homework.submission.diemSo}
                                            </div>
                                            <div className="text-muted small mt-2 fw-bold">
                                                / 10 điểm
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                            Trạng thái
                                        </div>
                                        <span className={`badge rounded-pill px-3 py-2 ${status.className}`}>
                                            <i className={`bi ${status.icon} me-1`}></i>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                            Ngày nộp
                                        </div>
                                        <div className="fw-bold">
                                            {formatDateTime(
                                                homework.submission.ngayNop,
                                            )}
                                        </div>
                                    </div>

                                    {homework.submission.duongDanBaiLam && (
                                        <div className="mb-3">
                                            <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: 10 }}>
                                                Link bài nộp
                                            </div>
                                            <a
                                                href={
                                                    homework.submission
                                                        .duongDanBaiLam
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-truncate d-block"
                                            >
                                                {
                                                    homework.submission
                                                        .duongDanBaiLam
                                                }
                                            </a>
                                        </div>
                                    )}

                                    {/* Teacher comment */}
                                    {homework.submission.loiPheGiaoVien && (
                                        <div className="border-start border-4 border-primary ps-3 mt-3 bg-light rounded-3 p-3">
                                            <div className="small text-muted fw-bold text-uppercase mb-1" style={{ fontSize: 10 }}>
                                                Nhận xét giáo viên
                                            </div>
                                            <p className="mb-0 text-dark">
                                                {
                                                    homework.submission
                                                        .loiPheGiaoVien
                                                }
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="bi bi-inbox fs-1 text-muted"></i>
                                    <p className="text-muted mt-3 mb-0">
                                        {homework.status === "Qua_Han"
                                            ? "Bạn đã không nộp bài tập này."
                                            : "Bạn chưa nộp bài tập này. Hãy bấm 'Làm bài' để bắt đầu."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="fw-bold">Nộp bài tập</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowSubmitModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <p className="text-muted small mb-3">
                                        Dán link bài làm của bạn (Google Drive, Canva, Youtube, v.v.) vào ô bên dưới:
                                    </p>
                                    <div className="form-group">
                                        <label className="small fw-bold text-uppercase mb-1" style={{ fontSize: 10 }}>Link bài làm</label>
                                        <input
                                            type="url"
                                            className="form-control rounded-3"
                                            placeholder="https://..."
                                            value={submissionLink}
                                            onChange={(e) => setSubmissionLink(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowSubmitModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang nộp...
                                            </>
                                        ) : "Xác nhận nộp"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentHomeworkDetail;
