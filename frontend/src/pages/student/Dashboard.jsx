import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const studentId = user?.profileId;

    const [todayClasses, setTodayClasses] = useState([]);
    const [attendanceSummary, setAttendanceSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;

        // Lấy thông tin điểm danh của học sinh
        api.get(`/Parent/student/${studentId}/attendance`)
            .then(res => setAttendanceSummary(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [studentId]);

    const attendancePct = attendanceSummary && attendanceSummary.tongBuoi > 0
        ? Math.round((attendanceSummary.coMat / attendanceSummary.tongBuoi) * 100)
        : null;

    return (
        <div className="p-0 animate__animated animate__fadeIn" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            
            {/* TOPBAR */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#005197', letterSpacing: '-0.5px' }}>
                        Xin chào, {user?.fullName || user?.hoTen || 'Học viên'}
                    </h2>
                    <p className="text-muted fw-500 mb-0">Hãy bắt đầu học!</p>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-pill shadow-sm border border-warning-subtle d-flex align-items-center">
                        <span className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px' }}>
                            <i className="bi bi-star-fill text-white small"></i>
                        </span>
                        <span className="fw-bold text-dark">
                            {loading ? '—' : `${user?.diemTongApos ?? 0} Apos`}
                        </span>
                    </div>
                    <div className="bg-white p-2 rounded-circle shadow-sm border d-flex align-items-center justify-content-center position-relative" style={{ width: '45px', height: '45px', cursor: 'pointer' }}>
                        <i className="bi bi-bell-fill text-primary fs-5"></i>
                    </div>
                </div>
            </div>

            {/* BANNER */}
            <div className="card border-0 rounded-5 mb-5 shadow-lg overflow-hidden text-white" 
                 style={{ background: 'linear-gradient(135deg, #005197 0%, #00a8ff 100%)', minHeight: '240px' }}>
                <div className="card-body p-0 d-flex align-items-center">
                    <div className="row w-100 m-0 align-items-center text-white">
                        <div className="col-lg-7 p-5">
                            <h4 className="fw-bold mb-2 opacity-75">EPU ENGLISH</h4>
                            <h1 className="fw-800 display-5 mb-3">HÃY TẬN HƯỞNG NÀO</h1>
                            <p className="lead fw-500 mb-4 opacity-90">ĐI 1 NGÀY ĐÀNG HỌC 1 SÀNG KHÔN</p>
                            <Link to="/student/schedule" className="btn btn-warning btn-lg rounded-pill px-5 fw-bold text-white shadow">
                                XEM LỊCH HỌC
                            </Link>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                            <i className="bi bi-rocket-takeoff position-absolute opacity-25" style={{ fontSize: '200px', right: '20px', top: '-100px' }}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS — chỉ hiển thị khi có dữ liệu thực */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="text-muted mt-2 small">Đang tải thống kê...</p>
                </div>
            ) : attendanceSummary && attendanceSummary.tongBuoi > 0 ? (
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden text-white" style={{ background: '#1e88e5' }}>
                            <div className="card-body p-4 position-relative text-white">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3"><i className="bi bi-patch-check fs-4"></i></div>
                                    <span className="fw-bold text-uppercase small opacity-75 text-white">Tỷ lệ tham dự</span>
                                </div>
                                <h2 className="display-5 fw-bold mb-0 text-white">{attendancePct}%</h2>
                                <small className="opacity-60">{attendanceSummary.coMat}/{attendanceSummary.tongBuoi} buổi</small>
                                <i className="bi bi-graph-up-arrow position-absolute bottom-0 end-0 p-3 opacity-25" style={{ fontSize: '3rem' }}></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden text-white" style={{ background: '#ec407a' }}>
                            <div className="card-body p-4 position-relative text-white">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3"><i className="bi bi-journal-check fs-4"></i></div>
                                    <span className="fw-bold text-uppercase small opacity-75 text-white">Buổi có mặt</span>
                                </div>
                                <h2 className="display-5 fw-bold mb-0 text-white">{attendanceSummary.coMat}</h2>
                                <i className="bi bi-check-all position-absolute bottom-0 end-0 p-3 opacity-25" style={{ fontSize: '3rem' }}></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden text-white" style={{ background: '#e53935' }}>
                            <div className="card-body p-4 position-relative text-white">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3"><i className="bi bi-calendar-x fs-4"></i></div>
                                    <span className="fw-bold text-uppercase small opacity-75 text-white">Buổi vắng mặt</span>
                                </div>
                                <h2 className="display-5 fw-bold mb-0 text-white">{attendanceSummary.vang}</h2>
                                <i className="bi bi-award position-absolute bottom-0 end-0 p-3 opacity-25" style={{ fontSize: '3rem' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* THÔNG BÁO KHI CHƯA CÓ DỮ LIỆU */}
            <div className="mb-4">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-danger rounded-3 p-2 me-3"><i className="bi bi-calendar2-check text-white"></i></div>
                    <h5 className="fw-bold mb-0 text-dark">Lớp học hôm nay</h5>
                </div>
                
                <div className="bg-white rounded-5 py-5 shadow-sm border text-center">
                    <img src="https://active.apollo.edu.vn/static/media/robot-empty.6200236a.png" alt="robot" style={{ width: '150px' }} className="mb-4" />
                    <h5 className="fw-bold text-dark">Hiện chưa có lớp học nào</h5>
                    <p className="text-muted">Hãy quay lại sau hoặc xem lịch học chi tiết nhé!</p>
                    <Link to="/student/schedule" className="btn btn-outline-primary rounded-pill px-4 fw-bold mt-2">XEM LỊCH HỌC</Link>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;