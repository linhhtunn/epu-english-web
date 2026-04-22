import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";

// Map mã kỹ năng từ DB sang tên hiển thị tiếng Việt
const formatSkillName = (name) => {
    if (!name) return "Chưa rõ";
    const map = {
        "Ngu_Phap": "Ngữ pháp",
        "Viet": "Viết",
        "Doc": "Đọc",
        "Nghe": "Nghe",
        "Noi": "Nói",
        "Tu_Vung": "Từ vựng",
        "Phat_Am": "Phát âm",
    };
    return map[name] || name.replace(/_/g, " ");
};

const StudentSelfStudy = () => {
    const { user } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        if (!user?.profileId) {
            setLoading(false);
            setError("Không xác định được hồ sơ học sinh.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const [homeworkData, reportData] = await Promise.all([
                studentService.getHomeworks(user.profileId),
                studentService.getReports(user.profileId),
            ]);

            setHomeworks(homeworkData);
            setReports(reportData);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Không tải được dữ liệu học chủ động.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Học chủ động | EPU English";
        fetchData();
    }, [user?.profileId]);

    const upcomingTasks = useMemo(() => {
        const now = Date.now();
        return homeworks
            .filter(
                (item) => item.status === "Cho_Nop" || item.status === "Da_Nop",
            )
            .sort(
                (a, b) =>
                    new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
            )
            .slice(0, 5)
            .map((item) => ({
                ...item,
                daysLeft: Math.ceil(
                    (new Date(item.dueAt).getTime() - now) /
                        (1000 * 60 * 60 * 24),
                ),
            }));
    }, [homeworks]);

    const weakSkills = useMemo(() => {
        if (!reports?.skillBreakdown?.length) return [];
        return [...reports.skillBreakdown]
            .sort((a, b) => (a.averageScore || 0) - (b.averageScore || 0))
            .slice(0, 3);
    }, [reports]);

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
                        onClick={fetchData}
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
            className="p-4 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Học chủ động</h3>
                <p className="text-muted mb-0">
                    Gợi ý kế hoạch tự học dựa trên dữ liệu học tập hiện tại.
                </p>
            </div>

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Ưu tiên tuần này</h5>
                            {upcomingTasks.length ? (
                                <div className="d-flex flex-column gap-3">
                                    {upcomingTasks.map((task) => (
                                        <div
                                            key={task.maBaiTap}
                                            className="border rounded-4 p-3 bg-light"
                                        >
                                            <div className="d-flex justify-content-between align-items-start gap-2">
                                                <div>
                                                    <h6 className="fw-bold text-primary mb-1">
                                                        {task.title}
                                                    </h6>
                                                    <small className="text-muted">
                                                        {task.classCode} -{" "}
                                                        {task.courseName}
                                                    </small>
                                                </div>
                                                <span
                                                    className={`badge rounded-pill ${task.daysLeft <= 1 ? "bg-danger" : "bg-warning text-dark"}`}
                                                >
                                                    {task.daysLeft <= 0
                                                        ? "Đến hạn hôm nay"
                                                        : `Còn ${task.daysLeft} ngày`}
                                                </span>
                                            </div>
                                            <p className="small text-muted mt-2 mb-0">
                                                Hạn nộp:{" "}
                                                {new Date(
                                                    task.dueAt,
                                                ).toLocaleString("vi-VN")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted mb-0">
                                    Hiện không có bài cần ưu tiên.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">
                                Kỹ năng cần cải thiện
                            </h5>
                            {weakSkills.length ? (
                                weakSkills.map((skill) => (
                                    <div className="mb-3" key={skill.skillId}>
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold small">
                                                {formatSkillName(skill.skillName)}
                                            </span>
                                            <span className="small text-muted">
                                                {skill.averageScore}
                                            </span>
                                        </div>
                                        <div
                                            className="progress mt-1"
                                            style={{ height: "10px" }}
                                        >
                                            <div
                                                className="progress-bar bg-danger"
                                                style={{
                                                    width: `${Math.max(Math.min(skill.averageScore || 0, 100), 5)}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">
                                            {skill.teacherComment ||
                                                "Ôn lại kiến thức nền để tăng độ chính xác."}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted mb-0">
                                    Chưa có dữ liệu đánh giá kỹ năng.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 rounded-4 shadow-sm mt-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Checklist tự học đề xuất</h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="border rounded-4 p-3 h-100 bg-light">
                                <h6 className="fw-bold text-primary">
                                    1. Ôn từ vựng
                                </h6>
                                <p className="small text-muted mb-0">
                                    Dành 20 phút mỗi ngày để ôn theo chủ đề đang
                                    học trên lớp.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="border rounded-4 p-3 h-100 bg-light">
                                <h6 className="fw-bold text-primary">
                                    2. Luyện viết ngắn
                                </h6>
                                <p className="small text-muted mb-0">
                                    Viết 1 đoạn 120-150 từ và tự kiểm tra ngữ
                                    pháp trước khi nộp.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="border rounded-4 p-3 h-100 bg-light">
                                <h6 className="fw-bold text-primary">
                                    3. Nghe chủ động
                                </h6>
                                <p className="small text-muted mb-0">
                                    Nghe 1 audio ngắn và ghi lại key words để
                                    tăng phản xạ bắt ý.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSelfStudy;
