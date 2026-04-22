import React, { useState, useEffect } from 'react';
import ScheduleTable from '../../components/ScheduleTable';
import { parentService } from '../../services/parentService'; 

const ParentSchedule = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

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
        document.title = "Lịch học của con | EPU English";
        const fetchChildren = async () => {
            try {
                const data = await parentService.getChildrenDashboard();
                if (data && data.length > 0) {
                    setChildren(data);
                    setSelectedChild(data[0]);
                }
            } catch (err) {
                console.error("Không tải được danh sách học sinh", err);
            }
        };
        fetchChildren();
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedChild?.maHocSinh) return;
            try {
                setLoading(true);
                const { fromDate, toDate } = getWeekRange(currentDate);
                const data = await parentService.getChildSchedule(selectedChild.maHocSinh, fromDate, toDate);
                setFilteredSchedule(data);
            } catch (err) {
                console.error("Lỗi khi tải lịch học", err);
                setFilteredSchedule([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSchedule();
    }, [selectedChild, currentDate]);

    const changeWeek = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (offset * 7));
        setCurrentDate(newDate);
    };

    return (
        <div className="container-fluid p-4 animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-4" style={{ fontSize: '24px', color: '#333' }}>
                Lịch học, lịch thi theo tuần
            </h2>

            <div className="d-flex justify-content-between align-items-center mb-4">
                
                {/* 1. Bộ chọn con */}
                <div className="dropdown">
                    <button 
                        className="btn btn-outline-primary dropdown-toggle rounded-pill fw-bold px-3 border-2 d-flex align-items-center shadow-sm" 
                        type="button" 
                        data-bs-toggle="dropdown"
                        style={{ height: '40px', fontSize: '14px' }}
                    >
                        <span className="text-uppercase me-1" style={{ fontSize: '11px', opacity: 0.8 }}>Đang xem lịch của:</span> 
                        <span className="text-dark">
                            {selectedChild ? `${selectedChild.tenCon} (${selectedChild.maHocSinh})` : "Đang tải..."}
                        </span>
                    </button>
                    <ul className="dropdown-menu shadow border-0 mt-2 rounded-4">
                        {children.map(child => (
                            <li key={child.maHocSinh}>
                                <button 
                                    className="dropdown-item py-2 fw-medium" 
                                    onClick={() => setSelectedChild(child)}
                                >
                                    {child.tenCon} - {child.maHocSinh}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* 2. Cụm điều hướng thời gian */}
                <div className="d-flex align-items-center gap-2">
                    <button 
                        className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" 
                        onClick={() => setCurrentDate(new Date())}
                        style={{ backgroundColor: '#007bff', border: 'none', height: '40px' }}
                    >
                        Hiện tại
                    </button>
                    
                    <div className="d-flex align-items-center border rounded-pill bg-white px-2 shadow-sm" style={{ height: '40px' }}>
                        <button className="btn btn-link text-dark p-0 px-2 text-decoration-none small fw-medium" onClick={() => changeWeek(-1)}>
                            <i className="bi bi-chevron-left small"></i> Trở về
                        </button>
                        <div className="vr mx-1 my-2" style={{ opacity: 0.2 }}></div>
                        <button className="btn btn-link text-dark p-0 px-2 text-decoration-none small fw-medium" onClick={() => changeWeek(1)}>
                            Tiếp <i className="bi bi-chevron-right small"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-5 overflow-hidden">
                <div className="card-body p-0">
                    {loading ? (
                         <div className="d-flex justify-content-center p-5">
                             <div className="spinner-border text-primary" role="status">
                                 <span className="visually-hidden">Loading...</span>
                             </div>
                         </div>
                    ) : (
                        <ScheduleTable 
                            data={filteredSchedule} 
                            currentViewDate={currentDate} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParentSchedule;