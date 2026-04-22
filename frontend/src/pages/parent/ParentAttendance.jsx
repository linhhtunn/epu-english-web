import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Spinner } from "react-bootstrap";
import { parentService } from "../../services/parentService";

const ParentAttendance = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load list of children first
    useEffect(() => {
        document.title = "Điểm danh của con | EPU English";
        const fetchChildren = async () => {
            try {
                setLoading(true);
                const data = await parentService.getChildrenDashboard();
                if (data && data.length > 0) {
                    setChildren(data);
                    setSelectedChild(data[0]);
                } else {
                    setError("Không có thông tin học sinh.");
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                setError("Không thể tải dữ liệu học sinh.");
                setLoading(false);
            }
        };
        fetchChildren();
    }, []);

    // Load attendance when selectedChild changes
    useEffect(() => {
        const fetchAttendance = async () => {
            if (!selectedChild) return;
            
            try {
                setLoading(true);
                const data = await parentService.getAttendance(selectedChild.maHocSinh);
                setAttendanceData(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Không thể tải lịch sử điểm danh.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [selectedChild]);

    const getStatus = (status) => {
        switch (status) {
            case "Co_Mat":
                return <Badge bg="success" className="px-3 py-2 rounded-pill">Có mặt</Badge>;
            case "Di_Muon":
                return <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">Đi muộn</Badge>;
            case "Vang_Co_Phep":
            case "Vang_Khong_Phep":
                return <Badge bg="danger" className="px-3 py-2 rounded-pill">Vắng mặt</Badge>;
            default:
                return <Badge bg="secondary" className="px-3 py-2 rounded-pill">Chưa rõ</Badge>;
        }
    };

    if (error && !selectedChild) {
        return <div className="p-5 text-center text-danger fw-bold">{error}</div>;
    }

    return (
        <Container className="mt-4 animate__animated animate__fadeIn">
            {/* Header with Dropdown */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: "#005197" }}>Lịch sử điểm danh</h4>
                    <p className="text-muted small mb-0">Theo dõi chuyên cần của các con</p>
                </div>

                {children.length > 0 && selectedChild && (
                    <div className="dropdown">
                        <div 
                            className="bg-white px-3 py-2 rounded-pill shadow-sm border d-flex align-items-center gap-3"
                            style={{ cursor: "pointer", minWidth: "250px" }}
                            data-bs-toggle="dropdown"
                        >
                            <div className="d-flex flex-column">
                                <span className="fw-bold text-muted" style={{ fontSize: "10px" }}>ĐANG XEM:</span>
                                <span className="fw-bold text-primary">{selectedChild.tenCon}</span>
                            </div>
                            <i className="bi bi-chevron-down text-primary ms-auto"></i>
                        </div>
                        
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2 p-2">
                            {children.map(child => (
                                <li key={child.maHocSinh}>
                                    <button 
                                        className={`dropdown-item rounded-3 py-2 mb-1 fw-bold ${selectedChild.maHocSinh === child.maHocSinh ? 'bg-primary-subtle text-primary' : ''}`}
                                        onClick={() => setSelectedChild(child)}
                                    >
                                        {child.tenCon} <span className="small opacity-50 fw-normal">({child.maHocSinh})</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : attendanceData ? (
                <>
                    {/* STATS ROW */}
                    <Row className="g-3 mb-4">
                        <Col md={3}>
                            <Card className="text-center p-3 border-0 shadow-sm rounded-4 text-white" style={{ background: "linear-gradient(45deg, #005197, #00a8ff)" }}>
                                <h6 className="opacity-75 mb-1 text-uppercase small fw-bold">Tổng số buổi</h6>
                                <h2 className="fw-bold mb-0">{attendanceData.stats.total}</h2>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center p-3 border-0 shadow-sm rounded-4 text-white" style={{ background: "linear-gradient(45deg, #28a745, #48d667)" }}>
                                <h6 className="opacity-75 mb-1 text-uppercase small fw-bold">Có mặt</h6>
                                <h2 className="fw-bold mb-0">{attendanceData.stats.present}</h2>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center p-3 border-0 shadow-sm rounded-4 text-white" style={{ background: "linear-gradient(45deg, #e74c3c, #ff7675)" }}>
                                <h6 className="opacity-75 mb-1 text-uppercase small fw-bold">Vắng mặt</h6>
                                <h2 className="fw-bold mb-0">{attendanceData.stats.absent}</h2>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-center p-3 border-0 shadow-sm rounded-4 text-dark" style={{ background: "linear-gradient(45deg, #f1c40f, #f39c12)" }}>
                                <h6 className="opacity-75 mb-1 text-uppercase small fw-bold">Đi muộn</h6>
                                <h2 className="fw-bold mb-0">{attendanceData.stats.late}</h2>
                            </Card>
                        </Col>
                    </Row>

                    {/* TABLE */}
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <Table hover className="mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr className="text-uppercase small text-muted">
                                        <th className="py-3 ps-4 border-0">Ngày học</th>
                                        <th className="py-3 border-0">Thời gian</th>
                                        <th className="py-3 border-0">Trạng thái</th>
                                        <th className="py-3 pe-4 border-0">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.history.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">Chưa có bản ghi điểm danh nào.</td>
                                        </tr>
                                    ) : (
                                        attendanceData.history.map((item, index) => (
                                            <tr key={index}>
                                                <td className="ps-4 fw-bold text-dark">{item.date}</td>
                                                <td className="text-muted"><i className="bi bi-clock me-1"></i>{item.time}</td>
                                                <td>{getStatus(item.status)}</td>
                                                <td className="pe-4 fst-italic text-secondary">{item.note || "—"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </>
            ) : null}
        </Container>
    );
};

export default ParentAttendance;