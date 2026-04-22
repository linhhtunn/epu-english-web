import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminSchedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewFilter, setViewFilter] = useState('all'); 
    const [loading, setLoading] = useState(true);
    const [scheduledClasses, setScheduledClasses] = useState([]);
    const [rescheduleRequests, setRescheduleRequests] = useState([]);
    const [weekDays, setWeekDays] = useState([]);

    const timeSlots = [
        { id: 1, name: 'Ca 1', time: '07:30 - 09:30' },
        { id: 2, name: 'Ca 2', time: '09:45 - 11:45' },
        { id: 3, name: 'Ca 3', time: '13:30 - 15:30' },
        { id: 4, name: 'Ca 4', time: '15:45 - 17:45' },
        { id: 5, name: 'Ca 5', time: '18:00 - 20:00' },
        { id: 6, name: 'Ca 6', time: '20:15 - 22:15' }
    ];

    const formatDateForAPI = (date) => {
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
        
        const generatedWeekDays = [];
        const tempDate = new Date(monday);
        const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
        
        for (let i = 0; i < 7; i++) {
            generatedWeekDays.push(`${dayNames[i]} (${String(tempDate.getDate()).padStart(2, '0')}/${String(tempDate.getMonth()+1).padStart(2, '0')})`);
            tempDate.setDate(tempDate.getDate() + 1);
        }
        setWeekDays(generatedWeekDays);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return {
            fromDate: formatDateForAPI(monday),
            toDate: formatDateForAPI(sunday),
        };
    };

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const { fromDate, toDate } = getWeekRange(currentDate);
                const data = await adminService.getSchedule(fromDate, toDate);
                setScheduledClasses(data.scheduledClasses || []);
                setRescheduleRequests(data.rescheduleRequests || []);
            } catch (err) {
                console.error("Lỗi tải lịch admin:", err);
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

    const renderTimeSlot = (dayIdx, slotId) => {
        const classInSlot = scheduledClasses.find(c => c.dayIdx === dayIdx && c.slotId === slotId);
        
        if (!classInSlot) return <div className="h-100 w-100 min-h-60px p-2 text-muted text-center" style={{ minHeight: '80px', borderStyle: 'dashed', borderWidth: '1px', borderColor: '#e9ecef', borderRadius: '8px' }}>+</div>;

        return (
            <div className={`p-2 rounded-3 shadow-sm h-100 position-relative border-start border-4 ${classInSlot.isConflict ? 'bg-danger-subtle border-danger' : 'bg-primary-subtle border-primary'}`} style={{ minHeight: '80px', cursor: 'pointer' }}>
                {classInSlot.isConflict && (
                    <i className="bi bi-exclamation-circle-fill text-danger position-absolute top-0 end-0 mt-1 me-1" title={classInSlot.conflictReason}></i>
                )}
                <div className="fw-bold text-dark mb-1" style={{ fontSize: '11px' }}>{classInSlot.classCode}</div>
                <div className="d-flex justify-content-between align-items-center small" style={{ fontSize: '10px' }}>
                    <span className="text-secondary fw-medium"><i className="bi bi-person-fill me-1"></i>{classInSlot.teacher}</span>
                    <span className="badge bg-white text-dark border px-1">{classInSlot.room}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 animate__animated animate__fadeIn h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1 text-uppercase">Điều phối Lịch dạy & Học</h2>
                    <p className="text-muted small mb-0">Quản lý lịch học, phòng học và xử lý yêu cầu đổi lịch.</p>
                </div>
                
                <div className="d-flex gap-3 align-items-center">
                    <select className="form-select rounded-pill shadow-sm bg-light border-0 fw-medium" style={{ width: '200px' }} value={viewFilter} onChange={(e) => setViewFilter(e.target.value)}>
                        <option value="all">Tất cả lớp học</option>
                        <option value="room">Lọc theo Phòng học</option>
                        <option value="teacher">Lọc theo Giảng viên</option>
                    </select>

                    <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center">
                        <i className="bi bi-plus-lg me-2"></i> Xếp lịch mới
                    </button>
                </div>
            </div>

            <div className="row g-4 flex-grow-1">
                <div className="col-lg-9 d-flex flex-column">
                    <div className="card border-0 shadow-sm rounded-5 p-3 flex-grow-1 bg-white d-flex flex-column">
                        
                        <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                            <h5 className="fw-bold mb-0 text-dark">Lịch trình hệ thống</h5>
                            <div className="bg-light border rounded-pill p-1 shadow-sm d-flex align-items-center">
                                <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-none" onClick={() => setCurrentDate(new Date())} style={{ fontSize: '14px', height: '36px' }}>
                                    Hiện tại
                                </button>
                                <div className="d-flex align-items-center px-2 py-1">
                                    <button className="btn btn-link text-dark text-decoration-none px-3 d-flex align-items-center gap-1 border-0 shadow-none" onClick={() => changeWeek(-1)} style={{ fontSize: '14px', fontWeight: '500' }}>
                                        <i className="bi bi-chevron-left"></i> Trở về
                                    </button>
                                    <div className="vr mx-1" style={{ height: '20px', opacity: 0.2 }}></div>
                                    <button className="btn btn-link text-dark text-decoration-none px-3 d-flex align-items-center gap-1 border-0 shadow-none" onClick={() => changeWeek(1)} style={{ fontSize: '14px', fontWeight: '500' }}>
                                        Tiếp <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive flex-grow-1 custom-scrollbar pe-2">
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center h-100 min-h-60px py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <table className="table table-bordered mb-0 align-middle" style={{ minWidth: '900px', tableLayout: 'fixed' }}>
                                    <thead className="bg-light sticky-top" style={{ zIndex: 10 }}>
                                        <tr className="text-center text-muted small text-uppercase">
                                            <th style={{ width: '12%' }} className="border-0 bg-light py-3">Ca / Thời gian</th>
                                            {weekDays.map((day, idx) => (
                                                <th key={idx} style={{ width: '12.5%' }} className="border-0 bg-light py-3">{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map(slot => (
                                            <tr key={slot.id}>
                                                <td className="text-center bg-light border-end py-3">
                                                    <div className="fw-bold text-dark">{slot.name}</div>
                                                    <div className="text-muted" style={{ fontSize: '10px' }}>{slot.time}</div>
                                                </td>
                                                {weekDays.map((_, dayIdx) => (
                                                    <td key={dayIdx} className="p-1 align-top">
                                                        {renderTimeSlot(dayIdx, slot.id)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 d-flex flex-column gap-4">
                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-white h-50 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="fw-bold mb-0 text-dark"><i className="bi bi-arrow-left-right text-warning me-2"></i>Duyệt đổi lịch</h6>
                            <span className="badge bg-danger rounded-pill">{rescheduleRequests.length}</span>
                        </div>
                        
                        <div className="overflow-y-auto custom-scrollbar pe-2 flex-grow-1">
                            {rescheduleRequests.length === 0 ? (
                                <div className="text-center text-muted small py-4">Không có yêu cầu đổi lịch.</div>
                            ) : rescheduleRequests.map(req => (
                                <div key={req.id} className="bg-light rounded-4 p-3 mb-3 border border-light-subtle position-relative">
                                    <div className="fw-bold text-primary mb-1" style={{ fontSize: '13px' }}>{req.classCode}</div>
                                    <div className="small text-dark fw-medium mb-2"><i className="bi bi-person me-1"></i> GV: {req.teacher}</div>
                                    
                                    <div className="d-flex align-items-center gap-2 mb-2 bg-white p-2 rounded-3 border" style={{ fontSize: '11px' }}>
                                        <div className="text-decoration-line-through text-muted">{req.oldDate}</div>
                                        <i className="bi bi-arrow-right text-primary"></i>
                                        <div className="fw-bold text-success">{req.newDate}</div>
                                    </div>
                                    
                                    <div className="text-muted mb-3" style={{ fontSize: '11px', fontStyle: 'italic' }}>"{req.reason}"</div>
                                    
                                    <div className="d-flex gap-2 mt-auto">
                                        <button className="btn btn-success btn-sm flex-grow-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>Duyệt</button>
                                        <button className="btn btn-outline-danger btn-sm flex-grow-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>Từ chối</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-dark text-white h-50">
                        <h6 className="fw-bold mb-4 text-warning"><i className="bi bi-info-circle-fill me-2"></i>Chú thích hệ thống</h6>
                        
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary-subtle border border-primary rounded-3 me-3" style={{ width: '24px', height: '24px' }}></div>
                            <span className="small opacity-75">Lịch học bình thường</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-danger-subtle border border-danger rounded-3 me-3 position-relative" style={{ width: '24px', height: '24px' }}>
                                <i className="bi bi-exclamation-circle-fill text-danger position-absolute top-50 start-50 translate-middle" style={{ fontSize: '10px' }}></i>
                            </div>
                            <span className="small opacity-75 text-danger fw-bold">Xung đột lịch (Trùng GV/HS/Phòng)</span>
                        </div>
                        
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-light border border-dashed rounded-3 me-3 text-center text-muted fw-bold" style={{ width: '24px', height: '24px', lineHeight: '22px' }}>+</div>
                            <span className="small opacity-75">Ô trống (Click để xếp lịch)</span>
                        </div>

                        <button className="btn btn-light w-100 mt-auto rounded-pill fw-bold text-dark shadow-sm">
                            <i className="bi bi-magic me-2"></i> Tự động kiểm tra xung đột
                        </button>
                    </div>

                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ced4da; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
            `}</style>
        </div>
    );
};

export default AdminSchedule;