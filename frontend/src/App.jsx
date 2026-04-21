// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import PrivateRoute from './routes/PrivateRoute';
// import MainLayout from './components/MainLayout';

// // Import Pages
// import Login from './pages/Login';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import TeacherDashboard from './pages/teacher/TeacherDashboard';
// import TeacherSchedule from './pages/teacher/TeacherSchedule';
// import StudentDashboard from './pages/student/Dashboard';
// import ParentDashboard from './pages/parent/ParentDashboard';
// import ParentSchedule from './pages/parent/ParentSchedule';
// import SchedulePage from './pages/student/SchedulePage';

// // Import Admin Pages
// import AdminSchedule from './pages/admin/AdminSchedule';
// import AdminCourses from './pages/admin/AdminCourses';
// import AdminClasses from './pages/admin/AdminClasses';
// import AdminCreateClass from "./pages/admin/AdminCreateClass";
// import AdminCreateCourse from "./pages/admin/AdminCreateCourse";
// import AdminAssignStudent from "./pages/admin/AdminAssignStudent";
// import AdminMessages from './pages/admin/AdminMessages'; // Đã import component nhắn tin
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminCreateUser from "./pages/admin/AdminCreateUser";

// // Import Teacher Pages
// import TeacherAttendance from './pages/teacher/TeacherAttendance';

// // Import Parent Pages
// import ParentAttendance from './pages/parent/ParentAttendance';
// // Component Placeholder để tránh lỗi khi chưa có file trang cụ thể
// const Placeholder = ({ title }) => (
//   <div className="p-4 animate__animated animate__fadeIn">
//     <div className="card border-0 shadow-sm rounded-5 p-5 text-center">
//       <i className="bi bi-cone-striped fs-1 text-warning mb-3"></i>
//       <h3 className="fw-bold text-uppercase">{title}</h3>
//       <p className="text-muted">Tính năng này đang được phát triển và sẽ sớm ra mắt.</p>
//     </div>
//   </div>
// );

// const HomeRedirect = () => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;

//   switch (user.role) {
//     case 'Admin': return <Navigate to="/admin" replace />;
//     case 'Giao_Vien': return <Navigate to="/teacher" replace />;
//     case 'Hoc_Sinh': return <Navigate to="/student" replace />;
//     case 'Phu_Huynh': return <Navigate to="/parent" replace />;
//     default: return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<HomeRedirect />} />

//           <Route element={<MainLayout />}>

//             {/* --- NHÓM QUẢN TRỊ (ADMIN) --- */}
//             <Route path="/admin" element={<PrivateRoute allowedRoles={['Admin']}><AdminDashboard /></PrivateRoute>} />
//             <Route path="/admin/functions" element={<PrivateRoute allowedRoles={['Admin']}><Placeholder title="Quản lý chức năng" /></PrivateRoute>} />
//             <Route path="/admin/users" element={<PrivateRoute allowedRoles={['Admin']}><AdminUsers /></PrivateRoute>} />
//             <Route path="/admin/courses" element={<PrivateRoute allowedRoles={['Admin']}><AdminCourses /></PrivateRoute>} />
//             <Route path="/admin/courses/create" element={<PrivateRoute allowedRoles={['Admin']}><AdminCreateCourse /></PrivateRoute>} />

//             <Route path="/admin/classes" element={<PrivateRoute allowedRoles={['Admin']}><AdminClasses /></PrivateRoute>} />
//             <Route path="/admin/classes/create" element={<PrivateRoute allowedRoles={['Admin']}><AdminCreateClass /></PrivateRoute>} />
//             <Route path="/admin/classes/assign-students" element={<PrivateRoute allowedRoles={['Admin']}><AdminAssignStudent /></PrivateRoute>} />

//             <Route path="/admin/schedules" element={<PrivateRoute allowedRoles={['Admin']}><AdminSchedule /></PrivateRoute>} />
//             <Route path="/admin/content" element={<PrivateRoute allowedRoles={['Admin']}><Placeholder title="Nội dung học tập" /></PrivateRoute>} />
//             <Route path="/admin/exams" element={<PrivateRoute allowedRoles={['Admin']}><Placeholder title="Bài tập - Đề thi" /></PrivateRoute>} />
//             <Route path="/admin/attendance" element={<PrivateRoute allowedRoles={['Admin']}><Placeholder title="Quản lý Điểm danh" /></PrivateRoute>} />
//             <Route path="/admin/reports" element={<PrivateRoute allowedRoles={['Admin']}><Placeholder title="Báo cáo và thống kê" /></PrivateRoute>} />
//             <Route path="/admin/notifications" element={<PrivateRoute allowedRoles={['Admin']}><Placeholder title="Quản lý Thông báo" /></PrivateRoute>} />

//             {/* ĐÃ TÍCH HỢP TRANG TIN NHẮN TẠI ĐÂY */}
//             <Route path="/admin/messages" element={<PrivateRoute allowedRoles={['Admin']}><AdminMessages /></PrivateRoute>} />

//             <Route path="/admin/profile" element={<PrivateRoute allowedRoles={['Admin']}><Placeholder title="Hồ sơ cá nhân" /></PrivateRoute>} />

//             <Route
// path="/admin/classes/create"
// element={<AdminCreateClass />}
// />
//             <Route
// path="/admin/courses/create"
// element={<AdminCreateCourse />}
// />
//             <Route
// path="/admin/classes/assign-students"
// element={<AdminAssignStudent />}
// />
// <Route
// path="/admin/users/create"
// element={
// <PrivateRoute allowedRoles={['Admin']}>
// <AdminCreateUser />
// </PrivateRoute>
// }
// />
// <Route
// path="/admin/users/edit/:id"
// element={
// <PrivateRoute allowedRoles={['Admin']}>
// <AdminCreateUser />
// </PrivateRoute>
// }
// />
// <Route
// path="/admin/courses/edit/:id"
// element={
// <PrivateRoute allowedRoles={['Admin']}>
// <AdminCreateCourse />
// </PrivateRoute>
// }
// />
// <Route
// path="/admin/classes/edit/:id"
// element={
// <PrivateRoute allowedRoles={['Admin']}>
// <AdminCreateClass />
// </PrivateRoute>
// }
// />

//             {/* --- NHÓM GIÁO VIÊN (TEACHER) --- */}
//             <Route path="/teacher" element={<PrivateRoute allowedRoles={['Giao_Vien']}><TeacherDashboard /></PrivateRoute>} />
//             <Route path="/teacher/schedule" element={<PrivateRoute allowedRoles={['Giao_Vien']}><TeacherSchedule /></PrivateRoute>} />
//             <Route path="/teacher/classes" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Quản lý lớp học" /></PrivateRoute>} />
//             <Route path="/teacher/exams" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Quản lý bài tập - Đề thi" /></PrivateRoute>} />
//             <Route path="/teacher/grading" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Chấm điểm" /></PrivateRoute>} />
//             <Route path="/teacher/content" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Nội dung học tập" /></PrivateRoute>} />
//             <Route path="/teacher/notifications" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Thông báo" /></PrivateRoute>} />
//             <Route path="/teacher/messages" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Quản lý nhắn tin" /></PrivateRoute>} />
//             <Route path="/teacher/attendance" element={<PrivateRoute allowedRoles={['Giao_Vien']}><TeacherAttendance /></PrivateRoute>} />
//             <Route path="/teacher/reports" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Báo cáo và thống kê" /></PrivateRoute>} />
//             <Route path="/teacher/profile" element={<PrivateRoute allowedRoles={['Giao_Vien']}><Placeholder title="Thông tin cá nhân giáo viên" /></PrivateRoute>} />

//             {/* --- NHÓM HỌC SINH (STUDENT) --- */}
//             <Route path="/student" element={<PrivateRoute allowedRoles={['Hoc_Sinh']}><StudentDashboard /></PrivateRoute>} />
//             <Route path="/student/schedule" element={<PrivateRoute allowedRoles={['Hoc_Sinh']}><SchedulePage /></PrivateRoute>} />
//             <Route path="/student/homework-list" element={<PrivateRoute allowedRoles={['Hoc_Sinh']}><Placeholder title="Quản lý bài tập/bài thi" /></PrivateRoute>} />
//             <Route path="/student/reports" element={<PrivateRoute allowedRoles={['Hoc_Sinh']}><Placeholder title="Báo cáo thống kê" /></PrivateRoute>} />
//             <Route path="/student/homework" element={<PrivateRoute allowedRoles={['Hoc_Sinh']}><Placeholder title="Học chủ động" /></PrivateRoute>} />
//             <Route path="/student/notifications" element={<PrivateRoute allowedRoles={['Hoc_Sinh']}><Placeholder title="Thông báo" /></PrivateRoute>} />

//             {/* --- NHÓM PHỤ HUYNH (PARENT) --- */}
//             <Route path="/parent" element={<PrivateRoute allowedRoles={['Phu_Huynh']}><ParentDashboard /></PrivateRoute>} />
//             <Route path="/parent/schedule" element={<PrivateRoute allowedRoles={['Phu_Huynh']}><ParentSchedule /></PrivateRoute>} />
//             <Route path="/parent/attendance" element={<PrivateRoute allowedRoles={['Phu_Huynh']}><ParentAttendance /></PrivateRoute>} />
//             <Route path="/parent/messages" element={<PrivateRoute allowedRoles={['Phu_Huynh']}><Placeholder title="Quản lý nhắn tin" /></PrivateRoute>} />
//             <Route path="/parent/reports" element={<PrivateRoute allowedRoles={['Phu_Huynh']}><Placeholder title="Báo cáo thống kê" /></PrivateRoute>} />
//           </Route>

//           {/* Error Routes & Catch-All */}
//           <Route path="/unauthorized" element={<div className="text-center mt-5"><i className="bi bi-shield-lock-fill fs-1 text-danger"></i><h1 className="mt-3">403 - Không có quyền truy cập</h1></div>} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// // ngày chỉnh sửa 10:03 ngày 6/3/2026 nội dung chỉnh sửa: Bổ sung các chức năng trên thanh slidebar cho giống vs file excel

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./components/MainLayout";

// Import Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import StudentDashboard from "./pages/student/Dashboard";
import StudentHomeworkList from "./pages/student/StudentHomeworkList";
import StudentReports from "./pages/student/StudentReports";
import StudentSelfStudy from "./pages/student/StudentSelfStudy";
import StudentNotifications from "./pages/student/StudentNotifications";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentSchedule from "./pages/parent/ParentSchedule";
import SchedulePage from "./pages/student/SchedulePage";

// Import Admin Pages
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminCreateClass from "./pages/admin/AdminCreateClass";
import AdminCreateCourse from "./pages/admin/AdminCreateCourse";
import AdminAssignStudent from "./pages/admin/AdminAssignStudent";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCreateUser from "./pages/admin/AdminCreateUser";

// Import Teacher Pages
import TeacherAttendance from "./pages/teacher/TeacherAttendance";

// Import Parent Pages
import ParentAttendance from "./pages/parent/ParentAttendance";

const Placeholder = ({ title }) => (
    <div className="p-4 animate__animated animate__fadeIn">
        <div className="card border-0 shadow-sm rounded-5 p-5 text-center">
            <i className="bi bi-cone-striped fs-1 text-warning mb-3"></i>
            <h3 className="fw-bold text-uppercase">{title}</h3>
            <p className="text-muted">
                Tính năng này đang được phát triển và sẽ sớm ra mắt.
            </p>
        </div>
    </div>
);

const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case "Admin":
            return <Navigate to="/admin" replace />;
        case "Giao_Vien":
            return <Navigate to="/teacher" replace />;
        case "Hoc_Sinh":
            return <Navigate to="/student" replace />;
        case "Phu_Huynh":
            return <Navigate to="/parent" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

function App() {
    return (
        <AuthProvider>
            <Router
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<HomeRedirect />} />

                    <Route element={<MainLayout />}>
                        {/* --- NHÓM QUẢN TRỊ (ADMIN) --- */}
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminUsers />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/users/create"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminCreateUser />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/users/edit/:id"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminCreateUser />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/admin/courses"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminCourses />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/courses/create"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminCreateCourse />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/courses/edit/:id"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminCreateCourse />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/admin/classes"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminClasses />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/classes/create"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminCreateClass />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/classes/edit/:id"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminCreateClass />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/classes/assign-students"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminAssignStudent />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/admin/schedules"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminSchedule />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/messages"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <AdminMessages />
                                </PrivateRoute>
                            }
                        />

                        {/* Admin Placeholders */}
                        <Route
                            path="/admin/functions"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <Placeholder title="Quản lý chức năng" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/content"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <Placeholder title="Nội dung học tập" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/exams"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <Placeholder title="Bài tập - Đề thi" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/attendance"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <Placeholder title="Quản lý Điểm danh" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/reports"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <Placeholder title="Báo cáo và thống kê" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/notifications"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <Placeholder title="Quản lý Thông báo" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/profile"
                            element={
                                <PrivateRoute allowedRoles={["Admin"]}>
                                    <Placeholder title="Hồ sơ cá nhân" />
                                </PrivateRoute>
                            }
                        />

                        {/* --- NHÓM GIÁO VIÊN (TEACHER) --- */}
                        <Route
                            path="/teacher"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <TeacherDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/schedule"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <TeacherSchedule />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/attendance"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <TeacherAttendance />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/classes"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Quản lý lớp học" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/exams"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Quản lý bài tập - Đề thi" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/grading"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Chấm điểm" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/content"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Nội dung học tập" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/notifications"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Thông báo" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/messages"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Quản lý nhắn tin" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/reports"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Báo cáo và thống kê" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/teacher/profile"
                            element={
                                <PrivateRoute allowedRoles={["Giao_Vien"]}>
                                    <Placeholder title="Thông tin cá nhân giáo viên" />
                                </PrivateRoute>
                            }
                        />

                        {/* --- NHÓM HỌC SINH (STUDENT) --- */}
                        <Route
                            path="/student"
                            element={
                                <PrivateRoute allowedRoles={["Hoc_Sinh"]}>
                                    <StudentDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student/schedule"
                            element={
                                <PrivateRoute allowedRoles={["Hoc_Sinh"]}>
                                    <SchedulePage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student/homework-list"
                            element={
                                <PrivateRoute allowedRoles={["Hoc_Sinh"]}>
                                    <StudentHomeworkList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student/reports"
                            element={
                                <PrivateRoute allowedRoles={["Hoc_Sinh"]}>
                                    <StudentReports />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student/homework"
                            element={
                                <PrivateRoute allowedRoles={["Hoc_Sinh"]}>
                                    <StudentSelfStudy />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student/notifications"
                            element={
                                <PrivateRoute allowedRoles={["Hoc_Sinh"]}>
                                    <StudentNotifications />
                                </PrivateRoute>
                            }
                        />

                        {/* --- NHÓM PHỤ HUYNH (PARENT) --- */}
                        <Route
                            path="/parent"
                            element={
                                <PrivateRoute allowedRoles={["Phu_Huynh"]}>
                                    <ParentDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/parent/schedule"
                            element={
                                <PrivateRoute allowedRoles={["Phu_Huynh"]}>
                                    <ParentSchedule />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/parent/attendance"
                            element={
                                <PrivateRoute allowedRoles={["Phu_Huynh"]}>
                                    <ParentAttendance />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/parent/messages"
                            element={
                                <PrivateRoute allowedRoles={["Phu_Huynh"]}>
                                    <Placeholder title="Quản lý nhắn tin" />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/parent/reports"
                            element={
                                <PrivateRoute allowedRoles={["Phu_Huynh"]}>
                                    <Placeholder title="Báo cáo thống kê" />
                                </PrivateRoute>
                            }
                        />
                    </Route>

                    <Route
                        path="/unauthorized"
                        element={
                            <div className="text-center mt-5">
                                <i className="bi bi-shield-lock-fill fs-1 text-danger"></i>
                                <h1 className="mt-3">
                                    403 - Không có quyền truy cập
                                </h1>
                            </div>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
