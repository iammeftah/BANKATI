// src/layouts/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../sidebar/AdminSidebar';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;