import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAssignStudent = () => {

const navigate = useNavigate();

const [students] = useState([
{
id:1,
name:"Bùi Minh Ngọc",
email:"tobico.bm@gmail.com",
phone:"0338106526",
status:"Nghỉ"
}
]);

const [selected,setSelected] = useState([]);

const toggleStudent = (id)=>{

if(selected.includes(id)){
setSelected(selected.filter(s=>s!==id))
}else{
setSelected([...selected,id])
}

}

return(

<div className="p-4">

{/* BACK */}
<button
className="btn btn-link mb-3"
onClick={()=>navigate(-1)}
>
← Quay lại
</button>

<h3 className="fw-bold mb-4">
👥 Gán học viên cho lớp học
</h3>

<div className="row">

{/* LEFT SIDE */}
<div className="col-md-8">

<div className="card">

<div className="card-body">

<div className="d-flex justify-content-between mb-3">

<h5>Danh sách học viên có sẵn</h5>

<div>

<button className="btn btn-outline-primary btn-sm me-2"
onClick={()=>setSelected(students.map(s=>s.id))}
>
Chọn tất cả
</button>

<button className="btn btn-outline-secondary btn-sm"
onClick={()=>setSelected([])}
>
Bỏ chọn tất cả
</button>

</div>

</div>

{/* SEARCH */}
<input
className="form-control mb-3"
placeholder="Tìm kiếm học viên..."
/>

<table className="table">

<thead>

<tr>
<th></th>
<th>Học sinh</th>
<th>Email</th>
<th>Điện thoại</th>
<th>Trạng thái</th>
</tr>

</thead>

<tbody>

{students.map((s)=>(

<tr key={s.id}>

<td>

<input
type="checkbox"
checked={selected.includes(s.id)}
onChange={()=>toggleStudent(s.id)}
/>

</td>

<td>{s.name}</td>

<td>{s.email}</td>

<td>{s.phone}</td>

<td>

<span className="badge bg-warning text-dark">
{s.status}
</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

{/* RIGHT PANEL */}

<div className="col-md-4">

<div className="card">

<div className="card-body text-center">

<h5 className="mb-3">
Tổng quan học viên
</h5>

<p className="text-muted">
{selected.length === 0
? "Chưa có học viên nào được gán"
: `${selected.length} học viên được chọn`
}
</p>

<button className="btn btn-primary w-100">
Cập nhật danh sách học viên
</button>

</div>

</div>

</div>

</div>

</div>

)

}

export default AdminAssignStudent;