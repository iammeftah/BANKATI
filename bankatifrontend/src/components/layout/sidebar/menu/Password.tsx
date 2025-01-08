import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Activity, Lock} from 'lucide-react';
import { MenuSection } from '../components/MenuSection';
import {MenuProps} from "../types/type";

export const Password: React.FC<MenuProps> = ({ currentPath }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'update-password', label: 'Update password', icon: <Lock size={20} />, path: '/update-password' }
    ];

    return (
        <MenuSection
            title="Password"
            items={menuItems}
            currentPath={currentPath}
            onItemClick={(path) => navigate(path)}
        />
    );
};