import React, { useState, useEffect } from 'react';
import ScheduleTable from '../../components/ScheduleTable';
import { useAuth } from '../../context/AuthContext';
import { teacherService } from '../../services/teacherService';

const TeacherSchedule = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getWeekRange = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(start.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return {
            fromDate: formatDate(monday),
            toDate: formatDate(sunday),
        };
    };

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const { fromDate, toDate } = getWeekRange(currentDate);
                const data = await teacherService.getSchedule(fromDate, toDate);
                setClasses(data); 
            } catch (err) {
                console.error("Lỗi khi tải lịch dạy:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [currentDate]);

    const changeWeek = (amount) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (amount * 7));
        setCurrentDate(newDate);
    };

    return (
        <div className="p-4 animate__animated animate__fadeIn">
            {/* --- HEADER --- */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1 text-uppercase" style={{ fontSize: '24px' }}>
                        Lịch dạy cá nhân
                    </h2>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3">
                            Mã: {user?.profileId || user?.username || "N/A"}
                        </span>
                        <p className="text-muted mb-0">
                            Giảng viên: <span className="fw-bold text-dark">{user?.fullName || "N/A"}</span>
                        </p>
                    </div>
                </div>
                
                {/* --- CỤM ĐIỀU HƯỚNG THỜI GIAN (COPY TỪ PHỤ HUYNH) --- */}
                <div className="d-flex align-items-center gap-2">
                    {/* Nút Hiện tại */}
                    <button 
                        className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" 
                        onClick={() => setCurrentDate(new Date())}
                        style={{ backgroundColor: '#007bff', border: 'none', height: '40px' }}
                    >
                        Hiện tại
                    </button>
                    
                    {/* Nút Trở về / Tiếp */}
                    <div className="d-flex align-items-center border rounded-pill bg-white px-2 shadow-sm" style={{ height: '40px' }}>
                        <button 
                            className="btn btn-link text-dark p-0 px-2 text-decoration-none small fw-medium" 
                            onClick={() => changeWeek(-1)}
                        >
                            <i className="bi bi-chevron-left small"></i> Trở về
                        </button>
                        <div className="vr mx-1 my-2" style={{ opacity: 0.2 }}></div>
                        <button 
                            className="btn btn-link text-dark p-0 px-2 text-decoration-none small fw-medium" 
                            onClick={() => changeWeek(1)}
                        >
                            Tiếp <i className="bi bi-chevron-right small"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- BẢNG LỊCH DẠY --- */}
            <div className="card border-0 shadow-sm rounded-5 overflow-hidden">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="d-flex justify-content-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <ScheduleTable data={classes} currentViewDate={currentDate} />
                    )}
                </div>
            </div>

            {/* --- GHI CHÚ --- */}
            <div className="mt-4 p-3 bg-light rounded-4 border-start border-primary border-4 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="bi bi-info-circle-fill text-primary"></i>
                    <small className="text-muted fw-bold text-uppercase">Lưu ý:</small>
                </div>
                <span className="small text-dark italic">
                    * Thầy/Cô vui lòng thực hiện điểm danh trong vòng 15 phút đầu giờ học để hệ thống ghi nhận dữ liệu chính xác.
                </span>
            </div>
        </div>
    );
};

export default TeacherSchedule;