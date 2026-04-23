import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const roleLabels = {
    Admin: "Quản trị viên",
    Giao_Vien: "Giảng viên",
    Hoc_Sinh: "Học sinh",
    Phu_Huynh: "Phụ huynh",
};

const ProfilePage = () => {
    const { user } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        document.title = "Hồ sơ cá nhân | EPU English";
    }, []);

    const displayName = user?.fullName || user?.hoTen || user?.username || "Người dùng";
    const displayRole = roleLabels[user?.role] || user?.role || "Người dùng";
    const displayEmail = user?.email || "Chưa cập nhật";

    return (
        <div className="p-4 animate__animated animate__fadeIn" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    Hồ sơ cá nhân
                </h2>
                <p className="text-muted small mb-0">Xem và quản lý thông tin cá nhân của bạn.</p>
            </div>

            <div className="row g-4">
                {/* Card thông tin chính */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 text-center overflow-hidden">
                        <div style={{ height: "100px", background: "linear-gradient(135deg, #005197, #00a8ff)" }}></div>
                        <div className="card-body pb-4" style={{ marginTop: "-50px" }}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=005197&color=fff&bold=true&size=100`}
                                alt="avatar"
                                className="rounded-circle border border-4 border-white shadow mb-3"
                                width="100"
                                height="100"
                            />
                            <h5 className="fw-bold text-dark mb-1">{displayName}</h5>
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">
                                {displayRole}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card chi tiết */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-dark mb-4">
                                <i className="bi bi-info-circle me-2 text-primary"></i>
                                Thông tin chi tiết
                            </h5>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="bg-light rounded-3 p-3">
                                        <p className="text-muted small mb-1 fw-bold text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px" }}>Họ và tên</p>
                                        <p className="fw-bold text-dark mb-0">{displayName}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light rounded-3 p-3">
                                        <p className="text-muted small mb-1 fw-bold text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px" }}>Email</p>
                                        <p className="fw-bold text-dark mb-0">{displayEmail}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light rounded-3 p-3">
                                        <p className="text-muted small mb-1 fw-bold text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px" }}>Tên người dùng</p>
                                        <p className="fw-bold text-dark mb-0">{user?.username || "Chưa cập nhật"}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light rounded-3 p-3">
                                        <p className="text-muted small mb-1 fw-bold text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px" }}>Vai trò</p>
                                        <p className="fw-bold text-dark mb-0">{displayRole}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-outline-primary rounded-pill px-4 fw-bold"
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    <i className="bi bi-key me-2"></i>
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal đổi mật khẩu (chỉ giao diện) */}
            {showPasswordModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className="bi bi-key-fill me-2 text-primary"></i>
                                    Đổi mật khẩu
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                            </div>
                            <div className="modal-body px-4 py-3">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Mật khẩu hiện tại</label>
                                    <input type="password" className="form-control rounded-3" placeholder="Nhập mật khẩu hiện tại" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Mật khẩu mới</label>
                                    <input type="password" className="form-control rounded-3" placeholder="Nhập mật khẩu mới" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Xác nhận mật khẩu mới</label>
                                    <input type="password" className="form-control rounded-3" placeholder="Nhập lại mật khẩu mới" />
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setShowPasswordModal(false)}>Hủy</button>
                                <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => { alert("Tính năng đổi mật khẩu đang được phát triển."); setShowPasswordModal(false); }}>
                                    Lưu mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
