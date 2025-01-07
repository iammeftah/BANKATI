import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserMinus } from 'lucide-react';
import { MenuSection } from './MenuSection';
import { MenuProps } from './type';

export const ClientSpaceMenu: React.FC<MenuProps> = ({ currentPath }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'client-list', label: 'Client List', icon: <Users size={20} />, path: '/admin/clients' },
        { id: 'client-termination', label: 'Account Termination', icon: <UserMinus size={20} />, path: '/admin/clients/termination' }
    ];

    return (
        <MenuSection
            title="Client Space"
            items={menuItems}
            currentPath={currentPath}
            onItemClick={(path) => navigate(path)}
        />
    );
};