import React from "react";
import { useNavigate } from "react-router-dom";

const AdminCreateUser = () => {

const navigate = useNavigate();

return (

<div className="container-fluid p-4">

<button
className="btn btn-link mb-3"
onClick={()=>navigate("/admin/users")}
>
<i className="bi bi-arrow-left"></i> Quay lại
</button>

<h4 className="fw-bold text-primary mb-4">
<i className="bi bi-person-plus me-2"></i>
Thêm người dùng mới
</h4>

<div className="row">

{/* FORM */}

<div className="col-md-7">

<div className="card shadow-sm">

<div className="card-body">

<h6 className="text-primary mb-3">
Thông tin cá nhân
</h6>

<div className="mb-3">

<label className="form-label">
Họ tên *
</label>

<input
className="form-control"
/>

</div>

<div className="mb-3">

<label className="form-label">
Số điện thoại *
</label>

<input
className="form-control"
/>

</div>

<div className="mb-4">

<label className="form-label">
Địa chỉ Email
</label>

<input
className="form-control"
/>

</div>

<h6 className="text-primary mb-3">
Thông tin tài khoản
</h6>

<div className="mb-3">

<label className="form-label">
Vai trò *
</label>

<select className="form-select">

<option>Chọn vai trò</option>
<option value="Admin">Admin</option>
<option value="Giao_Vien">Giáo viên</option>
<option value="Hoc_Sinh">Học sinh</option>
<option value="Phu_Huynh">Phụ huynh</option>

</select>

</div>

<div className="mb-3">

<label className="form-label">
Mật khẩu *
</label>

<input
type="password"
className="form-control"
/>

</div>

<div className="mb-3">

<label className="form-label">
Xác nhận mật khẩu *
</label>

<input
type="password"
className="form-control"
/>

</div>

<div className="form-check mb-4">

<input
type="checkbox"
className="form-check-input"
defaultChecked
/>

<label className="form-check-label">
Kích hoạt tài khoản
</label>

</div>

<div className="d-flex justify-content-end gap-2">

<button
className="btn btn-light"
onClick={()=>navigate("/admin/users")}
>
Hủy
</button>

<button
className="btn btn-primary"
>

<i className="bi bi-person-plus me-2"></i>
Tạo người dùng

</button>

</div>

</div>

</div>

</div>

{/* PANEL BÊN PHẢI */}

<div className="col-md-5">

<div className="card shadow-sm h-100">

<div className="card-body d-flex flex-column justify-content-center align-items-center text-center">

<i
className="bi bi-mortarboard-fill text-primary"
style={{fontSize:"60px"}}
></i>

<h5 className="mt-3">
Tạo tài khoản mới
</h5>

<p className="text-muted">

Thêm người dùng vào hệ thống để quản lý,
phân quyền và sử dụng các chức năng phù hợp.

</p>

</div>

</div>

</div>

</div>

</div>

);

};

export default AdminCreateUser;