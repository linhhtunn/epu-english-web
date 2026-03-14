import React from 'react';
import { useAuth } from '../../context/AuthContext'; 
// XÓA Sidebar import ở đây vì MainLayout đã có rồi

const Dashboard = () => {
    const { user } = useAuth();

    return (
        /* 1. Xóa class vh-100 và container-fluid vì MainLayout đã bao bọc vùng này rồi.
           2. Thêm class animate__animated để giữ hiệu ứng mượt mà.
        */
        <div className="p-0 animate__animated animate__fadeIn" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            
            {/* TOPBAR */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#005197', letterSpacing: '-0.5px' }}>
                        Xin chào, {user?.fullName || user?.username || 'Học viên'}
                    </h2>
                    <p className="text-muted fw-500 mb-0">Hãy bắt đầu học!</p>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-pill shadow-sm border border-warning-subtle d-flex align-items-center">
                        <span className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px' }}>
                            <i className="bi bi-star-fill text-white small"></i>
                        </span>
                        <span className="fw-bold text-dark">92 Apos</span>
                    </div>
                    <div className="bg-white p-2 rounded-circle shadow-sm border d-flex align-items-center justify-content-center position-relative" style={{ width: '45px', height: '45px', cursor: 'pointer' }}>
                        <i className="bi bi-bell-fill text-primary fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"></span>
                    </div>
                </div>
            </div>

            {/* BANNER HIỆN ĐẠI */}
            <div className="card border-0 rounded-5 mb-5 shadow-lg overflow-hidden text-white" 
                 style={{ background: 'linear-gradient(135deg, #005197 0%, #00a8ff 100%)', minHeight: '280px' }}>
                <div className="card-body p-0 d-flex align-items-center">
                    <div className="row w-100 m-0 align-items-center text-white">
                        <div className="col-lg-7 p-5">
                            <h4 className="fw-bold mb-2 opacity-75">EPU ENGLISH</h4>
                            <h1 className="fw-800 display-5 mb-3">HÃY TẬN HƯỞNG NÀO</h1>
                            <p className="lead fw-500 mb-4 opacity-90">ĐI 1 NGÀY ĐÀNG HỌC 1 SÀNG KHÔN</p>
                            <button className="btn btn-warning btn-lg rounded-pill px-5 fw-bold text-white shadow">TẢI NGAY</button>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                            <i className="bi bi-rocket-takeoff position-absolute opacity-25" style={{ fontSize: '200px', right: '20px', top: '-100px' }}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS SECTION */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden text-white" style={{ background: '#1e88e5' }}>
                        <div className="card-body p-4 position-relative text-white">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3"><i className="bi bi-patch-check fs-4"></i></div>
                                <span className="fw-bold text-uppercase small opacity-75 text-white">Tham dự</span>
                            </div>
                            <h2 className="display-5 fw-bold mb-0 text-white">94%</h2>
                            <i className="bi bi-graph-up-arrow position-absolute bottom-0 end-0 p-3 opacity-25" style={{ fontSize: '3rem' }}></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden text-white" style={{ background: '#ec407a' }}>
                        <div className="card-body p-4 position-relative text-white">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3"><i className="bi bi-journal-check fs-4"></i></div>
                                <span className="fw-bold text-uppercase small opacity-75 text-white">Hoàn thành WB</span>
                            </div>
                            <h2 className="display-5 fw-bold mb-0 text-white">100%</h2>
                            <i className="bi bi-check-all position-absolute bottom-0 end-0 p-3 opacity-25" style={{ fontSize: '3rem' }}></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 rounded-4 shadow-sm h-100 overflow-hidden text-white" style={{ background: '#e53935' }}>
                        <div className="card-body p-4 position-relative text-white">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3"><i className="bi bi-book fs-4"></i></div>
                                <span className="fw-bold text-uppercase small opacity-75 text-white">Hoàn thành AAR</span>
                            </div>
                            <h2 className="display-5 fw-bold mb-0 text-white">75%</h2>
                            <i className="bi bi-award position-absolute bottom-0 end-0 p-3 opacity-25" style={{ fontSize: '3rem' }}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* LỚP HỌC HÔM NAY */}
            <div className="mb-4">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-danger rounded-3 p-2 me-3"><i className="bi bi-calendar2-check text-white"></i></div>
                    <h5 className="fw-bold mb-0 text-dark">Lớp học hôm nay</h5>
                </div>
                
                <div className="bg-white rounded-5 py-5 shadow-sm border border-dashed border-2 text-center">
                    <img src="https://active.apollo.edu.vn/static/media/robot-empty.6200236a.png" alt="robot" style={{ width: '150px' }} className="mb-4" />
                    <h5 className="fw-bold text-dark">Hiện chưa có lớp học nào</h5>
                    <p className="text-muted">Hãy quay lại sau hoặc xem lịch học chi tiết nhé!</p>
                    <button className="btn btn-outline-primary rounded-pill px-4 fw-bold mt-2">XEM LỊCH HỌC</button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;