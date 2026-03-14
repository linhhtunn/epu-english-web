import React, { useState, useEffect } from 'react';
import ScheduleTable from '../../components/ScheduleTable';
import scheduleData from '../../data/schedule.json'; 

const ParentSchedule = () => {
    const [children] = useState([
        { id: "HS001", tenCon: "Nguyễn Văn Học", lop: "HNI - PRI4 - 0065" },
        { id: "HS002", tenCon: "Nguyễn Minh Anh", lop: "HNI - PRI1 - 0012" }
    ]);

    const [selectedChild, setSelectedChild] = useState(children[0]);
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        setFilteredSchedule(scheduleData);
    }, [selectedChild]);

    const changeWeek = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (offset * 7));
        setCurrentDate(newDate);
    };

    return (
        <div className="container-fluid p-4 animate__animated animate__fadeIn">
            {/* Tiêu đề chính nằm riêng trên một dòng hoặc phía trên cùng */}
            <h2 className="fw-bold mb-4" style={{ fontSize: '24px', color: '#333' }}>
                Lịch học, lịch thi theo tuần
            </h2>

            {/* Header: Chứa nút chọn con bên trái và điều hướng bên phải */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                
                {/* 1. Bộ chọn con (Dropdown) nằm bên TRÁI */}
                <div className="dropdown">
                    <button 
                        className="btn btn-outline-primary dropdown-toggle rounded-pill fw-bold px-3 border-2 d-flex align-items-center shadow-sm" 
                        type="button" 
                        data-bs-toggle="dropdown"
                        style={{ height: '40px', fontSize: '14px' }}
                    >
                        <span className="text-uppercase me-1" style={{ fontSize: '11px', opacity: 0.8 }}>Đang xem lịch của:</span> 
                        <span className="text-dark">{selectedChild.tenCon} ({selectedChild.id})</span>
                    </button>
                    <ul className="dropdown-menu shadow border-0 mt-2 rounded-4">
                        {children.map(child => (
                            <li key={child.id}>
                                <button 
                                    className="dropdown-item py-2 fw-medium" 
                                    onClick={() => setSelectedChild(child)}
                                >
                                    {child.tenCon} - {child.id}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* 2. Cụm điều hướng thời gian nằm bên PHẢI */}
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

            {/* Bảng lịch học */}
            <div className="card border-0 shadow-sm rounded-5 overflow-hidden">
                <div className="card-body p-0">
                    <ScheduleTable 
                        data={filteredSchedule} 
                        currentViewDate={currentDate} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ParentSchedule;