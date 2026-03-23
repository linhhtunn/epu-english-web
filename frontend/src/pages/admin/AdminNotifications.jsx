import React, { useState } from "react";
/**
 * Chức năng: Hiển thị và quản lý danh sách thông báo cho admin
 * Updateby: Nguyễn Thùy Linh - 18/3/2026
 */
const AdminNotifications = () => {
  // 1. Dữ liệu giả
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nghỉ lễ Giỗ tổ Hùng Vương",
      content: "Trung tâm nghỉ lễ vào ngày 10/3 Âm lịch.",
      target: "Tất cả",
      date: "2026-03-15",
    },
    {
      id: 2,
      title: "Nhắc nhở đóng học phí",
      content: "Hạn chót đóng học phí tháng 3 là 20/03/2026.",
      target: "Phụ huynh",
      date: "2026-03-10",
    },
  ]);

  // State lọc dữ liệu
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("Tất cả đối tượng");

  //State quản lý model và form
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
    target: "Tất cả",
  });

  // 2. Hàm xử lý(CRUD)
  const handleOpenModal = (notification = null) => {
    if (notification) {
      setIsEditing(true);
      setFormData(notification);
    } else {
      setIsEditing(false);
      setFormData({ id: null, title: "", content: "", target: "Tất cả" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
      return;
    }

    if (isEditing) {
      setNotifications(
        notifications.map((item) =>
          item.id === formData.id ? { ...formData, date: item.date } : item,
        ),
      );
    } else {
      const newNotification = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
      };
      setNotifications([newNotification, ...notifications]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      setNotifications(notifications.filter((item) => item.id !== id));
    }
  };

  // 3. Hàm render màu cho role
  const targetColor = (target) => {
    if (target === "Tất cả") return "bg-success";
    if (target === "Giáo viên") return "bg-warning text-dark";
    if (target === "Phụ huynh") return "bg-info text-dark";
    return "bg-primary"; // Học sinh
  };

  // Lọc dữ liệu trước khi hiển thị
  const filteredNotifications = notifications.filter((item) => {
    const matchSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchTarget =
      filterTarget === "Tất cả đối tượng" || item.target === filterTarget;
    return matchSearch && matchTarget;
  });

  // 4. Main
  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          <i className="bi bi-bell me-2"></i>
          Quản lý thông báo
        </h3>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle me-2"></i> Thêm thông báo
        </button>
      </div>

      {/* Filter */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Tìm kiếm theo tiêu đề thông báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterTarget}
                onChange={(e) => setFilterTarget(e.target.value)}
              >
                <option>Tất cả đối tượng</option>
                <option>Tất cả</option>
                <option>Học sinh</option>
                <option>Giáo viên</option>
                <option>Phụ huynh</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="card">
        <div className="card-body">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Ngày đăng</th>
                <th>Tiêu đề</th>
                <th>Đối tượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Không tìm thấy thông báo nào.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>
                      <div className="fw-medium">{item.title}</div>
                      {/* Thêm phần hiển thị 1 đoạn ngắn nội dung giống cách hiển thị sđt ở AdminUsers */}
                      <small
                        className="text-muted text-truncate d-inline-block"
                        style={{ maxWidth: "250px" }}
                      >
                        {item.content}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${targetColor(item.target)}`}>
                        {item.target}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleOpenModal(item)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form*/}
      {showModal && (
        <div className="modal-overlay" style={overlayStyle}>
          <div
            className="card border-0 shadow rounded-4 p-4"
            style={{ width: "500px", maxWidth: "90%" }}
          >
            <h4 className="mb-4">
              {isEditing ? "Sửa thông báo" : "Thêm thông báo mới"}
            </h4>

            <div className="mb-3">
              <label className="form-label fw-medium">Tiêu đề</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Đối tượng nhận</label>
              <select
                className="form-select"
                name="target"
                value={formData.target}
                onChange={handleChange}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Học sinh">Học sinh</option>
                <option value="Giáo viên">Giáo viên</option>
                <option value="Phụ huynh">Phụ huynh</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Nội dung</label>
              <textarea
                className="form-control"
                name="content"
                rows="4"
                value={formData.content}
                onChange={handleChange}
                placeholder="Nhập nội dung thông báo..."
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <i className="bi bi-save me-2"></i>Lưu thông báo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Style nội bộ cho Modal (Popup) để làm mờ nền
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1050,
};

export default AdminNotifications;
