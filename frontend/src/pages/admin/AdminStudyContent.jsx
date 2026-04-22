import React from "react";
import { BookOpen } from "lucide-react";

const AdminStudyContent = () => {
    return (
        <div className="container-fluid p-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3 d-flex align-items-center justify-content-center">
                    <BookOpen size={32} />
                </div>
                <div>
                    <h2 className="mb-1 fw-bold text-dark">Nội dung học tập</h2>
                    <span className="text-muted small">
                        Dữ liệu mẫu đã được gỡ khỏi frontend
                    </span>
                </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4">
                <div
                    className="card-body d-flex flex-column justify-content-center align-items-center text-center py-5"
                    style={{ minHeight: "320px" }}
                >
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                        style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                        }}
                    >
                        <i className="bi bi-folder2-open fs-1" />
                    </div>

                    <h4 className="fw-bold text-dark mb-2">Chưa có dữ liệu thật</h4>
                    <p className="text-muted mb-0" style={{ maxWidth: "560px" }}>
                        Danh sách tài liệu và chương học không còn dùng dữ liệu giả. Màn
                        hình này cần API backend trước khi hiển thị nội dung.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminStudyContent;
