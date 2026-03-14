import React, { useMemo } from 'react';

const ScheduleTable = ({ data = [], currentViewDate }) => {
    // Logic tính toán 7 ngày trong tuần (từ Thứ 2 đến Chủ Nhật)
    const weekDays = useMemo(() => {
        const start = new Date(currentViewDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(start.setDate(diff));

        return Array.from({ length: 7 }).map((_, index) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + index);
            return {
                name: d.getDay() === 0 ? 'Chủ nhật' : `Thứ ${d.getDay() + 1}`,
                dateDisplay: d.toLocaleDateString('vi-VN'),
                isoDate: d.toISOString().split('T')[0] // Trả về "2026-02-02"
            };
        });
    }, [currentViewDate]);

    
    const sessions = ['Sáng', 'Chiều', 'Tối'];

    return (
        <div className="table-responsive border bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <table className="table table-bordered mb-0" style={{ width: '100%', tableLayout: 'fixed', minWidth: '1100px' }}>
                <thead className="text-center" style={{ backgroundColor: '#f0f5f9' }}>
                    <tr>
                        <th style={{ width: '80px', color: '#007bff' }} className="py-3 fw-bold small">Ca học</th>
                        {weekDays.map(day => (
                            <th key={day.isoDate} className="py-2 border-start">
                                <div style={{ color: '#007bff', fontSize: '14px' }} className="fw-bold">{day.name}</div>
                                <div style={{ color: '#666', fontSize: '11px' }}>{day.dateDisplay}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sessions.map(session => (
                        <tr key={session}>
                            <td className="text-center align-middle fw-bold" style={{ backgroundColor: '#fffdf0', color: '#555' }}>
                                {session}
                            </td>
                            {weekDays.map(day => {
                                // Lọc dữ liệu khớp chính xác Ngày và Ca học
                                const classes = data.filter(item => item.date === day.isoDate && item.slot === session);
                                return (
                                    <td key={day.isoDate} className="p-2 border-start" style={{ verticalAlign: 'top', minHeight: '180px' }}>
                                        {classes.map((item, idx) => (
                                            <div key={idx} className="p-3 mb-2 border d-flex flex-column shadow-sm"
                                                style={{ 
                                                    backgroundColor: item.type === 'practice' ? '#f6ffed' : '#f0f7ff',
                                                    borderLeft: `5px solid ${item.type === 'practice' ? '#52c41a' : '#007bff'}`,
                                                    borderRadius: '6px', fontSize: '12px', lineHeight: '1.5'
                                                }}>
                                                <div className="fw-bold mb-2" style={{ color: '#003366', fontSize: '13px' }}>{item.subject}</div>
                                                <div className="text-muted small mb-2">{item.code}</div>
                                                <div className="d-flex flex-column gap-1">
                                                    <div><b>Tiết:</b> {item.period}</div>
                                                    <div><b>Giờ:</b> {item.time}</div>
                                                    <div><b>Phòng:</b> <span className="text-danger fw-bold">{item.room}</span></div>
                                                    <div className="text-dark mt-1" style={{ whiteSpace: 'normal' }}>
                                                        <b>GV:</b> {item.teacher}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleTable;