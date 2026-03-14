import { useState, useEffect } from "react";

/**
 * Chức năng: Modal chi tiết điểm danh học sinh trong một lớp học.
 * Cho phép cập nhật trạng thái (Có mặt, Vắng, Muộn), ghi chú cho từng học sinh và tính toán thống kê nhanh.
 * Creatby: Nguyễn Thùy Linh - 14/3/2026
 * Updateby: Nguyễn Thùy Linh - 14/3/2026
 * @param {Object} props.classData - Dữ liệu thông tin lớp học và danh sách học sinh ban đầu
 * @param {Function} props.onClose - Hàm đóng modal
 * @param {Function} props.onSave - Hàm lưu dữ liệu điểm danh đã cập nhật
 */
function AttendanceModal({ classData, onClose, onSave }) {
  const [students, setStudents] = useState(classData.students || []);

  const handleStatus = (id, status) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSave = () => {
    const isDone = students.every(s => s.status !== null);
    onSave({
      ...classData,
      students,
      status: isDone ? "done" : "dang"
    });
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow">
          
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold">Điểm danh: {classData.className}</h5>
              <p className="text-muted small mb-0">{classData.time} • Phòng {classData.room}</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Stats bar */}
            <div className="d-flex gap-4 p-3 bg-light rounded-3 mb-3 text-center">
              <div className="flex-fill">
                <small className="d-block text-muted">Tổng số</small>
                <span className="fw-bold">{students.length}</span>
              </div>
              <div className="flex-fill text-success">
                <small className="d-block text-muted">Có mặt</small>
                <span className="fw-bold">{stats.present}</span>
              </div>
              <div className="flex-fill text-danger">
                <small className="d-block text-muted">Vắng mặt</small>
                <span className="fw-bold">{stats.absent}</span>
              </div>
              <div className="flex-fill text-warning">
                <small className="d-block text-muted">Muộn</small>
                <span className="fw-bold">{stats.late}</span>
              </div>
            </div>

            <button 
              className="btn btn-outline-primary btn-sm mb-3"
              onClick={() => setStudents(students.map(s => ({ ...s, status: 'present' })))}
            >
              ✓ Chọn tất cả có mặt
            </button>

            {/* Student List */}
            <div className="list-group list-group-flush">
              {students.map((s, index) => (
                <div key={s.id} className="list-group-item d-flex align-items-center py-3 px-0 border-bottom">
                  <span className="text-muted me-3" style={{ width: '25px' }}>{index + 1}</span>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{s.name}</div>
                  </div>
                  
                  <div className="btn-group me-3">
                    <button 
                      className={`btn btn-sm ${s.status === 'present' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => handleStatus(s.id, 'present')}
                    >✓</button>
                    <button 
                      className={`btn btn-sm ${s.status === 'absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => handleStatus(s.id, 'absent')}
                    >✕</button>
                    <button 
                      className={`btn btn-sm ${s.status === 'late' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
                      onClick={() => handleStatus(s.id, 'late')}
                    >⏰</button>
                  </div>

                  <input 
                    type="text" 
                    className="form-control form-control-sm w-25" 
                    placeholder="Ghi chú..." 
                    value={s.note}
                    onChange={(e) => setStudents(students.map(st => st.id === s.id ? {...st, note: e.target.value} : st))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-light px-4" onClick={onClose}>Hủy</button>
            <button className="btn btn-dark px-4" onClick={handleSave}>Lưu điểm danh</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceModal;