import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teacherService } from '../../services/teacherService';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const data = await teacherService.getDashboard();
                setDashboardData(data);
            } catch (err) {
                console.error("Lỗi khi tải dashboard giáo viên", err);
                setError("Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    const rawStats = dashboardData?.stats || { totalClasses: 0, totalStudents: 0, teachingHours: 0, supportRequests: 0 };
    const todayClasses = dashboardData?.todayClasses || [];

    const stats = [
        { label: 'Lớp đang dạy', value: String(rawStats.totalClasses).padStart(2, '0'), bg: 'linear-gradient(135deg, #005197 0%, #0081f1 100%)', icon: 'bi-door-open' },
        { label: 'Số lượng học sinh', value: String(rawStats.totalStudents), bg: 'linear-gradient(135deg, #d63384 0%, #f8bbd0 100%)', icon: 'bi-people' },
        { label: 'Giờ dạy tháng này', value: `${rawStats.teachingHours}h`, bg: 'linear-gradient(135deg, #198754 0%, #20c997 100%)', icon: 'bi-clock-history' },
        { label: 'Yêu cầu hỗ trợ', value: String(rawStats.supportRequests).padStart(2, '0'), bg: 'linear-gradient(135deg, #f39c12 0%, #fbc531 100%)', icon: 'bi-chat-dots' }
    ];

    return (
        <div className="animate__animated animate__fadeIn p-1">
            
            {/* --- HEADER: CHÀO MỪNG & THÔNG BÁO --- */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">
                        Xin chào, <span className="text-primary">{user?.fullName || 'Thầy/Cô'}</span>
                    </h2>
                    <p className="text-muted mb-0 small">
                        Bạn có <span className="fw-bold text-primary">{todayClasses.length} lớp dạy</span> chiều tối nay.
                    </p>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-white p-2 px-3 rounded-4 shadow-sm border d-flex align-items-center d-none d-md-flex">
                        <div className="bg-primary-subtle p-2 rounded-3 me-3">
                            <i className="bi bi-calendar-check text-primary"></i>
                        </div>
                        <div className="text-start">
                            <span className="small text-muted d-block fw-bold" style={{fontSize: '9px', letterSpacing: '1px'}}>HỌC KỲ</span>
                            <span className="fw-bold text-dark" style={{fontSize: '14px'}}>HK1 <span className="text-primary">2026</span></span>
                        </div>
                    </div>

                    <div className="position-relative cursor-pointer hover-up bg-white shadow-sm border rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '45px', height: '45px', cursor: 'pointer' }}>
                        <i className="bi bi-bell-fill text-secondary fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{fontSize: '10px'}}>
                            3
                        </span>
                    </div>
                </div>
            </div>

            {/* --- THỐNG KÊ NHANH (STATS CARDS) --- */}
            <div className="row g-4 mb-4">
                {stats.map((item, idx) => (
                    <div className="col-md-3 col-6" key={idx}>
                        <div className="card border-0 rounded-5 shadow-sm h-100 text-white p-1 shadow-hover" style={{ background: item.bg, transition: '0.3s' }}>
                            <div className="card-body p-3 p-lg-4">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="bg-white bg-opacity-25 p-2 rounded-4 me-3 d-none d-lg-block">
                                        <i className={`bi ${item.icon} fs-5`}></i>
                                    </div>
                                    <span className="fw-bold text-uppercase small opacity-90" style={{fontSize: '10px'}}>{item.label}</span>
                                </div>
                                <h3 className="fw-bold mb-0">{item.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* --- LỊCH DẠY CHI TIẾT --- */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-white h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                            <h5 className="fw-bold mb-0 text-dark">Lịch dạy hôm nay</h5>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 small fw-bold">Hiện tại</span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="bg-light text-muted">
                                    <tr style={{fontSize: '11px'}}>
                                        <th className="border-0 rounded-start-4 ps-4 ps-lg-5">LỚP HỌC</th>
                                        <th className="border-0">MÔN HỌC</th>
                                        <th className="border-0">THỜI GIAN</th>
                                        <th className="border-0 text-center">PHÒNG</th>
                                        <th className="border-0 rounded-end-4 text-end pe-4 pe-lg-5">THAO TÁC</th>
                                    </tr>
                                </thead>
                                <tbody className="fw-medium text-dark">
                                    {todayClasses.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">Không có lịch dạy hôm nay.</td>
                                        </tr>
                                    ) : todayClasses.map(cls => (
                                        <tr key={cls.id} className="transition-all">
                                            <td className="ps-4 ps-lg-5 py-3">
                                                <div className="fw-bold text-dark">{cls.code}</div>
                                                <div className="text-muted" style={{fontSize: '10px'}}>{cls.type}</div>
                                            </td>
                                            <td className="text-primary fw-bold">{cls.subject}</td>
                                            <td>
                                                <i className="bi bi-clock me-1 text-muted"></i>
                                                {cls.time}
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-normal">{cls.room}</span>
                                            </td>
                                            <td className="text-end pe-4 pe-lg-5">
                                                <button className="btn btn-primary rounded-pill btn-sm px-3 shadow-sm hover-up fw-bold" style={{fontSize: '12px'}}>
                                                    <i className="bi bi-person-check me-1"></i> Điểm danh
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- NHẮC NHỞ & TRAO ĐỔI --- */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-dark text-white mb-4">
                        <h6 className="fw-bold mb-4 text-warning d-flex align-items-center">
                            <i className="bi bi-lightning-charge-fill me-2"></i> Nhắc nhở công việc
                        </h6>
                        <div className="mb-3 d-flex align-items-start">
                            <div className="bg-success rounded-circle p-1 me-2 mt-1"></div>
                            <p className="small mb-0 opacity-75">
                                Điểm danh lớp <span className="text-info fw-bold">HNI-PRI4-0065</span>.
                            </p>
                        </div>
                        <div className="d-flex align-items-start">
                            <div className="bg-warning rounded-circle p-1 me-2 mt-1"></div>
                            <p className="small mb-0 opacity-75">Gửi báo cáo học tập tuần cho Phụ huynh.</p>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-primary-subtle border border-primary border-opacity-10">
                        <h6 className="fw-bold text-primary mb-3">Trao đổi mới nhất</h6>
                        <div className="bg-white rounded-4 p-3 mb-3 shadow-sm">
                            <div className="d-flex align-items-center mb-2">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=Parent&background=005197&color=fff&bold=true`} 
                                    className="rounded-circle me-2" 
                                    width="28" height="28" alt="parent"
                                />
                                <span className="fw-bold small text-dark">Phụ huynh em Minh Anh</span>
                            </div>
                            <p className="text-muted mb-0" style={{fontSize: '11px', lineHeight: '1.4'}}>
                                "Thầy ơi, nhờ thầy kiểm tra giúp em bài tập về nhà của cháu ạ..."
                            </p>
                        </div>
                        <button className="btn btn-primary w-100 rounded-pill py-2 small fw-bold shadow-sm transition-all hover-up">
                            <i className="bi bi-chat-dots me-2"></i> Phản hồi ngay
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .shadow-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .hover-up:hover {
                    transform: scale(1.05);
                    transition: 0.2s;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                table tr:hover {
                    background-color: #f8f9fa;
                }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
};

export default TeacherDashboard;