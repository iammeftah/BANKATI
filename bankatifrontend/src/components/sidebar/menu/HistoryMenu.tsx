import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { MenuSection } from './MenuSection';
import {MenuProps} from "./type";

export const HistoryMenu: React.FC<MenuProps> = ({ currentPath }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'activity-log', label: 'Activity Log', icon: <Activity size={20} />, path: '/admin/activity' }
    ];

    return (
        <MenuSection
            title="History"
            items={menuItems}
            currentPath={currentPath}
            onItemClick={(path) => navigate(path)}
        />
    );
};