import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { classService } from "../../services/classService";

const AdminClasses = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedClass, setSelectedClass] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        document.title = "Quản lý lớp học | EPU English";
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const data = await classService.getAllClasses(true); // Force reload to get updated count
            setClasses(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách lớp học:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewClass = async (cls) => {
        setSelectedClass(cls);
        setShowModal(true);
        setLoadingStudents(true);
        try {
            const students = await classService.getStudentsInClass(cls.maLop);
            setClassStudents(students);
        } catch (error) {
            console.error("Lỗi khi tải danh sách học viên:", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa học viên này khỏi lớp?"))
            return;

        try {
            await classService.removeStudent(selectedClass.maLop, studentId);
            // Refresh student list
            const students = await classService.getStudentsInClass(
                selectedClass.maLop,
            );
            setClassStudents(students);
            // Refresh class list to update count
            fetchClasses();
        } catch (error) {
            console.error("Lỗi khi xóa học viên:", error);
            alert("Xóa học viên thất bại!");
        }
    };

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    Quản lý lớp học
                </h4>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/classes/create")}
                >
                    Thêm lớp học
                </button>
            </div>

            {/* SEARCH + FILTER */}
            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">Tìm kiếm và lọc</h6>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    className="form-control"
                                    placeholder="Tìm kiếm theo tên lớp hoặc giảng viên..."
                                />
                            </div>
                        </div>

                        <div className="col-md-3">
                            <select className="form-select">
                                <option>Tất cả giáo viên</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select className="form-select">
                                <option>Tất cả khóa học</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select className="form-select">
                                <option>Tất cả trạng thái</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-3 d-flex gap-4">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                            />
                            <label className="form-check-label">
                                Hiện lớp đã ẩn
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                            />
                            <label className="form-check-label">
                                Ẩn lớp đã hoàn thành
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">Danh sách lớp học</h6>

                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên lớp học</th>
                                <th>Thời gian học</th>
                                <th>Giáo viên</th>
                                <th>Số học viên</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : classes.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">
                                        Chưa có lớp học nào.
                                    </td>
                                </tr>
                            ) : (
                                classes.map((cls, index) => (
                                    <tr key={cls.maLop}>
                                        <td>{index + 1}</td>

                                        <td className="fw-semibold">
                                            <i className="bi bi-mortarboard text-primary me-2"></i>
                                            {cls.maLopHienThi}
                                            <br />
                                            <small className="text-muted fw-normal">
                                                {cls.courseName}
                                            </small>
                                        </td>

                                        <td>
                                            <span
                                                className="badge bg-info me-2 text-wrap"
                                                style={{ maxWidth: "200px" }}
                                            >
                                                <i className="bi bi-calendar me-1"></i>
                                                {cls.lichHoc || "Chưa có lịch"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="badge bg-secondary">
                                                {cls.teacherName ||
                                                    "Chưa có giáo viên"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="badge bg-info">
                                                {cls.studentCount || 0}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="badge bg-success">
                                                Đang hoạt động
                                            </span>
                                        </td>

                                        <td>
                                            <div className="btn-group">
                                                <button 
                                                    className="btn btn-light border"
                                                    onClick={() => handleViewClass(cls)}
                                                    title="Xem danh sách học viên"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button
                                                    className="btn btn-light border"
                                                    onClick={() =>
                                                        navigate(
                                                            "/admin/classes/assign-students",
                                                            {
                                                                state: {
                                                                    classId:
                                                                        cls.maLop,
                                                                    className:
                                                                        cls.maLopHienThi,
                                                                },
                                                            },
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-person-plus"></i>
                                                </button>
                                                <button
                                                    className="btn btn-light border"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/classes/edit/${cls.maLop}`,
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn btn-light border text-danger"
                                                    onClick={async () => {
                                                        if (
                                                            window.confirm(
                                                                "Bạn có chắc muốn xóa lớp học này?",
                                                            )
                                                        ) {
                                                            try {
                                                                await classService.deleteClass(
                                                                    cls.maLop,
                                                                );
                                                                fetchClasses();
                                                            } catch (error) {
                                                                alert(
                                                                    "Xóa thất bại!",
                                                                );
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <small className="text-muted">
                        Hiển thị {classes.length} lớp học
                    </small>
                </div>
            </div>

            {/* MODAL DANH SÁCH HỌC VIÊN */}
            {showModal && (
                <div 
                    className="modal fade show d-block" 
                    tabIndex="-1" 
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="fw-bold text-primary">
                                    <i className="bi bi-people-fill me-2"></i>
                                    Danh sách học viên - {selectedClass?.maLopHienThi}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <p className="text-muted small mb-4">
                                    Khóa học: {selectedClass?.courseName} | Giáo viên: {selectedClass?.teacherName || "N/A"}
                                </p>

                                {loadingStudents ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-2 text-muted">Đang tải danh sách học viên...</p>
                                    </div>
                                ) : classStudents.length === 0 ? (
                                    <div className="text-center py-5 bg-light rounded-4">
                                        <i className="bi bi-person-x fs-1 text-muted"></i>
                                        <p className="mt-2 text-muted">Chưa có học viên nào trong lớp này.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Họ tên</th>
                                                    <th>Email</th>
                                                    <th>Trạng thái</th>
                                                    <th>Ngày tham gia</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {classStudents.map((st) => (
                                                    <tr key={st.maHocSinh || st.MaHocSinh}>
                                                        <td>{st.maHocSinh || st.MaHocSinh}</td>
                                                        <td className="fw-semibold">{st.hoTen || st.HoTen}</td>
                                                        <td>{st.email || st.Email}</td>
                                                        <td>
                                                            <span className={`badge ${(st.trangThai || st.TrangThai) === 'Dang_Hoc' ? 'bg-success' : 'bg-secondary'}`}>
                                                                {(st.trangThai || st.TrangThai) === 'Dang_Hoc' ? 'Đang học' : (st.trangThai || st.TrangThai)}
                                                            </span>
                                                        </td>
                                                        <td>{(st.ngayThamGia || st.NgayThamGia) ? new Date(st.ngayThamGia || st.NgayThamGia).toLocaleDateString('vi-VN') : "-"}</td>
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger border-0 rounded-pill"
                                                                onClick={() => handleRemoveStudent(st.maHocSinh || st.MaHocSinh)}
                                                                title="Xóa khỏi lớp"
                                                            >
                                                                <i className="bi bi-person-x-fill"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-0">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary px-4 rounded-pill" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Đóng
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary px-4 rounded-pill"
                                    onClick={() => {
                                        setShowModal(false);
                                        navigate("/admin/classes/assign-students", {
                                            state: {
                                                classId: selectedClass.maLop,
                                                className: selectedClass.maLopHienThi,
                                            },
                                        });
                                    }}
                                >
                                    <i className="bi bi-person-plus me-1"></i>
                                    Thêm học viên
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClasses;
