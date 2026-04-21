import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const roleColor = (role) => {
        if (role === "Admin") return "bg-danger";
        if (role === "Giao_Vien") return "bg-success";
        if (role === "Hoc_Sinh") return "bg-info";
        return "bg-secondary";
    };

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">
                    <i className="bi bi-people me-2"></i>
                    Quản lý người dùng
                </h3>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/users/create")}
                >
                    <i className="bi bi-person-plus me-2"></i>
                    Thêm người dùng
                </button>
            </div>

            {/* FILTER */}

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
                            />
                        </div>

                        <div className="col-md-3">
                            <select className="form-select">
                                <option>Tất cả vai trò</option>
                                <option>Admin</option>
                                <option>Teacher</option>
                                <option>Student</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select className="form-select">
                                <option>Tất cả trạng thái</option>
                                <option>Hoạt động</option>
                                <option>Tạm khóa</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE */}

            <div className="card">
                <div className="card-body">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-4">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-4">
                                        Chưa có người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user.maNguoiDung}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-person-circle me-2 fs-4"></i>
                                                <div>
                                                    <div>{user.hoTen}</div>
                                                    <small className="text-muted">
                                                        {user.tenDangNhap}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span
                                                className={`badge ${roleColor(user.roleName)}`}
                                            >
                                                {user.roleName}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${user.trangThai === "Hoat_Dong" ? "bg-success" : "bg-secondary"}`}
                                            >
                                                {user.trangThai === "Hoat_Dong"
                                                    ? "Hoạt động"
                                                    : user.trangThai}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm me-2"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/users/edit/${user.maNguoiDung}`,
                                                    )
                                                }
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={async () => {
                                                    if (
                                                        window.confirm(
                                                            "Bạn có chắc muốn xóa người dùng này?",
                                                        )
                                                    ) {
                                                        try {
                                                            await userService.deleteUser(
                                                                user.maNguoiDung,
                                                            );
                                                            fetchUsers();
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

export default AdminUsers;
