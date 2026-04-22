import { useEffect } from "react";

function TeacherAttendance() {
    useEffect(() => {
        document.title = "Điểm danh | EPU English";
    }, []);

    return (
        <div className="container-fluid p-4 bg-light min-vh-100">
            <h2 className="fw-bold mb-4">Điểm danh</h2>

            <div className="card shadow-sm border-0 rounded-4">
                <div
                    className="card-body d-flex flex-column justify-content-center align-items-center text-center py-5"
                    style={{ minHeight: "420px" }}
                >
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                        style={{
                            width: "88px",
                            height: "88px",
                            backgroundColor: "#fff3cd",
                            color: "#997404",
                        }}
                    >
                        <i className="bi bi-clipboard-check fs-1" />
                    </div>

                    <h4 className="fw-bold text-dark mb-2">Chưa có dữ liệu điểm danh thật</h4>
                    <p className="text-muted mb-0" style={{ maxWidth: "560px" }}>
                        Danh sách lớp và học sinh mẫu đã được gỡ khỏi frontend. Màn hình này
                        cần tích hợp API backend trước khi giáo viên có thể điểm danh.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TeacherAttendance;
