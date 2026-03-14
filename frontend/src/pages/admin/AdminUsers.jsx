import React from "react";
import { useNavigate } from "react-router-dom";
const AdminUsers = () => {
const navigate = useNavigate();

const users = [
{
id:1,
name:"Admin System",
phone:"0900000001",
email:"admin@educore.com",
role:"Admin",
status:"Hoạt động"
},
{
id:2,
name:"Nguyen Van A",
phone:"0900000011",
email:"teacher1@educore.com",
role:"Teacher",
status:"Hoạt động"
},
{
id:3,
name:"Tran Thi B",
phone:"0900000012",
email:"teacher2@educore.com",
role:"Teacher",
status:"Hoạt động"
},
{
id:4,
name:"Student 01",
phone:"0900000021",
email:"student1@educore.com",
role:"Student",
status:"Hoạt động"
}
];

const roleColor = (role)=>{
if(role==="Admin") return "bg-danger";
if(role==="Teacher") return "bg-success";
return "bg-info";
};

return (

<div className="p-4">

{/* HEADER */}
<div className="d-flex justify-content-between align-items-center mb-4">

<h3 className="fw-bold">
<i className="bi bi-people me-2"></i>
Quản lý người dùng
</h3>

<button
className="btn btn-primary"
onClick={()=>navigate("/admin/users/create")}
>

<i className="bi bi-person-plus me-2"></i>
Thêm người dùng

</button>

</div>

{/* FILTER */}

<div className="card mb-3">

<div className="card-body">

<div className="row g-2">

<div className="col-md-6">

<input
className="form-control"
placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
/>

</div>

<div className="col-md-3">

<select className="form-select">

<option>Tất cả vai trò</option>
<option>Admin</option>
<option>Teacher</option>
<option>Student</option>

</select>

</div>

<div className="col-md-3">

<select className="form-select">

<option>Tất cả trạng thái</option>
<option>Hoạt động</option>
<option>Tạm khóa</option>

</select>

</div>

</div>

</div>

</div>

{/* TABLE */}

<div className="card">

<div className="card-body">

<table className="table align-middle">

<thead>

<tr>
<th>#</th>
<th>Họ tên</th>
<th>Email</th>
<th>Vai trò</th>
<th>Trạng thái</th>
<th>Thao tác</th>
</tr>

</thead>

<tbody>

{users.map((user,index)=>(

<tr key={user.id}>

<td>{index+1}</td>

<td>

<div className="d-flex align-items-center">

<i className="bi bi-person-circle me-2 fs-4"></i>

<div>

<div>{user.name}</div>

<small className="text-muted">
{user.phone}
</small>

</div>

</div>

</td>

<td>{user.email}</td>

<td>

<span className={`badge ${roleColor(user.role)}`}>
{user.role}
</span>

</td>

<td>

<span className="badge bg-success">
{user.status}
</span>

</td>

<td>

<button className="btn btn-outline-primary btn-sm me-2">
<i className="bi bi-pencil"></i>
</button>

<button className="btn btn-outline-danger btn-sm">
<i className="bi bi-trash"></i>
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

);

};

export default AdminUsers;