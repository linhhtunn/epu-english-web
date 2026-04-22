import React, { useEffect, useState } from "react";
import { studentService } from "../../services/studentService";

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await studentService.getNotifications();
            setNotifications(response.items || []);
            setUnread(response.unread || 0);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Không thể tải thông báo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Thông báo | EPU English";
        loadNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await studentService.markNotificationAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((item) =>
                    item.notificationId === notificationId
                        ? { ...item, daDoc: true }
                        : item,
                ),
            );
            setUnread((prev) => (prev > 0 ? prev - 1 : 0));
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                    "Không thể cập nhật trạng thái thông báo.",
            );
        }
    };

    const markAllAsRead = async () => {
        const unreadItems = notifications.filter((item) => item.daDoc !== true);
        try {
            await Promise.all(
                unreadItems.map((item) =>
                    studentService.markNotificationAsRead(item.notificationId),
                ),
            );
            setNotifications((prev) =>
                prev.map((item) => ({ ...item, daDoc: true })),
            );
            setUnread(0);
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                    "Không thể đánh dấu tất cả thông báo đã đọc.",
            );
        }
    };

    return (
        <div
            className="p-4 animate__animated animate__fadeIn"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-bold mb-1">Thông báo</h3>
                    <p className="text-muted mb-0">
                        Bạn có <strong>{unread}</strong> thông báo chưa đọc.
                    </p>
                </div>

                <button
                    onClick={markAllAsRead}
                    className="btn btn-outline-primary rounded-pill px-4 fw-bold"
                    disabled={unread === 0}
                >
                    Đánh dấu tất cả đã đọc
                </button>
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
                        onClick={loadNotifications}
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                    >
                        Thử lại
                    </button>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                    <i className="bi bi-bell-slash fs-1 text-muted"></i>
                    <p className="text-muted mt-3 mb-0">
                        Hiện chưa có thông báo nào.
                    </p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {notifications.map((item) => (
                        <div
                            key={item.notificationId}
                            className={`card border-0 rounded-4 shadow-sm ${item.daDoc ? "bg-light" : "bg-white border-start border-4 border-primary"}`}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start gap-3">
                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            {item.title || "Thông báo hệ thống"}
                                        </h6>
                                        <p className="small text-muted mb-2">
                                            {item.content ||
                                                "Không có nội dung."}
                                        </p>
                                        <div className="d-flex flex-wrap gap-3 small text-muted">
                                            <span>
                                                <i className="bi bi-person me-1"></i>
                                                {item.sender || "Hệ thống"}
                                            </span>
                                            <span>
                                                <i className="bi bi-tag me-1"></i>
                                                {item.category || "Chung"}
                                            </span>
                                            <span>
                                                <i className="bi bi-clock me-1"></i>
                                                {item.sentAt
                                                    ? new Date(
                                                          item.sentAt,
                                                      ).toLocaleString("vi-VN")
                                                    : "---"}
                                            </span>
                                        </div>
                                    </div>

                                    {item.daDoc ? (
                                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                                            Đã đọc
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                markAsRead(item.notificationId)
                                            }
                                            className="btn btn-sm btn-primary rounded-pill px-3 fw-bold"
                                        >
                                            Đánh dấu đã đọc
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentNotifications;
