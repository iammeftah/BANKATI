import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';
import { MenuSection } from './MenuSection';
import {MenuProps} from "./type";

export const AgentSpaceMenu: React.FC<MenuProps> = ({ currentPath }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'agent-list', label: 'Agent List', icon: <Users size={20} />, path: '/admin/agents' },
        { id: 'add-agent', label: 'Add Agent', icon: <UserPlus size={20} />, path: '/admin/agents/add' }
    ];

    return (
        <MenuSection
            title="Agent Space"
            items={menuItems}
            currentPath={currentPath}
            onItemClick={(path) => navigate(path)}
        />
    );
};
