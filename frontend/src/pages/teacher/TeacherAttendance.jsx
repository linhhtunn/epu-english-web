import { useState, useEffect } from "react";
import AttendanceModal from "./AttendanceModal";
import { teacherService } from "../../services/teacherService";

/**
 * Chức năng: Quản lý danh sách lớp học và thực hiện điểm danh cho giáo viên. 
 * Bao gồm các tính năng: Thống kê số lượng lớp, lọc lớp theo trạng thái và mở modal chi tiết điểm danh.
 * Creatby: Nguyễn Thùy Linh - 14/3/2026
 * Updateby: Nguyễn Thùy Linh - 14/3/2026
 * @returns {JSX.Element} Giao diện quản lý điểm danh của giáo viên
 */
function TeacherAttendance() {
  const [activeTab, setActiveTab] = useState("can_diem_danh");
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Điểm danh | EPU English";
    fetchTodayClasses();
  }, []);

  const fetchTodayClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await teacherService.getTodayClasses();
      setClasses(data);
    } catch (err) {
      console.error("Lỗi khi tải lớp hôm nay:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu điểm danh.");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán thống kê
  const totalClasses = classes.length;
  const doneClasses = classes.filter(c => c.status === "done").length;
  const pendingClasses = totalClasses - doneClasses;

  const filteredClasses = classes.filter((item) => {
    if (activeTab === "can_diem_danh") return item.status === "chua" || item.status === "dang";
    if (activeTab === "da_diem_danh") return item.status === "done";
    return true;
  });

  const handleSave = async (updatedData) => {
    try {
      // Map data for API
      const apiStudents = updatedData.students.map(s => ({
        id: s.id,
        status: s.status,
        note: s.note
      }));

      await teacherService.saveAttendance(updatedData.id, apiStudents);
      
      // Update local state
      setClasses(classes.map(c => c.id === updatedData.id ? { ...updatedData, status: updatedData.status } : c));
      setSelectedClass(null);
      alert("Đã lưu điểm danh thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu điểm danh:", err);
      alert("Không thể lưu điểm danh. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h2 className="fw-bold mb-4">Điểm danh</h2>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button onClick={fetchTodayClasses} className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold">
            Thử lại
          </button>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="row mb-4 text-center">
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm border-0 rounded-4">
                <h6 className="text-muted small uppercase">Tổng số lớp hôm nay</h6>
                <h3 className="fw-bold mb-0">{totalClasses}</h3>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm border-0 rounded-4">
                <h6 className="text-muted small">Đã điểm danh</h6>
                <h3 className="fw-bold mb-0 text-success">{doneClasses}</h3>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm border-0 rounded-4">
                <h6 className="text-muted small">Chưa điểm danh</h6>
                <h3 className="fw-bold mb-0 text-danger">{pendingClasses}</h3>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="d-flex border-bottom bg-white text-center">
              {["can_diem_danh", "da_diem_danh", "tat_ca"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-fill p-3 border-0 bg-white fw-semibold ${activeTab === tab ? "text-primary border-bottom border-primary border-3" : "text-muted"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "can_diem_danh" ? "Cần điểm danh" : tab === "da_diem_danh" ? "Đã điểm danh" : "Tất cả lớp"}
                </button>
              ))}
            </div>

            {/* TABLE */}
            <div className="table-responsive p-3 bg-white">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Tên lớp học</th>
                    <th>Môn học</th>
                    <th>Thời gian</th>
                    <th>Phòng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        {activeTab === "can_diem_danh" 
                          ? "Tất cả lớp đã được điểm danh!" 
                          : "Không có lớp phù hợp."}
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-bold">{item.className}</td>
                        <td className="text-primary">{item.subject}</td>
                        <td>{item.time}</td>
                        <td><span className="badge bg-light text-dark border">{item.room}</span></td>
                        <td>
                          <span className={`badge ${item.status === 'done' ? 'bg-success' : item.status === 'dang' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                            {item.status === 'done' ? 'Hoàn thành' : item.status === 'dang' ? 'Đang điểm danh' : 'Chưa điểm danh'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={`btn btn-sm px-3 rounded-pill ${item.status === 'done' ? 'btn-outline-secondary' : 'btn-dark'}`}
                            onClick={() => setSelectedClass(item)}
                          >
                            {item.status === "done" ? "Xem chi tiết" : "Điểm danh"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Render Modal */}
      {selectedClass && (
        <AttendanceModal 
          classData={selectedClass} 
          onClose={() => setSelectedClass(null)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}

export default TeacherAttendance;