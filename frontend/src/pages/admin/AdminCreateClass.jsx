import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react"; 
import { classService } from "../../services/classService";
import { courseService } from "../../services/courseService";
import { userService } from "../../services/userService";

export default function AdminCreateClass() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", // maLopHienThi
    courseId: "", // maKhoaHoc
    teacherId: "", // maGiaoVien
    status: "active",
    schedules: [], 
    description: "" // Mapped if available in DB
  });

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    document.title = isEditMode ? "Cập nhật lớp học | EPU English" : "Thêm lớp học | EPU English";
    const fetchData = async () => {
      try {
        const [courseData, userData] = await Promise.all([
          courseService.getAllCourses(),
          userService.getAllUsers()
        ]);
        setCourses(courseData);
        setTeachers(userData.filter(u => u.roleName === 'Giao_Vien'));

        if (isEditMode) {
          const classData = await classService.getClassById(id);
          const schedulesFromDB = (classData.lichHoc || "").split(", ").map((s, index) => {
            const match = s.match(/(.+?) \((.+?)\)/);
            if (match) {
              return { id: Date.now() + index, day: match[1], shift: match[2] };
            }
            return null;
          }).filter(Boolean);

          setForm(prev => ({
            ...prev,
            name: classData.maLopHienThi || "",
            courseId: classData.maKhoaHoc || "",
            teacherId: classData.maGiaoVien || "",
            schedules: schedulesFromDB,
            // description: classData.moTa || "" // Backend API doesnt seem to have description, ignore for now
          }));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // Dữ liệu mẫu cho Select
  const daysOfWeek = [
    { value: "Monday", label: "Thứ 2" },
    { value: "Tuesday", label: "Thứ 3" },
    { value: "Wednesday", label: "Thứ 4" },
    { value: "Thursday", label: "Thứ 5" },
    { value: "Friday", label: "Thứ 6" },
    { value: "Saturday", label: "Thứ 7" },
    { value: "Sunday", label: "Chủ nhật" },
  ];

  const shifts = [
    { value: "shift1", label: "Ca 1 (07:30 - 09:30)" },
    { value: "shift2", label: "Ca 2 (09:45 - 11:45)" },
    { value: "shift3", label: "Ca 3 (13:30 - 15:30)" },
    { value: "shift4", label: "Ca 4 (15:45 - 17:45)" },
    { value: "shift5", label: "Ca 5 (18:00 - 20:00)" },
    { value: "shift6", label: "Ca 6 (20:15 - 22:15)" },
  ];

  // Logic xử lý lịch học
  const addSchedule = () => {
    const newSchedule = { id: Date.now(), day: "", shift: "" };
    setForm({ ...form, schedules: [...form.schedules, newSchedule] });
  };

  const deleteSchedule = (id) => {
    setForm({
      ...form,
      schedules: form.schedules.filter((s) => s.id !== id),
    });
  };

  const updateSchedule = (id, field, value) => {
    const updatedSchedules = form.schedules.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setForm({ ...form, schedules: updatedSchedules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.courseId) {
      alert("Vui lòng điền mã lớp và chọn khóa học");
      return;
    }

    const lichHocStr = form.schedules
      .filter(s => s.day && s.shift)
      .map(s => `${s.day} (${s.shift})`)
      .join(", ");

    setLoading(true);
    try {
      const payload = {
        maLopHienThi: form.name,
        maKhoaHoc: parseInt(form.courseId),
        maGiaoVien: form.teacherId ? parseInt(form.teacherId) : null,
        lichHoc: lichHocStr
      };

      if (isEditMode) {
        await classService.updateClass(id, payload);
        alert('Cập nhật lớp học thành công!');
      } else {
        await classService.createClass(payload);
        alert('Tạo lớp học thành công!');
      }
      navigate("/admin/classes");
    } catch (error) {
      alert(error.response?.data || "Có lỗi xảy ra khi lưu thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* BACK */}
      <div className="mb-3">
        <button className="btn btn-link text-decoration-none" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>

      <h3 className="mb-4">📘 {isEditMode ? 'Cập nhật lớp học' : 'Tạo lớp học mới'}</h3>

      <div className="row">
        {/* FORM */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Thông tin lớp học</h5>

            <form onSubmit={handleSubmit}>
              {/* TÊN LỚP HỌC */}
              <div className="mb-3">
                <label className="form-label fw-bold">Tên lớp học *</label>
                <input
                  className="form-control"
                  placeholder="Ví dụ: Lớp tiếng Anh cơ bản"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={isEditMode}
                  style={{ backgroundColor: isEditMode ? '#e9ecef' : '' }}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Khóa học *</label>
                  <select
                    className="form-select"
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    required
                  >
                    <option value="">Chọn khóa học</option>
                    {courses.map(c => (
                      <option key={c.maKhoaHoc} value={c.maKhoaHoc}>{c.tenKhoaHoc}</option>
                    ))}
                  </select>
                </div>

                {/* TRẠNG THÁI */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Trạng thái *</label>
                  <select
                    className="form-select"
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                  </select>
                </div>
              </div>

              {/* GIÁO VIÊN */}
              <div className="mb-3">
                <label className="form-label fw-bold">Giáo viên *</label>
                <select
                  className="form-select"
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                >
                  <option value="">Chọn giáo viên</option>
                  {teachers.map(t => (
                    <option key={t.maNguoiDung} value={t.maNguoiDung}>{t.hoTen} ({t.tenDangNhap})</option>
                  ))}
                </select>
              </div>

              {/* PHẦN LỊCH HỌC (THAY THẾ CODE FIGMA VÀO ĐÂY) */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="form-label fw-bold mb-0">Lịch học</label>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={addSchedule}
                  >
                    <Plus size={16} /> Thêm lịch
                  </button>
                </div>

                {form.schedules.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {form.schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="d-flex align-items-center gap-2 p-2 border rounded bg-light"
                      >
                        {/* Select Thứ */}
                        <div className="flex-grow-1">
                          <select
                            className="form-select form-select-sm"
                            value={schedule.day}
                            onChange={(e) => updateSchedule(schedule.id, "day", e.target.value)}
                          >
                            <option value="">Chọn thứ</option>
                            {daysOfWeek.map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Select Ca học */}
                        <div className="flex-grow-1">
                          <select
                            className="form-select form-select-sm"
                            value={schedule.shift}
                            onChange={(e) => updateSchedule(schedule.id, "shift", e.target.value)}
                          >
                            <option value="">Chọn ca</option>
                            {shifts.map((shift) => (
                              <option key={shift.value} value={shift.value}>
                                {shift.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Nút xóa */}
                        <button
                          type="button"
                          className="btn btn-link text-danger p-1"
                          onClick={() => deleteSchedule(schedule.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <small className="text-muted d-block mt-1">Chưa có lịch học nào được thêm.</small>
                )}
              </div>

              {/* MÔ TẢ */}
              <div className="mb-3">
                <label className="form-label fw-bold">Mô tả</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Nhập mô tả lớp học..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={() => navigate(-1)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  📘 {loading ? "Đang lưu..." : (isEditMode ? "Cập nhật" : "Tạo lớp học")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 d-flex nalign-items-center justify-content-center">
          <div className="text-center">
            <div style={{ fontSize: "70px" }}>🎓</div>
            <h5 className="mt-3">{isEditMode ? 'Cập nhật lớp học' : 'Tạo lớp học mới'}</h5>
            <p className="text-muted">
              {isEditMode ? 'Cập nhật thông tin giảng viên và lịch học cho lớp.' : 'Thêm lớp học vào hệ thống để quản lý học viên và lịch học.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}