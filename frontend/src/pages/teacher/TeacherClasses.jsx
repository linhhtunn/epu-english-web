import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { teacherService } from "../../services/teacherService";

const TeacherClasses = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentProgress, setStudentProgress] = useState(null);
    const [loadingStudent, setLoadingStudent] = useState(false);

    useEffect(() => {
        document.title = "Quản lý lớp học | EPU English";
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await teacherService.getClasses();
            setClasses(data);
            // Default: Show all classes (selectedClass = null)
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                    "Không thể tải danh sách lớp học.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleViewStudent = async (studentId) => {
        try {
            setLoadingStudent(true);
            const data = await teacherService.getStudentProgress(studentId, selectedClass.maLop);
            setStudentProgress(data);
            setSelectedStudent(true); // Open modal
        } catch (err) {
            console.error(err);
            alert("Không thể tải thông tin chi tiết học viên.");
        } finally {
            setLoadingStudent(false);
        }
    };

    return (
        <div
            className="p-4 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            <style>
                {`
                .hover-shadow:hover {
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
                    transform: translateY(-2px);
                }
                .transition {
                    transition: all 0.3s ease;
                }
                `}
            </style>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Quản lý lớp học</h3>
                    <p className="text-muted mb-0">
                        Danh sách các lớp được phân công giảng dạy.
                    </p>
                </div>

                {classes.length > 0 && (
                    <select
                        className="form-select w-auto rounded-pill border-2 px-3 fw-bold"
                        value={selectedClass?.maLop || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                                setSelectedClass(null);
                            } else {
                                const cls = classes.find(
                                    (c) => c.maLop === parseInt(val),
                                );
                                setSelectedClass(cls || null);
                            }
                        }}
                    >
                        <option value="">Tất cả lớp</option>
                        {classes.map((cls) => (
                            <option key={cls.maLop} value={cls.maLop}>
                                {cls.maLopHienThi} - {cls.courseName}
                            </option>
                        ))}
                    </select>
                )}
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
                        onClick={fetchClasses}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                    >
                        Thử lại
                    </button>
                </div>
            ) : classes.length === 0 ? (
                <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                    <i className="bi bi-inboxes fs-1 text-muted"></i>
                    <p className="text-muted mt-3 mb-0">
                        Bạn chưa được phân công lớp nào.
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-3 col-6">
                            <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-primary text-white">
                                <small className="text-uppercase opacity-75 fw-bold">
                                    Tổng số lớp
                                </small>
                                <h3 className="fw-bold mb-0 mt-2">
                                    {classes.length}
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="card border-0 rounded-4 shadow-sm h-100 p-3 bg-success text-white">
                                <small className="text-uppercase opacity-75 fw-bold">
                                    Tổng học viên
                                </small>
                                <h3 className="fw-bold mb-0 mt-2">
                                    {classes.reduce(
                                        (sum, c) => sum + (c.studentCount || 0),
                                        0,
                                    )}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Class list */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Mã lớp</th>
                                        <th>Khóa học</th>
                                        <th>Cấp độ</th>
                                        <th>Lịch học</th>
                                        <th>Sĩ số</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes
                                        .filter(cls => !selectedClass || cls.maLop === selectedClass.maLop)
                                        .map((cls) => (
                                        <tr
                                            key={cls.maLop}
                                            className={
                                                selectedClass?.maLop ===
                                                cls.maLop
                                                    ? "table-primary"
                                                    : ""
                                            }
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setSelectedClass(cls)
                                            }
                                        >
                                            <td className="ps-4">
                                                <div className="fw-bold text-primary">
                                                    {cls.maLopHienThi}
                                                </div>
                                            </td>
                                            <td className="fw-bold">
                                                {cls.courseName}
                                            </td>
                                            <td>
                                                <span className="badge bg-info-subtle text-info-emphasis rounded-pill px-3 py-2">
                                                    {cls.level}
                                                </span>
                                            </td>
                                            <td className="small text-muted">
                                                {cls.lichHoc}
                                            </td>
                                            <td>
                                                <span className="badge bg-dark rounded-pill px-3 py-2">
                                                    {cls.studentCount} học viên
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detail card for selected class */}
                    {selectedClass && (
                        <div className="card border-0 shadow-sm rounded-4 mt-4">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h5 className="fw-bold mb-0">
                                        <i className="bi bi-collection text-primary me-2"></i>
                                        {selectedClass.maLopHienThi}
                                    </h5>
                                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                                        {selectedClass.courseName}
                                    </span>
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="bg-light rounded-3 p-3">
                                            <div
                                                className="small text-muted fw-bold text-uppercase"
                                                style={{ fontSize: 10 }}
                                            >
                                                Cấp độ
                                            </div>
                                            <div className="fw-bold">
                                                {selectedClass.level}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="bg-light rounded-3 p-3">
                                            <div
                                                className="small text-muted fw-bold text-uppercase"
                                                style={{ fontSize: 10 }}
                                            >
                                                Lịch học
                                            </div>
                                            <div className="fw-bold">
                                                {selectedClass.lichHoc}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="bg-light rounded-3 p-3">
                                            <div
                                                className="small text-muted fw-bold text-uppercase"
                                                style={{ fontSize: 10 }}
                                            >
                                                Sĩ số
                                            </div>
                                            <div className="fw-bold text-primary">
                                                {selectedClass.studentCount} học
                                                viên
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Danh sách học viên */}
                                <div className="mt-4">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center">
                                        <i className="bi bi-people text-primary me-2"></i>
                                        Danh sách học viên ({selectedClass.students?.length || 0})
                                    </h6>
                                    <div className="row g-3">
                                        {selectedClass.students?.length > 0 ? (
                                            selectedClass.students.map((student) => (
                                                <div 
                                                    key={student.id} 
                                                    className="col-md-6 col-lg-4"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleViewStudent(student.id)}
                                                >
                                                    <div className="d-flex align-items-center p-2 border rounded-3 bg-white shadow-sm hover-shadow transition">
                                                        <img 
                                                            src={student.avatar ? (student.avatar.startsWith('http') ? student.avatar : `http://localhost:5153${student.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                                                            alt={student.name}
                                                            className="rounded-circle me-2"
                                                            style={{ width: 35, height: 35, objectFit: 'cover' }}
                                                        />
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <div className="fw-bold text-truncate" style={{ fontSize: '0.85rem' }}>{student.name}</div>
                                                            <div className="d-flex align-items-center">
                                                                <span className={`badge ${student.status === 'Dang_Hoc' ? 'bg-success' : 'bg-secondary'} rounded-pill`} style={{ fontSize: '0.6rem' }}>
                                                                    {student.status === 'Dang_Hoc' ? 'Đang học' : 'Khác'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12 text-center py-3 text-muted small">
                                                Chưa có học viên nào trong lớp này.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Student Detail Modal */}
            {selectedStudent && studentProgress && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="fw-bold">Chi tiết học viên</h5>
                                <button type="button" className="btn-close" onClick={() => { setSelectedStudent(null); setStudentProgress(null); }}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <img 
                                        src={studentProgress.info.avatar ? (studentProgress.info.avatar.startsWith('http') ? studentProgress.info.avatar : `http://localhost:5153${studentProgress.info.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProgress.info.name)}&background=random`} 
                                        alt={studentProgress.info.name}
                                        className="rounded-circle me-3"
                                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h4 className="fw-bold mb-0">{studentProgress.info.name}</h4>
                                        <p className="text-muted mb-0 small">
                                            <i className="bi bi-envelope me-1"></i>{studentProgress.info.email} • 
                                            <i className="bi bi-star-fill text-warning ms-2 me-1"></i>{studentProgress.info.apos} Apos
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="p-3 rounded-4 border bg-light h-100">
                                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                <i className="bi bi-calendar-check text-primary me-2"></i>
                                                Điểm danh (Lớp hiện tại)
                                            </h6>
                                            <div className="d-flex align-items-end justify-content-between">
                                                <div>
                                                    <div className="display-6 fw-bold text-primary">{studentProgress.attendance.rate}%</div>
                                                    <div className="small text-muted">Tỉ lệ chuyên cần</div>
                                                </div>
                                                <div className="text-end small">
                                                    <div>Có mặt: <span className="fw-bold">{studentProgress.attendance.present}</span>/{studentProgress.attendance.total}</div>
                                                    <div>Vắng: <span className="fw-bold text-danger">{studentProgress.attendance.absent}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 rounded-4 border bg-light h-100">
                                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                                                <i className="bi bi-journal-check text-success me-2"></i>
                                                Bài tập & Điểm số
                                            </h6>
                                            <div className="d-flex align-items-end justify-content-between">
                                                <div>
                                                    <div className="display-6 fw-bold text-success">{studentProgress.homework.averageScore}</div>
                                                    <div className="small text-muted">Điểm trung bình</div>
                                                </div>
                                                <div className="text-end small">
                                                    <div>Đã nộp: <span className="fw-bold">{studentProgress.homework.submitted}</span>/{studentProgress.homework.assigned}</div>
                                                    <div className="text-muted small">Tỉ lệ nộp: {studentProgress.homework.assigned > 0 ? Math.round(studentProgress.homework.submitted/studentProgress.homework.assigned*100) : 0}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h6 className="fw-bold mb-3">5 bài nộp gần nhất</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover border-top">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Ngày nộp</th>
                                                <th>Điểm</th>
                                                <th>Nhận xét</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentProgress.homework.recentGrades?.length > 0 ? (
                                                studentProgress.homework.recentGrades.map((g, idx) => (
                                                    <tr key={idx}>
                                                        <td>{g.date}</td>
                                                        <td>
                                                            <span className={`fw-bold ${g.score >= 8 ? 'text-success' : g.score >= 5 ? 'text-primary' : 'text-danger'}`}>
                                                                {g.score ?? 'Chưa chấm'}
                                                            </span>
                                                        </td>
                                                        <td className="small text-muted">{g.comment || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="3" className="text-center py-3 text-muted">Chưa có bài nộp nào</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-dark rounded-pill px-4" onClick={() => { setSelectedStudent(null); setStudentProgress(null); }}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherClasses;
