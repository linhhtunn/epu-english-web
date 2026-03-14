import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminCreateCourse() {

const navigate = useNavigate();

const [course,setCourse] = useState({
name:"",
level:"",
price:"",
duration:"",
description:""
});

const handleSubmit = (e)=>{
e.preventDefault();
console.log(course);
};

return(

<div className="container-fluid p-4">

{/* BACK */}
<button
className="btn btn-link mb-3"
onClick={()=>navigate(-1)}
>
← Quay lại
</button>

<h3 className="mb-4">
📚 Tạo khóa học mới
</h3>

<div className="row">

{/* FORM */}
<div className="col-md-6">

<div className="card p-4">

<h5 className="mb-3">
Thông tin khóa học
</h5>

<form onSubmit={handleSubmit}>

{/* NAME */}
<div className="mb-3">

<label className="form-label">
Tên khóa học *
</label>

<input
className="form-control"
placeholder="Ví dụ: IELTS Foundation"
onChange={(e)=>setCourse({...course,name:e.target.value})}
/>

</div>

{/* LEVEL */}

<div className="mb-3">

<label className="form-label">
Trình độ *
</label>

<select
className="form-select"
onChange={(e)=>setCourse({...course,level:e.target.value})}
>

<option>Chọn trình độ</option>
<option>Beginner</option>
<option>Intermediate</option>
<option>Advanced</option>

</select>

</div>

{/* PRICE */}

<div className="mb-3">

<label className="form-label">
Học phí 
</label>

<input
type="number"
className="form-control"
placeholder="Ví dụ: 5000000"
onChange={(e)=>setCourse({...course,price:e.target.value})}
/>

</div>

{/* DURATION */}

<div className="mb-3 ">

<label className="form-label">
Đơn vị thời gian 
</label>

<select
className="form-select"
onChange={(e)=>setCourse({...course,level:e.target.value})}
>

<option>Chọn đơn vị</option>
<option>GIờ</option>
<option>Tuần</option>
<option>Tiết</option>

</select>

</div>

<div className="mb-3 ">

<label className="form-label ">
Thời lượng (tuần)
</label>
<input
type="number"
className="form-control"
placeholder="Ví dụ: 12 tuần"
onChange={(e)=>setCourse({...course,duration:e.target.value})}
/>
</div>
{/* DESCRIPTION */}

<div className="mb-3">

<label className="form-label">
Mô tả
</label>

<textarea
className="form-control"
rows="3"
placeholder="Nhập mô tả khóa học..."
onChange={(e)=>setCourse({...course,description:e.target.value})}
/>

</div>

<div className="d-flex justify-content-end gap-2">

<button
type="button"
className="btn btn-light"
onClick={()=>navigate(-1)}
>
Hủy
</button>

<button
type="submit"
className="btn btn-primary"
>
📚 Tạo khóa học
</button>

</div>

</form>

</div>

</div>

{/* RIGHT PANEL */}

<div className="col-md-6 d-flex align-items-center justify-content-center">

<div className="text-center">

<div style={{fontSize:"70px"}}>
📖
</div>

<h5 className="mt-3">
Tạo khóa học mới
</h5>

<p className="text-muted">
Thêm khóa học để quản lý chương trình đào tạo và lớp học.
</p>

</div>

</div>

</div>

</div>

);
}