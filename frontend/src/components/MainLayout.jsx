import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="container-fluid vh-100 bg-light p-0">
            <div className="row g-0 h-100">
                {/* Sidebar cố định bên trái */}
                <Sidebar />
                
                {/* Nội dung thay đổi (Outlet) bên phải */}
                <div className="col-md-9 col-lg-10 p-4 overflow-auto h-100">
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default MainLayout;