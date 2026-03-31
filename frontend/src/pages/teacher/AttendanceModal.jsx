import { useState, useEffect } from "react";
import { getStudentsInSession, saveAttendance } from "../../services/attendanceService";

const STATUS_MAP = {
  Co_Mat: { label: "Có mặt", icon: "✓", btnClass: "btn-success", badgeClass: "bg-success", textClass: "text-success" },
  Vang: { label: "Vắng mặt", icon: "✕", btnClass: "btn-danger", badgeClass: "bg-danger", textClass: "text-danger" },
  Di_Muon: { label: "Đi muộn", icon: "⏰", btnClass: "btn-warning", badgeClass: "bg-warning", textClass: "text-warning" },
};

/**
 * Modal điểm danh học sinh trong một buổi học. Kết nối API thực, hỗ trợ chế độ xem & chỉnh sửa.
 * Creatby: Nguyễn Thùy Linh - 14/3/2026
 * Updateby: Nguyễn Thùy Linh - 24/3/2026
 */
function AttendanceModal({ session, onClose, onSaved, readOnly }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getStudentsInSession(session.maBuoiHoc);
        setStudents(
          res.data.map((s) => ({
            maHocSinh: s.maHocSinh,
            hoTen: s.hoTen,
            trangThai: s.trangThai || null,
          }))
        );
      } catch {
        setError("Không thể tải danh sách học sinh. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [session.maBuoiHoc]);

  const handleStatus = (maHocSinh, trangThai) => {
    if (readOnly) return;
    setStudents((prev) =>
      prev.map((s) => (s.maHocSinh === maHocSinh ? { ...s, trangThai } : s))
    );
  };

  const handleSelectAll = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, trangThai: "Co_Mat" })));
  };

  const handleSave = async () => {
    const unmarked = students.filter((s) => !s.trangThai);
    if (unmarked.length > 0) {
      setError(`Còn ${unmarked.length} học sinh chưa được điểm danh!`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = students.map((s) => ({
        maHocSinh: s.maHocSinh,
        trangThai: s.trangThai,
      }));
      await saveAttendance(session.maBuoiHoc, payload);
      setSuccessMsg("Điểm danh đã được lưu thành công!");
      setTimeout(() => onSaved(session.maBuoiHoc), 1500);
    } catch {
      setError("Lưu điểm danh thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: students.length,
    present: students.filter((s) => s.trangThai === "Co_Mat").length,
    absent: students.filter((s) => s.trangThai === "Vang").length,
    late: students.filter((s) => s.trangThai === "Di_Muon").length,
    unmarked: students.filter((s) => !s.trangThai).length,
  };

  const progressPct = stats.total > 0 ? Math.round(((stats.total - stats.unmarked) / stats.total) * 100) : 0;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)", zIndex: 1050 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">

          {/* Header */}
          <div
            className="modal-header border-0 text-white px-4 py-3"
            style={{ background: "linear-gradient(135deg, #005197 0%, #0081f1 100%)" }}
          >
            <div className="flex-grow-1">
              <h5 className="modal-title fw-bold mb-1">
                <i className="bi bi-person-check-fill me-2"></i>
                Điểm danh: {session.className}
              </h5>
              <p className="mb-0 opacity-75 small">
                <i className="bi bi-clock me-1"></i>
                {session.gioBatDau} – {session.gioKetThuc}
                {session.courseName && (
                  <span className="ms-3">
                    <i className="bi bi-book me-1"></i>{session.courseName}
                  </span>
                )}
                {readOnly && (
                  <span className="ms-3 badge bg-white bg-opacity-25 rounded-pill">
                    <i className="bi bi-eye me-1"></i>Chế độ xem
                  </span>
                )}
              </p>
            </div>
            <button type="button" className="btn-close btn-close-white ms-3" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-3 small">Đang tải danh sách học sinh...</p>
              </div>
            ) : error && students.length === 0 ? (
              <div className="p-4">
                <div className="alert alert-danger rounded-3">{error}</div>
              </div>
            ) : (
              <>
                {/* Stats nhanh */}
                <div className="px-4 pt-4 pb-2">
                  <div className="row g-3 mb-3">
                    {[
                      { label: "Tổng số", value: stats.total, color: "#005197", bg: "#e8f0fe" },
                      { label: "Có mặt", value: stats.present, color: "#198754", bg: "#e8f5e9" },
                      { label: "Vắng mặt", value: stats.absent, color: "#dc3545", bg: "#fdecea" },
                      { label: "Đi muộn", value: stats.late, color: "#f39c12", bg: "#fff8e1" },
                      { label: "Chưa điểm", value: stats.unmarked, color: "#6c757d", bg: "#f5f5f5" },
                    ].map((st, i) => (
                      <div className="col" key={i}>
                        <div
                          className="text-center rounded-3 py-2"
                          style={{ background: st.bg }}
                        >
                          <div className="fw-bold fs-5" style={{ color: st.color }}>{st.value}</div>
                          <div className="text-muted" style={{ fontSize: "10px" }}>{st.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Tiến độ điểm danh</span>
                      <span className="fw-semibold">{progressPct}%</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-primary rounded-pill"
                        style={{ width: `${progressPct}%`, transition: "width 0.4s" }}
                      ></div>
                    </div>
                  </div>

                  {!readOnly && (
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill mb-1"
                      onClick={handleSelectAll}
                    >
                      <i className="bi bi-check2-all me-1"></i>Chọn tất cả "Có mặt"
                    </button>
                  )}
                </div>

                {/* Alerts */}
                {error && (
                  <div className="alert alert-warning rounded-0 mb-0 py-2 px-4 d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                    <small>{error}</small>
                    <button className="btn-close btn-sm ms-auto" onClick={() => setError(null)}></button>
                  </div>
                )}
                {successMsg && (
                  <div className="alert alert-success rounded-0 mb-0 py-2 px-4 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <small>{successMsg}</small>
                  </div>
                )}

                {/* Danh sách học sinh */}
                <div className="px-4 py-2">
                  {students.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-people fs-3 d-block mb-2 opacity-50"></i>
                      Không có học sinh trong lớp này.
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {students.map((s, index) => (
                        <div
                          key={s.maHocSinh}
                          className="list-group-item px-0 py-3 d-flex align-items-center gap-3 border-bottom"
                        >
                          {/* Avatar + số thứ tự */}
                          <div className="d-flex align-items-center gap-2" style={{ minWidth: "180px" }}>
                            <span
                              className="text-muted fw-semibold"
                              style={{ width: "24px", fontSize: "12px" }}
                            >
                              {index + 1}
                            </span>
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                              style={{
                                width: "38px",
                                height: "38px",
                                flexShrink: 0,
                                background: "linear-gradient(135deg, #005197, #0081f1)",
                                fontSize: "14px",
                              }}
                            >
                              {s.hoTen.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-semibold text-dark">{s.hoTen}</span>
                          </div>

                          {/* Nút trạng thái */}
                          <div className="d-flex gap-2 flex-grow-1 justify-content-center">
                            {Object.entries(STATUS_MAP).map(([key, val]) => (
                              <button
                                key={key}
                                className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                                  s.trangThai === key
                                    ? val.btnClass
                                    : `btn-outline-${val.btnClass.replace("btn-", "")}`
                                }`}
                                style={{ fontSize: "12px", opacity: readOnly && s.trangThai !== key ? 0.4 : 1 }}
                                onClick={() => handleStatus(s.maHocSinh, key)}
                                disabled={readOnly}
                              >
                                {val.icon} {val.label}
                              </button>
                            ))}
                          </div>

                          {/* Badge trạng thái hiện tại */}
                          {s.trangThai ? (
                            <span
                              className={`badge rounded-pill ${STATUS_MAP[s.trangThai]?.badgeClass ?? "bg-secondary"} ms-auto`}
                              style={{ fontSize: "11px", minWidth: "70px" }}
                            >
                              {STATUS_MAP[s.trangThai]?.label}
                            </span>
                          ) : (
                            <span
                              className="badge rounded-pill bg-light text-muted border ms-auto"
                              style={{ fontSize: "11px", minWidth: "70px" }}
                            >
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-light px-4 py-3">
            <button className="btn btn-light border px-4 rounded-pill" onClick={onClose}>
              <i className="bi bi-x-lg me-2"></i>Đóng
            </button>
            {!readOnly && !loading && (
              <button
                className="btn btn-primary px-5 rounded-pill fw-semibold"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="bi bi-floppy me-2"></i>Lưu điểm danh
                    {stats.unmarked > 0 && (
                      <span className="badge bg-white text-primary ms-2 rounded-pill" style={{ fontSize: "11px" }}>
                        {stats.unmarked} chưa chọn
                      </span>
                    )}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceModal;