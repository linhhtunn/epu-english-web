import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getChildren } from '../../services/parentService';

const ParentDashboard = () => {
    const { user } = useAuth();
    const parentId = user?.profileId;

    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!parentId) return;
        setLoading(true);
        getChildren(parentId)
            .then(res => {
                setChildren(res.data);
                if (res.data.length > 0) setSelectedChild(res.data[0]);
            })
            .catch(() => setError('Không thể tải dữ liệu. Vui lòng thử lại.'))
            .finally(() => setLoading(false));
    }, [parentId]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" />
                <p className="text-muted small">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-4">
            <div className="alert alert-danger rounded-4 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </div>
        </div>
    );

    if (children.length === 0) return (
        <div className="p-4 text-center py-5 text-muted">
            <i className="bi bi-people fs-1 d-block mb-3 opacity-40"></i>
            <h5>Chưa có thông tin học sinh</h5>
            <p>Vui lòng liên hệ trung tâm để được hỗ trợ.</p>
        </div>
    );

    const activeClass = selectedChild?.lopHoc?.[0] ?? null;

    return (
        <div className="p-0 animate__animated animate__fadeIn" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            
            {/* TOPBAR */}
            <div className="d-flex justify-content-between align-items-center mb-5 px-4 pt-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#005197', letterSpacing: '-0.5px' }}>
                        Xin chào, <span>{user?.fullName || 'Phụ huynh'}</span>
                    </h2>
                    <p className="text-muted fw-500 mb-0">Theo dõi hành trình học tập của các con.</p>
                </div>
                
                {/* Bộ chọn con */}
                {children.length > 1 && (
                    <div className="dropdown">
                        <div 
                            className="bg-white px-3 py-2 rounded-4 shadow-sm border border-2 d-flex flex-column justify-content-center"
                            style={{ minWidth: '250px', cursor: 'pointer' }}
                            data-bs-toggle="dropdown"
                        >
                            <label className="fw-bold text-muted d-block mb-0" style={{ fontSize: '10px', pointerEvents: 'none' }}>
                                ĐANG XEM DỮ LIỆU CỦA:
                            </label>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-primary" style={{ fontSize: '14px' }}>
                                    {selectedChild?.hoTen}
                                </span>
                                <i className="bi bi-chevron-down text-primary small"></i>
                            </div>
                        </div>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2 p-2">
                            {children.map(child => (
                                <li key={child.maHocSinh}>
                                    <button 
                                        className={`dropdown-item rounded-3 py-2 mb-1 fw-bold ${selectedChild?.maHocSinh === child.maHocSinh ? 'bg-primary-subtle text-primary' : ''}`}
                                        onClick={() => setSelectedChild(child)}
                                    >
                                        {child.hoTen}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="px-4 pb-5">
                {/* BANNER THÔNG TIN CON */}
                <div className="card border-0 rounded-5 mb-5 shadow-lg overflow-hidden text-white position-relative" 
                     style={{ background: 'linear-gradient(135deg, #005197 0%, #00a8ff 100%)', minHeight: '200px' }}>
                    <div className="card-body p-5 d-flex align-items-center">
                        <div className="row w-100 m-0 align-items-center">
                            <div className="col-lg-8">
                                <h4 className="fw-bold mb-2 opacity-75">HS#{selectedChild?.maHocSinh}</h4>
                                <h1 className="fw-800 display-5 mb-2" style={{ letterSpacing: '-1px' }}>
                                    {selectedChild?.hoTen?.toUpperCase()}
                                </h1>
                                {activeClass && (
                                    <p className="lead fw-500 mb-0 opacity-90">
                                        <i className="bi bi-book me-2"></i>
                                        {activeClass.tenKhoaHoc || '—'} | <strong>{activeClass.maLopHienThi}</strong>
                                    </p>
                                )}
                            </div>
                            <div className="col-lg-4 text-end d-none d-lg-block">
                                <div className="badge bg-white bg-opacity-25 fs-6 rounded-pill px-4 py-2 border border-white border-opacity-50">
                                    <i className="bi bi-star-fill me-2 text-warning"></i>
                                    {selectedChild?.diemTongApos ?? 0} Apos
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* LỊCH HỌC TRONG TUẦN */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-5 p-4 bg-white h-100">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-danger rounded-3 p-2 me-3"><i className="bi bi-calendar2-check text-white"></i></div>
                                <h5 className="fw-bold mb-0 text-dark">Lớp học đang tham gia</h5>
                            </div>
                            {selectedChild?.lopHoc?.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="text-muted small border-bottom">
                                            <tr>
                                                <th className="pb-3">LỚP HỌC</th>
                                                <th className="pb-3">KHÓA HỌC</th>
                                                <th className="pb-3">LỊCH HỌC</th>
                                            </tr>
                                        </thead>
                                        <tbody className="fw-bold">
                                            {selectedChild.lopHoc.map((lop, index) => (
                                                <tr key={index}>
                                                    <td className="py-3 text-primary">{lop.maLopHienThi}</td>
                                                    <td>{lop.tenKhoaHoc || '—'}</td>
                                                    <td><span className="badge bg-light text-dark border rounded-pill px-3">{lop.lichHoc || '—'}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-calendar-x fs-2 d-block mb-2 opacity-40"></i>
                                    <p>Chưa tham gia lớp học nào.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* HỖ TRỢ */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-5 p-4 bg-dark text-white">
                            <h6 className="fw-bold mb-3"><i className="bi bi-headset me-2 text-warning"></i>Hỗ trợ phụ huynh</h6>
                            <p className="small opacity-75 mb-4">Bạn cần trao đổi thêm về lộ trình học của con?</p>
                            <button className="btn btn-warning w-100 rounded-pill fw-bold text-white mb-3 py-2 shadow-sm">GỌI HOTLINE</button>
                            <button className="btn btn-outline-light w-100 rounded-pill py-2 small">LIÊN HỆ GIÁO VỤ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;