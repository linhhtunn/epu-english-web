import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const STATUS_MAP = {
    Co_Mat:  { label: "Có mặt",  bg: "success" },
    Vang:    { label: "Vắng mặt", bg: "danger" },
    Di_Muon: { label: "Đi muộn", bg: "warning" },
};

const ParentAttendance = () => {
    const { user } = useAuth();
    const parentId = user?.profileId;

    const [children, setChildren] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Load danh sách con
    useEffect(() => {
        if (!parentId) return;
        api.get(`/Parent/${parentId}/children`).then(res => {
            setChildren(res.data);
            if (res.data.length > 0) setSelectedStudentId(res.data[0].maHocSinh);
        }).catch(() => setError("Không thể tải danh sách học sinh."));
    }, [parentId]);

    // 2. Load điểm danh khi chọn học sinh
    useEffect(() => {
        if (!selectedStudentId) return;
        setLoading(true);
        setError(null);
        api.get(`/Parent/student/${selectedStudentId}/attendance`)
            .then(res => setAttendance(res.data))
            .catch(() => setError("Không thể tải lịch sử điểm danh."))
            .finally(() => setLoading(false));
    }, [selectedStudentId]);

    const selectedChild = children.find(c => c.maHocSinh === selectedStudentId);

    return (
        <div className="container-fluid p-4" style={{ background: "#f5f7fb", minHeight: "100vh" }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>
                        <i className="bi bi-calendar-check-fill me-2 text-primary"></i>Lịch sử điểm danh
                    </h2>
                    <p className="text-muted small mb-0">Theo dõi sự có mặt của con trong các buổi học.</p>
                </div>

                {/* Bộ chọn con */}
                {children.length > 1 && (
                    <div>
                        <label className="text-muted small fw-semibold me-2">Học sinh:</label>
                        <select
                            className="form-select form-select-sm d-inline-block rounded-3"
                            style={{ width: 'auto' }}
                            value={selectedStudentId || ''}
                            onChange={e => setSelectedStudentId(Number(e.target.value))}
                        >
                            {children.map(c => (
                                <option key={c.maHocSinh} value={c.maHocSinh}>{c.hoTen}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* STATS */}
            {attendance && (
                <div className="row g-3 mb-4">
                    {[
                        { label: "Tổng buổi", value: attendance.tongBuoi, color: "#005197", bg: "#e8f0fe" },
                        { label: "Có mặt", value: attendance.coMat, color: "#198754", bg: "#e8f5e9" },
                        { label: "Vắng mặt", value: attendance.vang, color: "#dc3545", bg: "#fdecea" },
                        { label: "Đi muộn", value: attendance.diMuon, color: "#f39c12", bg: "#fff8e1" },
                    ].map((s, i) => (
                        <div className="col-6 col-md-3" key={i}>
                            <div className="card border-0 rounded-4 shadow-sm text-center py-3" style={{ background: "white" }}>
                                <div className="fw-bold fs-3" style={{ color: s.color }}>{s.value}</div>
                                <div className="text-muted small">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TABLE */}
            <div className="card border-0 rounded-4 shadow-sm overflow-hidden">
                <div className="card-header bg-white border-0 py-3 px-4">
                    <h6 className="fw-bold mb-0">
                        Chi tiết điểm danh {selectedChild ? `— ${selectedChild.hoTen}` : ''}
                    </h6>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="text-muted mt-3 small">Đang tải...</p>
                    </div>
                ) : error ? (
                    <div className="p-4">
                        <div className="alert alert-danger rounded-3">{error}</div>
                    </div>
                ) : !attendance || attendance.chiTiet?.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-calendar-x fs-2 d-block mb-2 opacity-40"></i>
                        <p>Chưa có dữ liệu điểm danh.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                                    <th className="border-0 ps-4">Ngày học</th>
                                    <th className="border-0">Lớp</th>
                                    <th className="border-0">Thời gian</th>
                                    <th className="border-0 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.chiTiet.map((item, index) => {
                                    const st = STATUS_MAP[item.trangThai];
                                    return (
                                        <tr key={index}>
                                            <td className="ps-4 fw-semibold">
                                                {new Date(item.ngayHoc + 'T00:00:00').toLocaleDateString('vi-VN', { 
                                                    day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short'
                                                })}
                                            </td>
                                            <td>
                                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2">
                                                    {item.className}
                                                </span>
                                            </td>
                                            <td className="text-muted">{item.gioBatDau} – {item.gioKetThuc}</td>
                                            <td className="text-center">
                                                <span className={`badge bg-${st?.bg ?? 'secondary'} rounded-pill px-3`}>
                                                    {st?.label ?? item.trangThai}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentAttendance;