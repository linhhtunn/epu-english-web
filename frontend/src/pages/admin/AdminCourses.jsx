import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";

const AdminCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await courseService.getAllCourses();
            setCourses(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khóa học:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="fw-bold mb-4">Quản lý khóa học</h2>

            <div className="card shadow-sm rounded-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                        <h5>Danh sách khóa học</h5>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/admin/courses/create")}
                        >
                            Thêm khóa học
                        </button>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên khóa học</th>
                                <th>Mô tả</th>
                                <th>Thời lượng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Chưa có khóa học nào.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.maKhoaHoc}>
                                        <td>{course.maKhoaHoc}</td>
                                        <td>{course.tenKhoaHoc}</td>
                                        <td>{course.moTa || "-"}</td>
                                        <td>{course.capDo || "-"}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/courses/edit/${course.maKhoaHoc}`,
                                                    )
                                                }
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={async () => {
                                                    if (
                                                        window.confirm(
                                                            "Bạn có chắc muốn xóa khóa học này?",
                                                        )
                                                    ) {
                                                        try {
                                                            await courseService.deleteCourse(
                                                                course.maKhoaHoc,
                                                            );
                                                            fetchCourses();
                                                        } catch (error) {
                                                            alert(
                                                                "Xóa thất bại!",
                                                            );
                                                        }
                                                    }
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;

