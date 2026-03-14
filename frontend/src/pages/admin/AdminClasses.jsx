import React from "react";

import { useNavigate } from "react-router-dom";
const AdminClasses = () => {

  const classes = [
    {
      id: 1,
      name: "Nguyễn Thùy Linh",
      teacher: "003 - Giáo viên Lan",
      schedule: "Thứ 2, Thứ 3",
      time: "14:59 - 18:59",
      students: 1,
      status: "completed"
    },
    {
      id: 2,
      name: "Tobico_Ieltstar",
      teacher: "009 - Giáo viên Tùng",
      schedule: "Thứ 2, Thứ 3, Thứ 4",
      time: "07:58 - 09:58",
      students: 1,
      status: "active"
    }
  ];
  
const navigate = useNavigate();
  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Quản lý lớp học
        </h4>

<button
className="btn btn-primary"
onClick={()=>navigate("/admin/classes/create")}
>
Thêm lớp học
</button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">

          <h6 className="fw-bold mb-3">Tìm kiếm và lọc</h6>

          <div className="row g-3">

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  className="form-control"
                  placeholder="Tìm kiếm theo tên lớp hoặc giảng viên..."
                />
              </div>
            </div>

            <div className="col-md-3">
              <select className="form-select">
                <option>Tất cả giáo viên</option>
              </select>
            </div>

            <div className="col-md-3">
              <select className="form-select">
                <option>Tất cả khóa học</option>
              </select>
            </div>

            <div className="col-md-3">
              <select className="form-select">
                <option>Tất cả trạng thái</option>
              </select>
            </div>

          </div>

          <div className="mt-3 d-flex gap-4">
            <div className="form-check">
              <input type="checkbox" className="form-check-input"/>
              <label className="form-check-label">
                Hiện lớp đã ẩn
              </label>
            </div>

            <div className="form-check">
              <input type="checkbox" className="form-check-input"/>
              <label className="form-check-label">
                Ẩn lớp đã hoàn thành
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">

        <div className="card-body">

          <h6 className="fw-bold mb-3">Danh sách lớp học</h6>

          <table className="table align-middle">

            <thead>
              <tr>
                <th>#</th>
                <th>Tên lớp học</th>
                <th>Thời gian học</th>
                <th>Giáo viên</th>
                <th>Số học viên</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>

              {classes.map((cls,index)=>(
                <tr key={cls.id}>

                  <td>{index+1}</td>

                  <td className="fw-semibold">
                    <i className="bi bi-mortarboard text-primary me-2"></i>
                    {cls.name}
                  </td>

                  <td>

                    <span className="badge bg-info me-2">
                      <i className="bi bi-calendar me-1"></i>
                      {cls.schedule}
                    </span>

                    <span className="badge bg-success">
                      <i className="bi bi-clock me-1"></i>
                      {cls.time}
                    </span>

                  </td>

                  <td>
                    <span className="badge bg-secondary">
                      {cls.teacher}
                    </span>
                  </td>

                  <td>
                    <span className="badge bg-info">
                      {cls.students}
                    </span>
                  </td>

                  <td>

                    {cls.status === "active" ? (
                      <span className="badge bg-success">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Đã hoàn thành
                      </span>
                    )}

                  </td>

                  <td>

                    <div className="btn-group">

                      <button className="btn btn-light border">
                        <i className="bi bi-eye"></i>
                      </button>

                      <button className="btn btn-light border">
                        <i className="bi bi-calendar"></i>
                      </button>
<button
className="btn btn-light border"
onClick={()=>navigate("/admin/classes/assign-students")}
>
<i className="bi bi-person-plus"></i>
</button>

                      <button className="btn btn-light border">
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button className="btn btn-light border">
                        <i className="bi bi-eye-slash"></i>
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <small className="text-muted">
            Hiển thị 1 - 2 trên tổng số 2 lớp học
          </small>

        </div>
      </div>

    </div>
  );
};

export default AdminClasses;