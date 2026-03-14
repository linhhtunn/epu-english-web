import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const rolePath = user?.role === 'Giao_Vien' ? 'teacher' 
                   : user?.role === 'Hoc_Sinh' ? 'student' 
                   : user?.role === 'Phu_Huynh' ? 'parent' 
                   : 'admin';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const goToProfile = () => {
        navigate(`/${rolePath}/profile`);
    };

    const getNavLinkClass = ({ isActive }) => {
        const baseClass = "nav-link py-3 px-4 fw-bold d-flex align-items-center mb-2 rounded-4 transition-all border-start border-4";
        return isActive 
            ? `${baseClass} bg-primary text-white shadow border-primary active` 
            : `${baseClass} text-secondary border-white hover-bg-light`; 
    };

    return (
        <div className="col-md-3 col-lg-2 bg-white d-flex flex-column vh-100 sticky-top border-end shadow-sm p-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            
            {/* --- PHẦN ĐẦU CỐ ĐỊNH (PROFILE) --- */}
            <div className="flex-shrink-0">
                <div onClick={goToProfile} className="d-flex align-items-center p-3 mb-4 rounded-4 border bg-white shadow-sm position-relative shadow-hover" style={{ transition: '0.3s', cursor: 'pointer', minHeight: '85px' }}>
                    <div className="position-absolute top-0 start-0 h-100 w-2 bg-primary"></div>
                    {(() => {
                        const displayName = user?.hoTen || user?.fullName || user?.name || 'Người dùng';
                        const displayRole = user?.role?.replace('_', ' ').toUpperCase() || 'USER';
                        return (
                            <>
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=005197&color=fff&bold=true`} 
                                    className="rounded-circle me-3 border border-2 border-primary-subtle" 
                                    width="42" height="42" alt="avatar" 
                                />
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                    <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: displayName.length > 15 ? '0.75rem' : '0.85rem', lineHeight: '1.2', wordBreak: 'break-word' }}>
                                        {displayName}
                                    </h6>
                                    <span className="badge bg-info-subtle text-info rounded-pill px-2 py-1" style={{ fontSize: '9px', fontWeight: '800' }}>
                                        {displayRole}
                                    </span>
                                </div>
                            </>
                        );
                    })()}
                </div>

                {rolePath === 'student' && (
                    <div className="mb-4 px-1">
                        <p className="text-muted fw-bold mb-2 ps-1" style={{ fontSize: '10px', letterSpacing: '1px', opacity: 0.8 }}>LỚP HIỆN TẠI</p>
                        <select className="form-select border-light-subtle bg-light rounded-3 py-2 small fw-bold text-dark shadow-none border-2" style={{ fontSize: '12px', cursor: 'pointer' }}>
                            <option>HNI - PRI4 - 0065</option>
                        </select>
                    </div>
                )}
            </div>

            {/* --- PHẦN GIỮA CÓ THỂ CUỘN (MENU) --- */}
            <div className="flex-grow-1 overflow-y-auto custom-scrollbar px-1">
                <ul className="nav nav-pills flex-column shadow-none">
                    <li className="nav-item">
                        <NavLink to={`/${rolePath}`} className={getNavLinkClass} end>
                            <i className="bi bi-grid-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Trang Chủ</span>
                        </NavLink>
                    </li>
                    
                    {/* --- MENU CHO ADMIN --- */}
                    {rolePath === 'admin' && (
                        <>
                            <li className="nav-item"><NavLink to="/admin/functions" className={getNavLinkClass}><i className="bi bi-toggle-on me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý chức năng</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/users" className={getNavLinkClass}><i className="bi bi-person-badge-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý người dùng</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/courses" className={getNavLinkClass}><i className="bi bi-journal-bookmark-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý khóa học</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/classes" className={getNavLinkClass}><i className="bi bi-collection-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý lớp học</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/schedules" className={getNavLinkClass}><i className="bi bi-calendar-check-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Lịch dạy và học</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/content" className={getNavLinkClass}><i className="bi bi-file-earmark-richtext-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Nội dung học tập</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/exams" className={getNavLinkClass}><i className="bi bi-journal-code me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Bài tập - Đề thi</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/attendance" className={getNavLinkClass}><i className="bi bi-clipboard-check-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý Điểm danh</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/reports" className={getNavLinkClass}><i className="bi bi-pie-chart-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Báo cáo và thống kê</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/notifications" className={getNavLinkClass}><i className="bi bi-send-check-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý Thông báo</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/admin/messages" className={getNavLinkClass}><i className="bi bi-chat-dots-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý Nhắn tin</span></NavLink></li>
                        </>
                    )}

                    {/* --- MENU CHO PHỤ HUYNH --- */}
                    {rolePath === 'parent' && (
                        <>
                            <li className="nav-item"><NavLink to="/parent/schedule" className={getNavLinkClass}><i className="bi bi-calendar3 me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Xem lịch học</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/parent/attendance" className={getNavLinkClass}><i className="bi bi-clipboard2-check me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Xem điểm danh</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/parent/messages" className={getNavLinkClass}><i className="bi bi-chat-dots me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý nhắn tin</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/parent/reports" className={getNavLinkClass}><i className="bi bi-bar-chart-line me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Báo cáo thống kê</span></NavLink></li>
                        </>
                    )}

                    {/* --- MENU CHO HỌC SINH --- */}
                    {rolePath === 'student' && (
                        <>
                            <li className="nav-item"><NavLink to="/student/schedule" className={getNavLinkClass}><i className="bi bi-calendar3 me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Quản lý lịch học</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/student/homework-list" className={getNavLinkClass}><i className="bi bi-pencil-square me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Bài tập/bài thi</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/student/reports" className={getNavLinkClass}><i className="bi bi-pie-chart-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Báo cáo thống kê</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/student/homework" className={getNavLinkClass}><i className="bi bi-laptop me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Học chủ động</span></NavLink></li>
                            <li className="nav-item"><NavLink to="/student/notifications" className={getNavLinkClass}><i className="bi bi-bell-fill me-3 fs-5"></i> <span style={{ fontSize: '14px' }}>Thông báo</span></NavLink></li>
                        </>
                    )}

                    {/* --- MENU CHO GIÁO VIÊN --- */}
                    {rolePath === 'teacher' && (
                    <>
                        <li className="nav-item">
                            <NavLink to="/teacher/schedule" className={getNavLinkClass}>
                                <i className="bi bi-calendar-event me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Quản lý lịch dạy</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/classes" className={getNavLinkClass}>
                                <i className="bi bi-people me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Quản lý lớp học</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/exams" className={getNavLinkClass}>
                                <i className="bi bi-file-earmark-text me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Quản lý bài tập - Đề thi</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/grading" className={getNavLinkClass}>
                                <i className="bi bi-pencil-square me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Chấm điểm</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/content" className={getNavLinkClass}>
                                <i className="bi bi-book me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Nội dung học tập</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/messages" className={getNavLinkClass}>
                                <i className="bi bi-chat-dots me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Quản lý nhắn tin</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/attendance" className={getNavLinkClass}>
                                <i className="bi bi-clipboard2-check me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Điểm danh</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/reports" className={getNavLinkClass}>
                                <i className="bi bi-bar-chart-line me-3 fs-5"></i> 
                                <span style={{ fontSize: '14px' }}>Báo cáo và thống kê</span>
                            </NavLink>
                        </li>
                    </>
                )}
                </ul>
            </div>

            {/* --- PHẦN CUỐI CỐ ĐỊNH (LOGOUT) --- */}
            <div className="flex-shrink-0 mt-auto pt-3 border-top">
                <button onClick={handleLogout} className="btn w-100 text-danger fw-bold py-2.5 rounded-4 border-0 shadow-sm d-flex align-items-center justify-content-center btn-logout" style={{ backgroundColor: '#FFF0F0', transition: '0.3s', fontSize: '14px' }}>
                    <i className="bi bi-power me-2 fs-5"></i> Đăng xuất
                </button>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .hover-bg-light:hover { background-color: #f8f9fa !important; color: #005197 !important; }
                .btn-logout:hover { background-color: #ffe0e0 !important; transform: translateY(-2px); }
                .shadow-hover:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
                .nav-link.active { border-left-width: 4px !important; }
            `}</style>
        </div>
    );
};

export default Sidebar;
// ngày chỉnh sửa 10:03 ngày 6/3/2026 nội dung chỉnh sửa: Bổ sung các chức năng trên thanh slidebar cho giống vs file excel