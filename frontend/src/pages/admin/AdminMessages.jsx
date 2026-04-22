import React from "react";

const AdminMessages = () => {
    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center bg-white rounded-4 shadow-sm p-5 text-center"
            style={{ minHeight: "80vh", border: "1px solid #e9ecef" }}
        >
            <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                style={{
                    width: "88px",
                    height: "88px",
                    backgroundColor: "#eef4ff",
                    color: "#0d6efd",
                }}
            >
                <i className="bi bi-chat-dots fs-1" />
            </div>

            <h3 className="fw-bold text-dark mb-2">Tin nhắn nội bộ</h3>
            <p className="text-muted mb-0" style={{ maxWidth: "560px" }}>
                Dữ liệu mẫu ở màn hình này đã được gỡ khỏi frontend. Màn hình sẽ hiển thị
                lại khi luồng nhắn tin được kết nối API thật từ backend.
            </p>
        </div>
    );
};

export default AdminMessages;
