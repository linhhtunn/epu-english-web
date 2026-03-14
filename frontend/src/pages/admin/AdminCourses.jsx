import React from "react";
import { useNavigate } from "react-router-dom";

const AdminCourses = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Quản lý khóa học</h2>

      <div className="card shadow-sm rounded-4">
        <div className="card-body">

          <div className="d-flex justify-content-between mb-3">
            <h5>Danh sách khóa học</h5>

            <button
className="btn btn-primary"
onClick={()=>navigate("/admin/courses/create")}
>
Thêm khóa học
</button>
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên khóa học</th>
                <th>Mô tả</th>
                <th>Thời lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>IELTS Foundation</td>
                <td>Khóa nền tảng IELTS</td>
                <td>3 tháng</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">
                    Sửa
                  </button>

                  <button className="btn btn-danger btn-sm">
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default AdminCourses;