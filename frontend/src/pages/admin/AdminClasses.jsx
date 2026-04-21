import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { classService } from "../../services/classService";

const AdminClasses = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const data = await classService.getAllClasses();
            setClasses(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách lớp học:", error);
        } finally {
            setLoading(false);
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
                                                -
                                            </span>
                                        </td>

                                        <td>
                                            <span className="badge bg-success">
                                                Đang hoạt động
                                            </span>
                                        </td>

                                        <td>
                                            <div className="btn-group">
                                                <button className="btn btn-light border">
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
        </div>
    );
};

export default AdminClasses;
