import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../services/userService";

const AdminCreateUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        hoTen: "",
        soDienThoai: "",
        email: "",
        tenDangNhap: "",
        maVaiTro: "",
        matKhau: "",
        xacNhanMatKhau: "",
        trangThai: "Hoat_Dong",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            userService
                .getUserById(id)
                .then((data) => {
                    setFormData({
                        hoTen: data.hoTen || "",
                        soDienThoai: data.parentProfile?.soDienThoai || "",
                        email: data.email || "",
                        tenDangNhap: data.tenDangNhap || "",
                        maVaiTro: data.roleName || "",
                        matKhau: "",
                        xacNhanMatKhau: "",
                        trangThai: data.trangThai || "Hoat_Dong",
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Lỗi khi tải thông tin người dùng.");
                    setLoading(false);
                });
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]:
                type === "checkbox" ? (checked ? "Hoat_Dong" : "Khoa") : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.matKhau !== formData.xacNhanMatKhau) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        // Default ten dang nhap as email's prefix or phone if email is missing
        const username =
            formData.tenDangNhap ||
            (formData.email
                ? formData.email.split("@")[0]
                : formData.soDienThoai);

        let roleId = 4; // Default to HocSinh
        if (formData.maVaiTro === "Admin") roleId = 1;
        if (formData.maVaiTro === "Giao_Vien") roleId = 2;
        if (formData.maVaiTro === "Phu_Huynh") roleId = 3;

        setLoading(true);
        setError(null);
        try {
            const payload = {
                tenDangNhap: username,
                hoTen: formData.hoTen,
                email: formData.email,
                matKhau: formData.matKhau,
                maVaiTro: roleId,
                trangThai: formData.trangThai,
                soDienThoai: formData.soDienThoai,
            };

            if (isEditMode) {
                await userService.updateUser(id, payload);
                alert("Cập nhật người dùng thành công!");
            } else {
                await userService.createUser(payload);
                alert("Thêm người dùng thành công!");
            }
            navigate("/admin/users");
        } catch (err) {
            // setError(err.response?.data || "Có lỗi xảy ra khi lưu thông tin.");
            const errData = err.response?.data;

            if (typeof errData === "string") {
                setError(errData);
            } else if (errData?.errors) {
                const firstError = Object.values(errData.errors)[0][0];
                setError(firstError);
            } else {
                setError("Có lỗi xảy ra khi lưu thông tin.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-4">
            <button
                className="btn btn-link mb-3"
                onClick={() => navigate("/admin/users")}
            >
                <i className="bi bi-arrow-left"></i> Quay lại
            </button>

            <h4 className="fw-bold text-primary mb-4">
                <i
                    className={
                        isEditMode
                            ? "bi bi-person-fill-gear me-2"
                            : "bi bi-person-plus me-2"
                    }
                ></i>
                {isEditMode
                    ? "Cập nhật thông tin người dùng"
                    : "Thêm người dùng mới"}
            </h4>

            <div className="row">
                {/* FORM */}
                <div className="col-md-7">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <h6 className="text-primary mb-3">
                                    Thông tin cá nhân
                                </h6>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Họ tên *
                                    </label>
                                    <input
                                        className="form-control"
                                        name="hoTen"
                                        value={formData.hoTen}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        className="form-control"
                                        name="soDienThoai"
                                        value={formData.soDienThoai}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">
                                        Địa chỉ Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">
                                        Tên đăng nhập *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="tenDangNhap"
                                        value={formData.tenDangNhap}
                                        onChange={handleChange}
                                        required
                                        disabled={isEditMode}
                                        style={{
                                            backgroundColor: isEditMode
                                                ? "#e9ecef"
                                                : "",
                                        }}
                                    />
                                </div>

                                <h6 className="text-primary mb-3">
                                    Thông tin tài khoản
                                </h6>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Vai trò *
                                    </label>
                                    <select
                                        className="form-select"
                                        name="maVaiTro"
                                        value={formData.maVaiTro}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn vai trò</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Giao_Vien">
                                            Giáo viên
                                        </option>
                                        <option value="Hoc_Sinh">
                                            Học sinh
                                        </option>
                                        <option value="Phu_Huynh">
                                            Phụ huynh
                                        </option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Mật khẩu{" "}
                                        {isEditMode
                                            ? "(để trống nếu không đổi)"
                                            : "*"}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="matKhau"
                                        value={formData.matKhau}
                                        onChange={handleChange}
                                        required={!isEditMode}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Xác nhận mật khẩu{" "}
                                        {isEditMode
                                            ? "(để trống nếu không đổi)"
                                            : "*"}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="xacNhanMatKhau"
                                        value={formData.xacNhanMatKhau}
                                        onChange={handleChange}
                                        required={!isEditMode}
                                    />
                                </div>

                                <div className="form-check mb-4">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="trangThai"
                                        checked={
                                            formData.trangThai === "Hoat_Dong"
                                        }
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">
                                        Kích hoạt tài khoản
                                    </label>
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => navigate("/admin/users")}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        <i
                                            className={
                                                isEditMode
                                                    ? "bi bi-save me-2"
                                                    : "bi bi-person-plus me-2"
                                            }
                                        ></i>
                                        {loading
                                            ? "Đang lưu..."
                                            : isEditMode
                                              ? "Cập nhật"
                                              : "Tạo người dùng"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* PANEL BÊN PHẢI */}

                <div className="col-md-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                            <i
                                className="bi bi-mortarboard-fill text-primary"
                                style={{ fontSize: "60px" }}
                            ></i>

                            <h5 className="mt-3">
                                {isEditMode
                                    ? "Cập nhật tài khoản"
                                    : "Tạo tài khoản mới"}
                            </h5>

                            <p className="text-muted">
                                {isEditMode
                                    ? "Thay đổi thông tin hồ sơ của người dùng. Tên đăng nhập không thể thay đổi."
                                    : "Thêm người dùng vào hệ thống để quản lý, phân quyền và sử dụng các chức năng phù hợp."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateUser;
