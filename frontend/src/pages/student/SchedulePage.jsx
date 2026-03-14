import React, { useState } from "react";
// ❌ XÓA dòng import Sidebar
import ScheduleTable from "../../components/ScheduleTable";
import scheduleData from "../../data/schedule.json";

const SchedulePage = () => {
    const [viewDate, setViewDate] = useState(new Date());

    const handlePrevWeek = () => {
        const d = new Date(viewDate);
        d.setDate(viewDate.getDate() - 7);
        setViewDate(d);
    };

    const handleNextWeek = () => {
        const d = new Date(viewDate);
        d.setDate(viewDate.getDate() + 7);
        setViewDate(d);
    };

    const handleToday = () => setViewDate(new Date());

    return (
        /* ✅ Chỉ giữ lại thẻ div bọc nội dung chính. 
           MainLayout sẽ tự động đưa phần này vào bên phải Sidebar. */
        <div className="p-4 animate__animated animate__fadeIn" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h3 className="fw-bold text-dark mb-0">Lịch học, lịch thi theo tuần</h3>
                
                <div className="d-flex gap-2 bg-white p-1 rounded-pill shadow-sm border">
                    <button onClick={handleToday} className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">Hiện tại</button>
                    <button onClick={handlePrevWeek} className="btn btn-outline-secondary btn-sm rounded-pill border-0 px-2">
                        <i className="bi bi-chevron-left"></i> Trở về
                    </button>
                    <button onClick={handleNextWeek} className="btn btn-outline-secondary btn-sm rounded-pill border-0 px-2">
                        Tiếp <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <ScheduleTable data={scheduleData} currentViewDate={viewDate} />

            <div className="mt-4 d-flex flex-wrap gap-4 fw-bold small text-muted">
                <div className="d-flex align-items-center"><span className="me-2" style={{width: '25px', height: '12px', backgroundColor: '#f0f7ff', border:'1px solid #ddd'}}></span> Lý thuyết</div>
                <div className="d-flex align-items-center"><span className="me-2" style={{width: '25px', height: '12px', backgroundColor: '#f6ffed', border:'1px solid #ddd'}}></span> Thực hành</div>
                <div className="d-flex align-items-center"><span className="me-2" style={{width: '25px', height: '12px', backgroundColor: '#fffdf0', border:'1px solid #ddd'}}></span> Lịch thi</div>
            </div>
        </div>
    );
};

export default SchedulePage;