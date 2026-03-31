import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSessions } from "../../services/attendanceService";
import AttendanceModal from "./AttendanceModal";

/**
 * Chức năng: Quản lý danh sách lớp học và thực hiện điểm danh cho giáo viên.
 * Kết nối API thực tế, hỗ trợ chọn ngày, lọc trạng thái, thống kê nhanh.
 * Creatby: Nguyễn Thùy Linh - 14/3/2026
 * Updateby: Nguyễn Thùy Linh - 24/3/2026
 */
function TeacherAttendance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("can_diem_danh");
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ngày được chọn (mặc định hôm nay)
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // teacherId: login trả về profileId = MaGiaoVien cho giáo viên
  const teacherId = user?.profileId;

  const fetchSessions = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getSessions(teacherId, selectedDate);
      setSessions(res.data);
    } catch (err) {
      setError("Không thể tải danh sách buổi học. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [teacherId, selectedDate]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Cập nhật trạng thái session sau khi điểm danh xong
  const handleAttendanceSaved = (sessionId) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.maBuoiHoc === sessionId ? { ...s, daDiemDanh: true } : s
      )
    );
    setSelectedSession(null);
  };

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === "can_diem_danh") return !s.daDiemDanh;
    if (activeTab === "da_diem_danh") return s.daDiemDanh;
    return true;
  });

  const totalSessions = sessions.length;
  const doneSessions = sessions.filter((s) => s.daDiemDanh).length;
  const pendingSessions = totalSessions - doneSessions;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container-fluid p-4" style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "#1a1a2e" }}>
            <i className="bi bi-person-check-fill me-2 text-primary"></i>Điểm danh
          </h2>
          <p className="text-muted mb-0 small">
            {selectedDate === todayStr ? "Hôm nay, " : ""}
            {formatDate(selectedDate)}
          </p>
        </div>

        {/* Chọn ngày */}
        <div className="d-flex align-items-center gap-2">
          <label className="text-muted small fw-semibold">Chọn ngày:</label>
          <input
            type="date"
            className="form-control form-control-sm rounded-3"
            style={{ width: "160px" }}
            value={selectedDate}
            max={todayStr}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate !== todayStr && (
            <button
              className="btn btn-sm btn-outline-secondary rounded-3"
              onClick={() => setSelectedDate(todayStr)}
            >
              Hôm nay
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        {[
          { label: "Tổng buổi học", value: totalSessions, color: "#005197", icon: "bi-calendar3", bg: "#e8f0fe" },
          { label: "Đã điểm danh", value: doneSessions, color: "#198754", icon: "bi-check-circle-fill", bg: "#e8f5e9" },
          { label: "Chưa điểm danh", value: pendingSessions, color: "#dc3545", icon: "bi-clock-fill", bg: "#fff3cd" },
        ].map((stat, i) => (
          <div className="col-md-4" key={i}>
            <div
              className="card border-0 rounded-4 shadow-sm p-3 d-flex flex-row align-items-center gap-3"
              style={{ background: "white" }}
            >
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, background: stat.bg, flexShrink: 0 }}
              >
                <i className={`bi ${stat.icon} fs-5`} style={{ color: stat.color }}></i>
              </div>
              <div>
                <div className="text-muted small">{stat.label}</div>
                <div className="fw-bold fs-4" style={{ color: stat.color }}>
                  {loading ? <span className="placeholder col-2">-</span> : stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS + TABLE */}
      <div className="card border-0 rounded-4 shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="d-flex border-bottom bg-white">
          {[
            { key: "can_diem_danh", label: "Cần điểm danh", icon: "bi-hourglass-split", count: pendingSessions },
            { key: "da_diem_danh", label: "Đã điểm danh", icon: "bi-check2-all", count: doneSessions },
            { key: "tat_ca", label: "Tất cả", icon: "bi-list-ul", count: totalSessions },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex-fill py-3 border-0 bg-transparent fw-semibold small d-flex align-items-center justify-content-center gap-2 ${
                activeTab === tab.key
                  ? "text-primary border-bottom border-primary border-3"
                  : "text-muted"
              }`}
              style={{ transition: "all 0.2s" }}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
              <span
                className={`badge rounded-pill ms-1 ${
                  activeTab === tab.key ? "bg-primary" : "bg-secondary bg-opacity-25 text-secondary"
                }`}
                style={{ fontSize: "10px" }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Nội dung */}
        <div className="bg-white p-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="text-muted mt-3 small">Đang tải danh sách buổi học...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
              <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchSessions}>
                Thử lại
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 mb-3 d-block opacity-50"></i>
              <p className="fw-semibold">
                {activeTab === "can_diem_danh"
                  ? "Không có buổi học nào cần điểm danh."
                  : activeTab === "da_diem_danh"
                  ? "Chưa có buổi học nào được điểm danh."
                  : "Không có buổi học nào trong ngày này."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead>
                  <tr className="text-muted" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    <th className="border-0 bg-light ps-4 rounded-start-3">Lớp học</th>
                    <th className="border-0 bg-light">Khóa học</th>
                    <th className="border-0 bg-light">Thời gian</th>
                    <th className="border-0 bg-light text-center">Trạng thái</th>
                    <th className="border-0 bg-light text-end pe-4 rounded-end-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session) => (
                    <tr key={session.maBuoiHoc} style={{ transition: "all 0.2s" }}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{session.className}</div>
                        {session.ghiChu && (
                          <small className="text-muted">{session.ghiChu}</small>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                          {session.courseName || "—"}
                        </span>
                      </td>
                      <td>
                        <i className="bi bi-clock me-1 text-muted"></i>
                        <span className="fw-semibold">{session.gioBatDau} – {session.gioKetThuc}</span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            session.daDiemDanh
                              ? "bg-success bg-opacity-10 text-success"
                              : "bg-warning bg-opacity-15 text-warning"
                          }`}
                          style={{ fontSize: "12px" }}
                        >
                          <i className={`bi me-1 ${session.daDiemDanh ? "bi-check-circle-fill" : "bi-hourglass-split"}`}></i>
                          {session.daDiemDanh ? "Hoàn thành" : "Chưa điểm danh"}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                            session.daDiemDanh
                              ? "btn-outline-secondary"
                              : "btn-primary"
                          }`}
                          onClick={() => setSelectedSession(session)}
                        >
                          <i className={`bi me-1 ${session.daDiemDanh ? "bi-eye" : "bi-person-check"}`}></i>
                          {session.daDiemDanh ? "Xem chi tiết" : "Điểm danh"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal điểm danh */}
      {selectedSession && (
        <AttendanceModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSaved={handleAttendanceSaved}
          readOnly={selectedSession.daDiemDanh}
        />
      )}
    </div>
  );
}

export default TeacherAttendance;