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
    name: "",
    courseId: "",
    teacherId: "",
    status: "active",
    schedules: [],
    rawScheduleText: "",
    description: ""
  });

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    document.title = isEditMode ? "Cáº­p nháº­t lá»›p há»c | EPU English" : "ThÃªm lá»›p há»c | EPU English";

    const fetchData = async () => {
      try {
        const [courseData, userData] = await Promise.all([
          courseService.getAllCourses(),
          userService.getAllUsers()
        ]);

        setCourses(courseData);
        setTeachers(userData.filter((u) => u.roleName === "Giao_Vien"));

        if (isEditMode) {
          const classData = await classService.getClassById(id);
          const schedulesFromDB = (classData.lichHoc || "")
            .split(", ")
            .map((s, index) => {
              const match = s.match(/(.+?) \((.+?)\)/);
              if (match) {
                return { id: Date.now() + index, day: match[1], shift: match[2] };
              }
              return null;
            })
            .filter(Boolean);

          setForm((prev) => ({
            ...prev,
            name: classData.maLopHienThi || "",
            courseId: classData.maKhoaHoc || "",
            teacherId: classData.maGiaoVien || "",
            schedules: schedulesFromDB,
            rawScheduleText: classData.lichHoc || "",
          }));
        }
      } catch (error) {
        console.error("Lá»—i khi táº£i dá»¯ liá»‡u", error);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const daysOfWeek = [
    { value: "Monday", label: "Thá»© 2" },
    { value: "Tuesday", label: "Thá»© 3" },
    { value: "Wednesday", label: "Thá»© 4" },
    { value: "Thursday", label: "Thá»© 5" },
    { value: "Friday", label: "Thá»© 6" },
    { value: "Saturday", label: "Thá»© 7" },
    { value: "Sunday", label: "Chá»§ nháº­t" },
  ];

  const shifts = [
    { value: "shift1", label: "Ca 1 (07:30 - 09:30)" },
    { value: "shift2", label: "Ca 2 (09:45 - 11:45)" },
    { value: "shift3", label: "Ca 3 (13:30 - 15:30)" },
    { value: "shift4", label: "Ca 4 (15:45 - 17:45)" },
    { value: "shift5", label: "Ca 5 (18:00 - 20:00)" },
    { value: "shift6", label: "Ca 6 (20:15 - 22:15)" },
  ];

  const addSchedule = () => {
    const newSchedule = { id: Date.now(), day: "", shift: "" };
    setForm({ ...form, schedules: [...form.schedules, newSchedule] });
  };

  const deleteSchedule = (scheduleId) => {
    setForm({
      ...form,
      schedules: form.schedules.filter((s) => s.id !== scheduleId),
    });
  };

  const updateSchedule = (scheduleId, field, value) => {
    const updatedSchedules = form.schedules.map((s) =>
      s.id === scheduleId ? { ...s, [field]: value } : s
    );
    setForm({ ...form, schedules: updatedSchedules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.courseId) {
      alert("Vui lÃ²ng Ä‘iá»n mÃ£ lá»›p vÃ  chá»n khÃ³a há»c");
      return;
    }

    const lichHocStr = form.schedules
      .filter((s) => s.day && s.shift)
      .map((s) => `${s.day} (${s.shift})`)
      .join(", ") || form.rawScheduleText.trim();

    setLoading(true);
    try {
      const payload = {
        maLopHienThi: form.name,
        maKhoaHoc: parseInt(form.courseId, 10),
        maGiaoVien: form.teacherId ? parseInt(form.teacherId, 10) : null,
        lichHoc: lichHocStr
      };

      if (isEditMode) {
        await classService.updateClass(id, payload);
        alert("Cáº­p nháº­t lá»›p há»c thÃ nh cÃ´ng!");
      } else {
        await classService.createClass(payload);
        alert("Táº¡o lá»›p há»c thÃ nh cÃ´ng!");
      }

      navigate("/admin/classes");
    } catch (error) {
      alert(error.response?.data || "CÃ³ lá»—i xáº£y ra khi lÆ°u thÃ´ng tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="mb-3">
        <button className="btn btn-link text-decoration-none" onClick={() => navigate(-1)}>
          â† Quay láº¡i
        </button>
      </div>

      <h3 className="mb-4">ðŸ“˜ {isEditMode ? "Cáº­p nháº­t lá»›p há»c" : "Táº¡o lá»›p há»c má»›i"}</h3>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">ThÃ´ng tin lá»›p há»c</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">TÃªn lá»›p há»c *</label>
                <input
                  className="form-control"
                  placeholder="VÃ­ dá»¥: Lá»›p tiáº¿ng Anh cÆ¡ báº£n"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={isEditMode}
                  style={{ backgroundColor: isEditMode ? "#e9ecef" : "" }}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">KhÃ³a há»c *</label>
                  <select
                    className="form-select"
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    required
                  >
                    <option value="">Chá»n khÃ³a há»c</option>
                    {courses.map((course) => (
                      <option key={course.maKhoaHoc} value={course.maKhoaHoc}>
                        {course.tenKhoaHoc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Tráº¡ng thÃ¡i *</label>
                  <select
                    className="form-select"
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Äang hoáº¡t Ä‘á»™ng</option>
                    <option value="inactive">Táº¡m dá»«ng</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">GiÃ¡o viÃªn *</label>
                <select
                  className="form-select"
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                >
                  <option value="">Chá»n giÃ¡o viÃªn</option>
                  {teachers.map((teacher) => (
                    <option
                      key={teacher.maNguoiDung}
                      value={teacher.maGiaoVien || ""}
                      disabled={!teacher.maGiaoVien}
                    >
                      {teacher.hoTen} ({teacher.tenDangNhap})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="form-label fw-bold mb-0">Lá»‹ch há»c</label>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={addSchedule}
                  >
                    <Plus size={16} /> ThÃªm lá»‹ch
                  </button>
                </div>

                {form.schedules.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {form.schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="d-flex align-items-center gap-2 p-2 border rounded bg-light"
                      >
                        <div className="flex-grow-1">
                          <select
                            className="form-select form-select-sm"
                            value={schedule.day}
                            onChange={(e) => updateSchedule(schedule.id, "day", e.target.value)}
                          >
                            <option value="">Chá»n thá»©</option>
                            {daysOfWeek.map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-grow-1">
                          <select
                            className="form-select form-select-sm"
                            value={schedule.shift}
                            onChange={(e) => updateSchedule(schedule.id, "shift", e.target.value)}
                          >
                            <option value="">Chá»n ca</option>
                            {shifts.map((shift) => (
                              <option key={shift.value} value={shift.value}>
                                {shift.label}
                              </option>
                            ))}
                          </select>
                        </div>

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
                  <div>
                    <small className="text-muted d-block mt-1">ChÆ°a cÃ³ lá»‹ch há»c nÃ o Ä‘Æ°á»£c thÃªm.</small>
                    {form.rawScheduleText ? (
                      <small className="text-muted d-block mt-2">
                        Lá»‹ch hiá»‡n táº¡i: {form.rawScheduleText}
                      </small>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">MÃ´ táº£</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Nháº­p mÃ´ táº£ lá»›p há»c..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={() => navigate(-1)}>
                  Há»§y
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  ðŸ“˜ {loading ? "Äang lÆ°u..." : isEditMode ? "Cáº­p nháº­t" : "Táº¡o lá»›p há»c"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-6 d-flex nalign-items-center justify-content-center">
          <div className="text-center">
            <div style={{ fontSize: "70px" }}>ðŸŽ“</div>
            <h5 className="mt-3">{isEditMode ? "Cáº­p nháº­t lá»›p há»c" : "Táº¡o lá»›p há»c má»›i"}</h5>
            <p className="text-muted">
              {isEditMode
                ? "Cáº­p nháº­t thÃ´ng tin giáº£ng viÃªn vÃ  lá»‹ch há»c cho lá»›p."
                : "ThÃªm lá»›p há»c vÃ o há»‡ thá»‘ng Ä‘á»ƒ quáº£n lÃ½ há»c viÃªn vÃ  lá»‹ch há»c."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
