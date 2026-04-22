import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { useAuth } from '../../context/AuthContext';

const ParentDashboard = () => {
    const { user } = useAuth();
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Bảng điều khiển Phụ huynh | EPU English";
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await parentService.getChildrenDashboard();
                if (data && data.length > 0) {
                    setChildren(data);
                    setSelectedChild(data[0]);
                }
            } catch (err) {
                setError('Không thể tải dữ liệu.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;
    if (!selectedChild) return <div className="p-5 text-center text-muted">Không có thông tin học sinh.</div>;

    return (
        <div className="p-0 animate__animated animate__fadeIn" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            
            {/* TOPBAR: Đã sửa lỗi hiển thị */}
            <div className="d-flex justify-content-between align-items-center mb-5 px-4 pt-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#005197', letterSpacing: '-0.5px' }}>
                        Xin chào, {user?.fullName || "Phụ huynh"}
                    </h2>
                    <p className="text-muted fw-500 mb-0">Theo dõi hành trình học tập của các con.</p>
                </div>
                
                {/* Bộ chọn con - Thiết kế lại để không bị lỗi đè chữ */}
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
                                {selectedChild.tenCon} ({selectedChild.maHocSinh})
                            </span>
                            <i className="bi bi-chevron-down text-primary small"></i>
                        </div>
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
            </div>

            <div className="px-4 pb-5">
                {/* BANNER THÔNG TIN CON */}
                <div className="card border-0 rounded-5 mb-5 shadow-lg overflow-hidden text-white position-relative" 
                     style={{ background: 'linear-gradient(135deg, #005197 0%, #00a8ff 100%)', minHeight: '200px' }}>
                    <div className="card-body p-5 d-flex align-items-center">
                        <div className="row w-100 m-0 align-items-center">
                            <div className="col-lg-8">
                                <h4 className="fw-bold mb-2 opacity-75">{selectedChild.maHocSinh}</h4>
                                <h1 className="fw-800 display-5 mb-2" style={{ letterSpacing: '-1px' }}>{selectedChild.tenCon.toUpperCase()}</h1>
                                <p className="lead fw-500 mb-0 opacity-90">
                                    <i className="bi bi-book me-2"></i>{selectedChild.khoaHoc} | <strong>{selectedChild.lop}</strong>
                                </p>
                            </div>
                            <div className="col-lg-4 text-end d-none d-lg-block">
                                <div className="badge bg-white bg-opacity-25 fs-6 rounded-pill px-4 py-2 border border-white border-opacity-50">
                                    Học phí: {selectedChild.hocPhi}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CHỈ SỐ TIẾN ĐỘ */}
                <div className="row g-4 mb-5">
                    {[
                        { label: 'Tham dự', value: selectedChild.tiendo.thamDu, bg: '#1e88e5', icon: 'bi-patch-check' },
                        { label: 'Hoàn thành WB', value: selectedChild.tiendo.hoanThanhWB, bg: '#ec407a', icon: 'bi-journal-check' },
                        { label: 'Hoàn thành AAR', value: selectedChild.tiendo.hoanThanhAAR, bg: '#e53935', icon: 'bi-book' }
                    ].map((item, idx) => (
                        <div className="col-md-4" key={idx}>
                            <div className="card border-0 rounded-4 shadow-sm h-100 text-white" style={{ background: item.bg }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3"><i className={`bi ${item.icon} fs-4`}></i></div>
                                        <span className="fw-bold text-uppercase small opacity-75">{item.label}</span>
                                    </div>
                                    <h2 className="display-5 fw-bold mb-0">{item.value}%</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    {/* LỊCH HỌC TRONG TUẦN */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-5 p-4 bg-white h-100">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-danger rounded-3 p-2 me-3"><i className="bi bi-calendar2-check text-white"></i></div>
                                <h5 className="fw-bold mb-0 text-dark">Lịch học trong tuần</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="text-muted small border-bottom">
                                        <tr>
                                            <th className="pb-3">MÔN HỌC</th>
                                            <th className="pb-3">THỨ</th>
                                            <th className="pb-3">GIỜ HỌC</th>
                                            <th className="pb-3">PHÒNG</th>
                                        </tr>
                                    </thead>
                                    <tbody className="fw-bold">
                                        {selectedChild.lichHoc.map((item, index) => (
                                            <tr key={index}>
                                                <td className="py-3 text-primary">{item.mon}</td>
                                                <td>{item.thu}</td>
                                                <td>{item.gio}</td>
                                                <td><span className="badge bg-light text-dark border rounded-pill px-3">{item.phong}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* NHẬN XÉT GIÁO VIÊN */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-5 p-4 mb-4" style={{ backgroundColor: '#fff8eb' }}>
                            <h5 className="fw-bold mb-3 text-warning-emphasis">
                                <i className="bi bi-chat-quote-fill me-2"></i>Nhận xét mới nhất
                            </h5>
                            <p className="fst-italic text-dark mb-4" style={{ lineHeight: '1.6', fontSize: '14px' }}>"{selectedChild.nhanXetMoiNhat}"</p>
                            <div className="d-flex align-items-center pt-3 border-top border-warning border-opacity-25">
                                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                    <span className="text-white fw-bold">LA</span>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold small">Ms. Lan Anh</h6>
                                    <small className="text-muted small">Giáo viên chủ nhiệm</small>
                                </div>
                            </div>
                        </div>

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