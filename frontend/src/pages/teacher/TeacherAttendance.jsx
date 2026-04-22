import { useState, useEffect } from "react";
import AttendanceModal from "./AttendanceModal";

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

  useEffect(() => {
    document.title = "Điểm danh | EPU English";
  }, []);

  // Dữ liệu mẫu có kèm danh sách học sinh
  const [classes, setClasses] = useState([
    {
      id: 1,
      className: "English Class 10A1",
      subject: "Grammar",
      time: "07:00 - 08:30",
      room: "A101",
      status: "chua",
      students: [
        { id: "s1", name: "Nguyễn Văn An", status: null, note: "" },
        { id: "s2", name: "Lê Thị Bình", status: null, note: "" },
      ]
    },
    {
      id: 2,
      className: "English Class 11B1",
      subject: "IELTS",
      time: "10:45 - 12:15",
      room: "B201",
      status: "done",
      students: [
        { id: "s3", name: "Trần Văn Cường", status: "present", note: "" },
      ]
    }
  ]);

  // Tính toán thống kê
  const totalClasses = classes.length;
  const doneClasses = classes.filter(c => c.status === "done").length;
  const pendingClasses = totalClasses - doneClasses;

  const filteredClasses = classes.filter((item) => {
    if (activeTab === "can_diem_danh") return item.status === "chua" || item.status === "dang";
    if (activeTab === "da_diem_danh") return item.status === "done";
    return true;
  });

  const handleSave = (updatedClass) => {
    setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
    setSelectedClass(null);
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <h2 className="fw-bold mb-4">Điểm danh</h2>

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
                <th>Thời gian</th>
                <th>Phòng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((item) => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.className}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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