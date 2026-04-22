import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../services/courseService";

export default function AdminCreateCourse() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);

    const [course, setCourse] = useState({
        name: "",
        level: "",
        price: "",
        unit: "",
        duration: "",
        description: "",
    });

    useEffect(() => {
        document.title = isEditMode ? "Cập nhật khóa học | EPU English" : "Thêm khóa học | EPU English";
        if (isEditMode) {
            setLoading(true);
            courseService
                .getCourseById(id)
                .then((data) => {
                    setCourse((prev) => ({
                        ...prev,
                        name: data.tenKhoaHoc || "",
                        level: data.capDo || "",
                        description: data.moTa || "",
                    }));
                })
                .catch((err) => alert("Lỗi tải khóa học"))
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                tenKhoaHoc: course.name,
                capDo: course.level,
                moTa: course.description,
            };

            if (isEditMode) {
                await courseService.updateCourse(id, payload);
                alert("Cập nhật khóa học thành công!");
            } else {
                await courseService.createCourse(payload);
                alert("Thêm khóa học thành công!");
            }
            navigate("/admin/courses");
        } catch (error) {
            alert(error.response?.data || "Có lỗi xảy ra khi tạo khóa học.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-4">
            {/* BACK */}
            <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <h3 className="mb-4">
                📚 {isEditMode ? "Cập nhật khóa học" : "Tạo khóa học mới"}
            </h3>

            <div className="row">
                {/* FORM */}
                <div className="col-md-6">
                    <div className="card p-4">
                        <h5 className="mb-3">Thông tin khóa học</h5>

                        <form onSubmit={handleSubmit}>
                            {/* NAME */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Tên khóa học *
                                </label>

                                <input
                                    className="form-control"
                                    placeholder="Ví dụ: IELTS Foundation"
                                    value={course.name}
                                    onChange={(e) =>
                                        setCourse({
                                            ...course,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* LEVEL */}

                            <div className="mb-3">
                                <label className="form-label">Trình độ *</label>

                                <select
                                    className="form-select"
                                    value={course.level}
                                    onChange={(e) =>
                                        setCourse({
                                            ...course,
                                            level: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Chọn trình độ</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">
                                        Intermediate
                                    </option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            {/* PRICE */}

                            <div className="mb-3">
                                <label className="form-label">Học phí</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ví dụ: 5000000"
                                    value={course.price}
                                    onChange={(e) =>
                                        setCourse({
                                            ...course,
                                            price: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* DURATION */}

                            <div className="mb-3 ">
                                <label className="form-label">
                                    Đơn vị thời gian
                                </label>

                                <select
                                    className="form-select"
                                    value={course.unit}
                                    onChange={(e) =>
                                        setCourse({
                                            ...course,
                                            unit: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Chọn đơn vị</option>
                                    <option value="Giờ">Giờ</option>
                                    <option value="Tuần">Tuần</option>
                                    <option value="Tiết">Tiết</option>
                                </select>
                            </div>

                            <div className="mb-3 ">
                                <label className="form-label ">
                                    Thời lượng (tuần)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ví dụ: 12"
                                    value={course.duration}
                                    onChange={(e) =>
                                        setCourse({
                                            ...course,
                                            duration: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            {/* DESCRIPTION */}

                            <div className="mb-3">
                                <label className="form-label">Mô tả</label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Nhập mô tả khóa học..."
                                    value={course.description}
                                    onChange={(e) =>
                                        setCourse({
                                            ...course,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() => navigate(-1)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    📚{" "}
                                    {loading
                                        ? "Đang lưu..."
                                        : isEditMode
                                          ? "Cập nhật"
                                          : "Tạo khóa học"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT PANEL */}

                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div style={{ fontSize: "70px" }}>📖</div>

                        <h5 className="mt-3">
                            {isEditMode
                                ? "Cập nhật khóa học"
                                : "Tạo khóa học mới"}
                        </h5>

                        <p className="text-muted">
                            Thêm hoặc tùy chỉnh thông tin khóa học để quản lý
                            chương trình đào tạo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
