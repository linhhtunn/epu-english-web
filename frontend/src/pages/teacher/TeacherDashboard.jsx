import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSessions } from '../../services/attendanceService';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const teacherId = user?.profileId;

    const [todayClasses, setTodayClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);

    // Thống kê tính từ dữ liệu thực
    const [stats, setStats] = useState([
        { label: 'Lớp hôm nay', value: '—', bg: 'linear-gradient(135deg, #005197 0%, #0081f1 100%)', icon: 'bi-door-open' },
        { label: 'Đã điểm danh', value: '—', bg: 'linear-gradient(135deg, #198754 0%, #20c997 100%)', icon: 'bi-person-check' },
        { label: 'Chờ điểm danh', value: '—', bg: 'linear-gradient(135deg, #f39c12 0%, #fbc531 100%)', icon: 'bi-hourglass-split' },
        { label: 'Tổng học sinh', value: '—', bg: 'linear-gradient(135deg, #d63384 0%, #f8bbd0 100%)', icon: 'bi-people' }
    ]);

    useEffect(() => {
        if (!teacherId) return;

        const today = new Date().toISOString().split('T')[0];
        setLoadingClasses(true);

        getSessions(teacherId, today)
            .then(res => {
                const sessions = res.data;
                setTodayClasses(sessions);
                const done = sessions.filter(s => s.daDiemDanh).length;
                setStats([
                    { label: 'Lớp hôm nay', value: sessions.length, bg: 'linear-gradient(135deg, #005197 0%, #0081f1 100%)', icon: 'bi-door-open' },
                    { label: 'Đã điểm danh', value: done, bg: 'linear-gradient(135deg, #198754 0%, #20c997 100%)', icon: 'bi-person-check' },
                    { label: 'Chờ điểm danh', value: sessions.length - done, bg: 'linear-gradient(135deg, #f39c12 0%, #fbc531 100%)', icon: 'bi-hourglass-split' },
                    { label: 'Tổng học sinh', value: '—', bg: 'linear-gradient(135deg, #d63384 0%, #f8bbd0 100%)', icon: 'bi-people' }
                ]);
            })
            .catch(() => {})
            .finally(() => setLoadingClasses(false));
    }, [teacherId]);

    return (
        <div className="animate__animated animate__fadeIn p-1">
            
            {/* --- HEADER: CHÀO MỪNG & THÔNG BÁO --- */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">
                        Xin chào, <span className="text-primary">{user?.fullName || user?.hoTen || 'Thầy/Cô'}</span>
                    </h2>
                    <p className="text-muted mb-0 small">
                        {loadingClasses
                            ? 'Đang tải lịch dạy...'
                            : todayClasses.length > 0
                                ? <>Bạn có <span className="fw-bold text-primary">{todayClasses.length} lớp dạy</span> hôm nay.</>
                                : 'Hôm nay bạn không có lớp dạy.'}
                    </p>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-white p-2 px-3 rounded-4 shadow-sm border d-flex align-items-center d-none d-md-flex">
                        <div className="bg-primary-subtle p-2 rounded-3 me-3">
                            <i className="bi bi-calendar-check text-primary"></i>
                        </div>
                        <div className="text-start">
                            <span className="small text-muted d-block fw-bold" style={{fontSize: '9px', letterSpacing: '1px'}}>HÔM NAY</span>
                            <span className="fw-bold text-dark" style={{fontSize: '14px'}}>
                                {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="position-relative cursor-pointer hover-up bg-white shadow-sm border rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '45px', height: '45px', cursor: 'pointer' }}>
                        <i className="bi bi-bell-fill text-secondary fs-5"></i>
                    </div>
                </div>
            </div>

            {/* --- THỐNG KÊ NHANH --- */}
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
                                <h3 className="fw-bold mb-0">
                                    {loadingClasses ? <span className="spinner-border spinner-border-sm opacity-75" /> : item.value}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* --- LỊCH DẠY HÔM NAY --- */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-white h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                            <h5 className="fw-bold mb-0 text-dark">Lịch dạy hôm nay</h5>
                            <Link to="/teacher/schedule" className="btn btn-sm btn-primary rounded-pill px-3" style={{fontSize: '12px'}}>
                                <i className="bi bi-calendar3 me-1"></i>Xem lịch đầy đủ
                            </Link>
                        </div>
                        <div className="table-responsive">
                            {loadingClasses ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status" />
                                    <p className="text-muted mt-3 small">Đang tải...</p>
                                </div>
                            ) : todayClasses.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-calendar-x fs-2 d-block mb-2 opacity-40"></i>
                                    <p>Hôm nay không có lớp học nào.</p>
                                </div>
                            ) : (
                                <table className="table table-hover align-middle">
                                    <thead className="bg-light text-muted">
                                        <tr style={{fontSize: '11px'}}>
                                            <th className="border-0 rounded-start-4 ps-4">LỚP HỌC</th>
                                            <th className="border-0">KHÓA HỌC</th>
                                            <th className="border-0">THỜI GIAN</th>
                                            <th className="border-0 text-center">TRẠNG THÁI</th>
                                            <th className="border-0 rounded-end-4 text-end pe-4">THAO TÁC</th>
                                        </tr>
                                    </thead>
                                    <tbody className="fw-medium text-dark">
                                        {todayClasses.map(cls => (
                                            <tr key={cls.maBuoiHoc}>
                                                <td className="ps-4 py-3">
                                                    <div className="fw-bold text-dark">{cls.className}</div>
                                                </td>
                                                <td className="text-primary fw-semibold">{cls.courseName || '—'}</td>
                                                <td>
                                                    <i className="bi bi-clock me-1 text-muted"></i>
                                                    {cls.gioBatDau} – {cls.gioKetThuc}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge rounded-pill px-3 ${cls.daDiemDanh ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-15 text-warning'}`}>
                                                        {cls.daDiemDanh ? '✓ Đã điểm danh' : '⏳ Chưa điểm danh'}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <Link to="/teacher/attendance" className="btn btn-primary rounded-pill btn-sm px-3 shadow-sm" style={{fontSize: '12px'}}>
                                                        <i className="bi bi-person-check me-1"></i>Điểm danh
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- NHẮC NHỞ --- */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-dark text-white mb-4">
                        <h6 className="fw-bold mb-4 text-warning d-flex align-items-center">
                            <i className="bi bi-lightning-charge-fill me-2"></i>Nhắc nhở công việc
                        </h6>
                        <div className="d-flex align-items-start mb-3">
                            <div className="bg-warning rounded-circle p-1 me-2 mt-1" style={{width: '8px', height: '8px', flexShrink: 0}}></div>
                            <p className="small mb-0 opacity-75">Thực hiện điểm danh trong vòng 15 phút đầu giờ học.</p>
                        </div>
                        {todayClasses.filter(c => !c.daDiemDanh).length > 0 && (
                            <div className="d-flex align-items-start">
                                <div className="bg-danger rounded-circle p-1 me-2 mt-1" style={{width: '8px', height: '8px', flexShrink: 0}}></div>
                                <p className="small mb-0 opacity-75">
                                    Còn <span className="text-warning fw-bold">{todayClasses.filter(c => !c.daDiemDanh).length} lớp</span> chưa được điểm danh hôm nay.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-primary-subtle border border-primary border-opacity-10">
                        <h6 className="fw-bold text-primary mb-3">Truy cập nhanh</h6>
                        <div className="d-grid gap-2">
                            <Link to="/teacher/attendance" className="btn btn-primary rounded-pill fw-semibold">
                                <i className="bi bi-person-check me-2"></i>Điểm danh
                            </Link>
                            <Link to="/teacher/schedule" className="btn btn-outline-primary rounded-pill">
                                <i className="bi bi-calendar3 me-2"></i>Xem lịch dạy
                            </Link>
                        </div>
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
            `}</style>
        </div>
    );
};

export default TeacherDashboard;