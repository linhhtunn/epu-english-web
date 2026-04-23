import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { getVietnamNow } from '../../utils/dateUtils';

const AdminSchedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [scheduledClasses, setScheduledClasses] = useState([]);
    const [weekDays, setWeekDays] = useState([]);
    const [weekDates, setWeekDates] = useState([]);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalDate, setModalDate] = useState('');
    const [classList, setClassList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [formData, setFormData] = useState({
        maLop: '', maGiaoVien: '', gioBatDau: '18:00', gioKetThuc: '19:30', ghiChu: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Detail popover state
    const [selectedSession, setSelectedSession] = useState(null);

    // Drag state
    const [draggedSession, setDraggedSession] = useState(null);

    // Edit modal state
    const [editingSession, setEditingSession] = useState(null);

    const todayStr = (() => {
        const now = getVietnamNow();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    })();

    const formatDateForAPI = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getWeekRange = useCallback((date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(start.setDate(diff));

        const days = [];
        const dates = [];
        const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
        const tempDate = new Date(monday);

        for (let i = 0; i < 7; i++) {
            const dateStr = formatDateForAPI(tempDate);
            days.push(`${dayNames[i]} (${String(tempDate.getDate()).padStart(2, '0')}/${String(tempDate.getMonth() + 1).padStart(2, '0')})`);
            dates.push(dateStr);
            tempDate.setDate(tempDate.getDate() + 1);
        }
        setWeekDays(days);
        setWeekDates(dates);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return { fromDate: formatDateForAPI(monday), toDate: formatDateForAPI(sunday) };
    }, []);

    const fetchSchedule = useCallback(async () => {
        try {
            setLoading(true);
            const { fromDate, toDate } = getWeekRange(currentDate);
            const data = await adminService.getSchedule(fromDate, toDate);
            setScheduledClasses(data.scheduledClasses || []);
        } catch (err) {
            console.error("Lỗi tải lịch admin:", err);
        } finally {
            setLoading(false);
        }
    }, [currentDate, getWeekRange]);

    useEffect(() => {
        document.title = "Điều phối lịch | EPU English";
        fetchSchedule();
    }, [fetchSchedule]);

    const changeWeek = (amount) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (amount * 7));
        setCurrentDate(newDate);
    };

    // --- MODAL: Open create session ---
    const openCreateModal = async (dateStr) => {
        setModalDate(dateStr);
        setFormData({ maLop: '', maGiaoVien: '', gioBatDau: '18:00', gioKetThuc: '19:30', ghiChu: '' });
        setShowModal(true);
        try {
            const data = await adminService.getScheduleClasses();
            setClassList(data.classes || []);
            setTeacherList(data.teachers || []);
        } catch (err) {
            console.error("Lỗi tải danh sách lớp:", err);
        }
    };

    const handleClassChange = (maLop) => {
        const cls = classList.find(c => c.maLop === parseInt(maLop));
        setFormData(prev => ({
            ...prev,
            maLop,
            maGiaoVien: cls?.teacherId?.toString() || ''
        }));
    };

    const handleCreateSession = async () => {
        if (!formData.maLop || !formData.maGiaoVien) {
            alert("Vui lòng chọn lớp và giáo viên.");
            return;
        }
        setSubmitting(true);
        try {
            await adminService.createSession({
                maLop: parseInt(formData.maLop),
                ngayHoc: modalDate,
                gioBatDau: formData.gioBatDau,
                gioKetThuc: formData.gioKetThuc,
                maGiaoVien: parseInt(formData.maGiaoVien),
                ghiChu: formData.ghiChu || null
            });
            setShowModal(false);
            fetchSchedule();
        } catch (err) {
            alert(err.response?.data?.message || "Tạo buổi học thất bại!");
        } finally {
            setSubmitting(false);
        }
    };

    // --- DELETE session ---
    const handleDeleteSession = async (session) => {
        const msg = session.hasAttendance
            ? `Buổi học này đã có điểm danh. Xóa sẽ xóa luôn dữ liệu điểm danh.\n\nBạn có chắc chắn?`
            : `Bạn có chắc chắn muốn xóa buổi học này?`;
        if (!window.confirm(msg)) return;
        try {
            await adminService.deleteSession(session.id);
            setSelectedSession(null);
            fetchSchedule();
        } catch (err) {
            alert(err.response?.data?.message || "Xóa buổi học thất bại!");
        }
    };

    // --- EDIT session ---
    const openEditModal = async (session) => {
        setSelectedSession(null);
        setEditingSession(session);
        setFormData({
            maLop: session.classId?.toString() || '',
            maGiaoVien: session.teacherId?.toString() || '',
            gioBatDau: session.startTime,
            gioKetThuc: session.endTime,
            ghiChu: session.note || ''
        });
        setModalDate(session.date);
        setShowModal(true);
        try {
            const data = await adminService.getScheduleClasses();
            setClassList(data.classes || []);
            setTeacherList(data.teachers || []);
        } catch (err) {
            console.error("Lỗi tải danh sách lớp:", err);
        }
    };

    const handleEditSession = async () => {
        if (!formData.maLop || !formData.maGiaoVien) {
            alert("Vui lòng chọn lớp và giáo viên.");
            return;
        }
        setSubmitting(true);
        try {
            await adminService.updateSession(editingSession.id, {
                ngayHoc: modalDate,
                gioBatDau: formData.gioBatDau,
                gioKetThuc: formData.gioKetThuc,
                maLop: parseInt(formData.maLop),
                maGiaoVien: parseInt(formData.maGiaoVien),
                ghiChu: formData.ghiChu || null
            });
            setShowModal(false);
            setEditingSession(null);
            fetchSchedule();
        } catch (err) {
            alert(err.response?.data?.message || "Cập nhật buổi học thất bại!");
        } finally {
            setSubmitting(false);
        }
    };

    // --- DRAG & DROP ---
    const handleDragStart = (e, session) => {
        if (session.isPast) { e.preventDefault(); return; }
        setDraggedSession(session);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', session.id.toString());
    };

    const handleDragOver = (e, dateStr) => {
        if (dateStr < todayStr) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, dateStr) => {
        e.preventDefault();
        if (!draggedSession || dateStr < todayStr) {
            setDraggedSession(null);
            return;
        }
        try {
            await adminService.updateSession(draggedSession.id, {
                ngayHoc: dateStr,
                gioBatDau: draggedSession.startTime,
                gioKetThuc: draggedSession.endTime
            });
            fetchSchedule();
        } catch (err) {
            alert(err.response?.data?.message || "Di chuyển buổi học thất bại!");
        } finally {
            setDraggedSession(null);
        }
    };

    // --- RENDER HELPERS ---
    const getSessionsForDaySlot = (dayIdx) => {
        return scheduledClasses.filter(c => c.dayIdx === dayIdx);
    };

    const isDayPast = (dateStr) => dateStr < todayStr;
    const isToday = (dateStr) => dateStr === todayStr;

    const renderDayColumn = (dayIdx) => {
        const dateStr = weekDates[dayIdx];
        const past = isDayPast(dateStr);
        const today = isToday(dateStr);
        const sessions = getSessionsForDaySlot(dayIdx);

        return (
            <td
                key={dayIdx}
                className={`p-1 align-top position-relative ${past ? 'bg-body-secondary' : ''}`}
                style={{ minHeight: '120px', opacity: past ? 0.6 : 1 }}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDrop={(e) => handleDrop(e, dateStr, null)}
            >
                {/* Render existing sessions */}
                {sessions.map(session => (
                    <div
                        key={session.id}
                        className={`p-2 rounded-3 shadow-sm mb-1 position-relative border-start border-4 ${
                            past ? 'bg-secondary-subtle border-secondary' :
                            today ? 'bg-success-subtle border-success' :
                            'bg-primary-subtle border-primary'
                        }`}
                        style={{ minHeight: '70px', cursor: past ? 'default' : 'grab', fontSize: '11px' }}
                        draggable={!past}
                        onDragStart={(e) => handleDragStart(e, session)}
                        onClick={(e) => { e.stopPropagation(); if (!past) setSelectedSession(selectedSession?.id === session.id ? null : session); }}
                    >
                        <div className="fw-bold text-dark mb-1">{session.classCode}</div>
                        <div className="text-secondary fw-medium"><i className="bi bi-person-fill me-1"></i>{session.teacher}</div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                            <span className="text-muted">{session.startTime} - {session.endTime}</span>
                            <span className="badge bg-white text-dark border px-1" style={{ fontSize: '9px' }}>{session.room}</span>
                        </div>
                        {session.hasAttendance && <i className="bi bi-check-circle-fill text-success position-absolute top-0 end-0 mt-1 me-1" style={{ fontSize: '10px' }} title="Đã điểm danh"></i>}

                        {/* Detail popover */}
                        {selectedSession?.id === session.id && !past && (
                            <div className="position-absolute bg-white border shadow-lg rounded-3 p-3 z-3" style={{ top: '100%', left: '0', width: '220px', zIndex: 100 }} onClick={(e) => e.stopPropagation()}>
                                <div className="fw-bold text-primary mb-2">{session.classCode}</div>
                                <div className="small text-muted mb-1"><i className="bi bi-person me-1"></i>{session.teacher}</div>
                                <div className="small text-muted mb-1"><i className="bi bi-clock me-1"></i>{session.startTime} - {session.endTime}</div>
                                <div className="small text-muted mb-2"><i className="bi bi-geo-alt me-1"></i>{session.room}</div>
                                {session.note && <div className="small text-muted fst-italic mb-2">"{session.note}"</div>}
                                <div className="d-flex gap-2 flex-wrap">
                                    <button className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill" onClick={() => openEditModal(session)}>
                                        <i className="bi bi-pencil me-1"></i>Sửa
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm flex-grow-1 rounded-pill" onClick={() => handleDeleteSession(session)}>
                                        <i className="bi bi-trash me-1"></i>Xóa
                                    </button>
                                    <button className="btn btn-outline-secondary btn-sm flex-grow-1 rounded-pill" onClick={() => setSelectedSession(null)}>
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Always show + button for future/today days */}
                {!past && (
                    <div
                        className="w-100 p-2 text-center d-flex align-items-center justify-content-center rounded-3"
                        style={{
                            minHeight: sessions.length > 0 ? '40px' : '70px',
                            borderStyle: 'dashed',
                            borderWidth: '2px',
                            borderColor: '#dee2e6',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onClick={() => openCreateModal(dateStr)}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f4ff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                    >
                        <span className="text-muted fw-bold opacity-50" style={{ fontSize: sessions.length > 0 ? '14px' : '20px' }}>+</span>
                    </div>
                )}

                {/* Empty state for past days */}
                {past && sessions.length === 0 && (
                    <div className="h-100 w-100 p-2 text-center d-flex align-items-center justify-content-center" style={{ minHeight: '70px' }}>
                        <span className="text-muted small opacity-50">—</span>
                    </div>
                )}
            </td>
        );
    };

    return (
        <div className="p-4 animate__animated animate__fadeIn h-100 d-flex flex-column" onClick={() => setSelectedSession(null)}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1 text-uppercase">Điều phối Lịch dạy & Học</h2>
                    <p className="text-muted small mb-0">Quản lý lịch học, kéo thả để di chuyển buổi học. Nhấn <strong>+</strong> để tạo mới.</p>
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
                                <div className="d-flex justify-content-center align-items-center h-100 py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <table className="table table-bordered mb-0 align-middle" style={{ minWidth: '900px', tableLayout: 'fixed' }}>
                                    <thead className="bg-light sticky-top" style={{ zIndex: 10 }}>
                                        <tr className="text-center text-muted small text-uppercase">
                                            {weekDays.map((day, idx) => {
                                                const dateStr = weekDates[idx];
                                                const past = isDayPast(dateStr);
                                                const today = isToday(dateStr);
                                                return (
                                                    <th key={idx} className={`border-0 py-3 ${today ? 'bg-primary text-white' : past ? 'bg-body-secondary text-muted' : 'bg-light'}`} style={{ width: `${100 / 7}%` }}>
                                                        {day}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {weekDays.map((_, dayIdx) => renderDayColumn(dayIdx))}
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="col-lg-3 d-flex flex-column gap-4">
                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-dark text-white">
                        <h6 className="fw-bold mb-4 text-warning"><i className="bi bi-info-circle-fill me-2"></i>Chú thích hệ thống</h6>

                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary-subtle border border-primary rounded-3 me-3" style={{ width: '24px', height: '24px' }}></div>
                            <span className="small opacity-75">Buổi học sắp tới</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-success-subtle border border-success rounded-3 me-3" style={{ width: '24px', height: '24px' }}></div>
                            <span className="small opacity-75">Buổi học hôm nay</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-secondary-subtle border border-secondary rounded-3 me-3" style={{ width: '24px', height: '24px' }}></div>
                            <span className="small opacity-75">Buổi học đã qua (không tương tác)</span>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-light border border-dashed rounded-3 me-3 text-center text-muted fw-bold" style={{ width: '24px', height: '24px', lineHeight: '22px' }}>+</div>
                            <span className="small opacity-75">Ô trống (Click để xếp lịch)</span>
                        </div>

                        <hr className="border-secondary" />
                        <div className="small opacity-50 mt-2">
                            <i className="bi bi-arrows-move me-2"></i>Kéo thả để di chuyển buổi học<br/>
                            <i className="bi bi-mouse me-2 mt-1"></i>Click buổi học để xem chi tiết / xóa
                        </div>
                    </div>

                    {/* Stats card */}
                    <div className="card border-0 shadow-sm rounded-5 p-4 bg-primary-subtle">
                        <h6 className="fw-bold text-primary mb-3"><i className="bi bi-bar-chart me-2"></i>Thống kê tuần này</h6>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small text-muted">Tổng buổi học</span>
                            <span className="fw-bold text-dark">{scheduledClasses.length}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small text-muted">Đã điểm danh</span>
                            <span className="fw-bold text-success">{scheduledClasses.filter(s => s.hasAttendance).length}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="small text-muted">Chưa điểm danh</span>
                            <span className="fw-bold text-warning">{scheduledClasses.filter(s => !s.hasAttendance).length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CREATE SESSION MODAL */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => { setShowModal(false); setEditingSession(null); }}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content rounded-4 border-0 shadow">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className={`bi ${editingSession ? 'bi-pencil-square' : 'bi-plus-circle-fill'} me-2 text-primary`}></i>
                                    {editingSession ? 'Chỉnh sửa buổi học' : 'Tạo buổi học mới'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setEditingSession(null); }}></button>
                            </div>
                            <div className="modal-body px-4 py-3">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Ngày học</label>
                                    <input type="date" className="form-control rounded-3" value={modalDate} onChange={(e) => setModalDate(e.target.value)} min={todayStr} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Lớp học</label>
                                    <select className="form-select rounded-3" value={formData.maLop} onChange={(e) => handleClassChange(e.target.value)}>
                                        <option value="">-- Chọn lớp --</option>
                                        {classList.map(c => (
                                            <option key={c.maLop} value={c.maLop}>{c.maLopHienThi} - {c.courseName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Giáo viên</label>
                                    <select className="form-select rounded-3" value={formData.maGiaoVien} onChange={(e) => setFormData(prev => ({ ...prev, maGiaoVien: e.target.value }))}>
                                        <option value="">-- Chọn giáo viên --</option>
                                        {teacherList.map(t => (
                                            <option key={t.maGiaoVien} value={t.maGiaoVien}>{t.hoTen}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-muted">Giờ bắt đầu</label>
                                        <input type="time" className="form-control rounded-3" value={formData.gioBatDau} onChange={(e) => setFormData(prev => ({ ...prev, gioBatDau: e.target.value }))} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold text-muted">Giờ kết thúc</label>
                                        <input type="time" className="form-control rounded-3" value={formData.gioKetThuc} onChange={(e) => setFormData(prev => ({ ...prev, gioKetThuc: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Ghi chú (tùy chọn)</label>
                                    <input type="text" className="form-control rounded-3" placeholder="VD: Ôn tập giữa kỳ..." value={formData.ghiChu} onChange={(e) => setFormData(prev => ({ ...prev, ghiChu: e.target.value }))} />
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => { setShowModal(false); setEditingSession(null); }}>Hủy</button>
                                <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={editingSession ? handleEditSession : handleCreateSession} disabled={submitting}>
                                    {submitting ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className={`bi ${editingSession ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>}
                                    {editingSession ? 'Lưu thay đổi' : 'Tạo buổi học'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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