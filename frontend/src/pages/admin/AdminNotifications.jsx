import React, { useMemo, useState } from "react";

const AdminNotifications = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTarget, setFilterTarget] = useState("Tất cả đối tượng");
    const notifications = [];

    const filteredNotifications = useMemo(() => {
        return notifications.filter((item) => {
            const matchSearch = item.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchTarget =
                filterTarget === "Tất cả đối tượng" || item.target === filterTarget;

            return matchSearch && matchTarget;
        });
    }, [filterTarget, notifications, searchTerm]);

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">
                    <i className="bi bi-bell me-2" />
                    Quản lý thông báo
                </h3>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-8">
                            <input
                                className="form-control"
                                placeholder="Tìm kiếm theo tiêu đề thông báo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={filterTarget}
                                onChange={(e) => setFilterTarget(e.target.value)}
                            >
                                <option>Tất cả đối tượng</option>
                                <option>Tất cả</option>
                                <option>Học sinh</option>
                                <option>Giáo viên</option>
                                <option>Phụ huynh</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ngày đăng</th>
                                <th>Tiêu đề</th>
                                <th>Đối tượng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNotifications.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        Frontend đã gỡ toàn bộ dữ liệu thông báo mẫu. Danh sách sẽ
                                        hiển thị khi có API thật từ backend.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
