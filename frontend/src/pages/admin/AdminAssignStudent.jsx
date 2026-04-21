import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userService } from "../../services/userService";
import { classService } from "../../services/classService";

const AdminAssignStudent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { classId, className } = location.state || {};

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (!classId) {
            alert("Không tìm thấy thông tin lớp học!");
            navigate("/admin/classes");
            return;
        }
        fetchStudents();
    }, [classId, navigate]);

    const fetchStudents = async () => {
        try {
            const users = await userService.getAllUsers();
            // Filter for Hoc_Sinh
            const studentUsers = users.filter((u) => u.roleName === "Hoc_Sinh");
            setStudents(studentUsers);
        } catch (error) {
            console.error("Lỗi khi tải danh sách học viên", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStudent = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((s) => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleAssign = async () => {
        if (selected.length === 0) return;

        let successCount = 0;
        for (const userId of selected) {
            try {
                await classService.assignStudent(classId, userId);
                successCount++;
            } catch (error) {
                console.error(`Lỗi khi gán học sinh ${userId}`, error);
            }
        }
        alert(
            `Đã gán thành công ${successCount}/${selected.length} học viên vào lớp!`,
        );
        setSelected([]);
    };

    return (
        <div className="p-4">
            {/* BACK */}
            <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <h3 className="fw-bold mb-4">
                👥 Gán học viên cho lớp: {className || "N/A"}
            </h3>

            <div className="row">
                {/* LEFT SIDE */}
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <h5>Danh sách học viên có sẵn</h5>

                                <div>
                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() =>
                                            setSelected(
                                                students.map(
                                                    (s) => s.maNguoiDung,
                                                ),
                                            )
                                        }
                                    >
                                        Chọn tất cả
                                    </button>

                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => setSelected([])}
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                </div>
                            </div>

                            {/* SEARCH */}
                            <input
                                className="form-control mb-3"
                                placeholder="Tìm kiếm học viên..."
                            />

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Học sinh</th>
                                        <th>Email</th>
                                        <th>Điện thoại</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center"
                                            >
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : students.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center"
                                            >
                                                Không có học viên nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((s) => (
                                            <tr key={s.maNguoiDung}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.includes(
                                                            s.maNguoiDung,
                                                        )}
                                                        onChange={() =>
                                                            toggleStudent(
                                                                s.maNguoiDung,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>{s.hoTen}</td>
                                                <td>{s.email}</td>
                                                <td>{s.tenDangNhap}</td>
                                                <td>
                                                    <span className="badge bg-success">
                                                        {s.trangThai ||
                                                            "Hoạt động"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="mb-3">Tổng quan học viên</h5>

                            <p className="text-muted">
                                {selected.length === 0
                                    ? "Chưa có học viên nào được gán"
                                    : `${selected.length} học viên được chọn`}
                            </p>

                            <button
                                className="btn btn-primary w-100"
                                onClick={handleAssign}
                                disabled={selected.length === 0}
                            >
                                Gán {selected.length} học viên vào lớp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAssignStudent;
