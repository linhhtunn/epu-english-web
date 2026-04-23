import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import { formatVietnamDateTime } from "../../utils/dateUtils";

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

const StudentReports = () => {
    const { user } = useAuth();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReports = async () => {
        if (!user?.profileId) {
            setLoading(false);
            setError("Không xác định được hồ sơ học sinh.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await studentService.getReports(user.profileId);
            setReportData(response);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Không tải được dữ liệu báo cáo.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Báo cáo học tập | EPU English";
        fetchReports();
    }, [user?.profileId]);

    const completionRate = useMemo(() => {
        const total = reportData?.stats?.totalAssignments || 0;
        const completed = reportData?.stats?.completedAssignments || 0;
        if (total === 0) return 0;
        return Math.round((completed * 100) / total);
    }, [reportData]);

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
                        onClick={fetchReports}
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
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Báo cáo học tập</h3>
                    <p className="text-muted mb-0">
                        Tổng hợp tiến độ, kỹ năng và kết quả kiểm tra gần nhất.
                    </p>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-primary text-white h-100">
                        <small className="text-uppercase opacity-75 fw-bold">
                            Tổng bài tập
                        </small>
                        <h2 className="fw-bold mt-2 mb-0">
                            {reportData?.stats?.totalAssignments || 0}
                        </h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-success text-white h-100">
                        <small className="text-uppercase opacity-75 fw-bold">
                            Tỷ lệ hoàn thành
                        </small>
                        <h2 className="fw-bold mt-2 mb-0">{completionRate}%</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-warning text-dark h-100">
                        <small className="text-uppercase opacity-75 fw-bold">
                            Điểm trung bình
                        </small>
                        <h2 className="fw-bold mt-2 mb-0">
                            {reportData?.stats?.averageScore || 0}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">
                                Năng lực theo kỹ năng
                            </h5>
                            {reportData?.skillBreakdown?.length ? (
                                reportData.skillBreakdown.map((skill) => (
                                    <div key={skill.skillId} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fw-bold small">
                                                {formatSkillName(skill.skillName)}
                                            </span>
                                            <span className="small text-muted">
                                                {skill.averageScore}
                                            </span>
                                        </div>
                                        <div
                                            className="progress"
                                            style={{ height: "10px" }}
                                        >
                                            <div
                                                className="progress-bar bg-primary"
                                                role="progressbar"
                                                style={{
                                                    width: `${Math.min(skill.averageScore, 100)}%`,
                                                }}
                                                aria-valuenow={
                                                    skill.averageScore
                                                }
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                        {skill.teacherComment && (
                                            <small className="text-muted d-block mt-1">
                                                {skill.teacherComment}
                                            </small>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted mb-0">
                                    Chưa có dữ liệu kỹ năng.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Điểm kiểm tra</h5>
                            {reportData?.examResults?.length ? (
                                <div className="table-responsive">
                                    <table className="table table-sm align-middle">
                                        <thead>
                                            <tr>
                                                <th>Bài kiểm tra</th>
                                                <th>Lớp</th>
                                                <th>Điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.examResults.map(
                                                (exam) => (
                                                    <tr
                                                        key={`${exam.maKiemTra}-${exam.ngayNop}`}
                                                    >
                                                        <td>
                                                            <div className="fw-bold">
                                                                {exam.testTitle}
                                                            </div>
                                                            <small className="text-muted">
                                                                {exam.nhanXetGiaoVien ||
                                                                    "---"}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            {exam.classCode}
                                                        </td>
                                                        <td className="fw-bold text-primary">
                                                            {exam.diemSo ??
                                                                "---"}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted mb-0">
                                    Chưa có kết quả kiểm tra.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mt-1">
                <div className="col-lg-7">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Nhận xét gần nhất</h5>
                            {reportData?.reportCards?.length ? (
                                <div className="d-flex flex-column gap-3">
                                    {reportData.reportCards
                                        .slice(0, 4)
                                        .map((report) => (
                                            <div
                                                key={report.maBaoCao}
                                                className="border rounded-4 p-3 bg-light"
                                            >
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h6 className="fw-bold mb-1">
                                                            {report.tieuDe ||
                                                                "Báo cáo buổi học"}
                                                        </h6>
                                                        <small className="text-muted">
                                                            GV: {report.teacher}
                                                        </small>
                                                    </div>
                                                    <span className="badge bg-primary-subtle text-primary">
                                                        {report.progress || 0}%
                                                    </span>
                                                </div>
                                                <p className="mb-0 mt-2 small text-dark">
                                                    {report.mucTieuBaiHoc ||
                                                        "Không có ghi chú."}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-muted mb-0">
                                    Chưa có báo cáo học tập.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 rounded-4 shadow-sm h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Nhật ký Apos</h5>
                            {reportData?.aposHistory?.length ? (
                                <ul className="list-group list-group-flush">
                                    {reportData.aposHistory
                                        .slice(0, 6)
                                        .map((item) => (
                                            <li
                                                key={item.maLog}
                                                className="list-group-item px-0 d-flex justify-content-between align-items-start"
                                            >
                                                <div>
                                                    <div className="fw-bold small">
                                                        {item.lyDo ||
                                                            "Cập nhật điểm Apos"}
                                                    </div>
                                                    <small className="text-muted">
                                                        {formatVietnamDateTime(item.ngayTao)}
                                                    </small>
                                                </div>
                                                <span
                                                    className={`badge rounded-pill ${item.soDiem >= 0 ? "bg-success" : "bg-danger"}`}
                                                >
                                                    {item.soDiem >= 0
                                                        ? `+${item.soDiem}`
                                                        : item.soDiem}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="text-muted mb-0">
                                    Chưa có lịch sử điểm Apos.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReports;
