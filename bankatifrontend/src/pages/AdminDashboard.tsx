// AdminDashboard.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Users, UserPlus, History, Activity } from 'lucide-react';

interface SidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            section: 'Agent Space',
            items: [
                { id: 'agent-list', label: 'Agent List', icon: <Users size={20} />, path: '/admin/agents' },
                { id: 'add-agent', label: 'Add Agent', icon: <UserPlus size={20} />, path: '/admin/agents/add' }
            ]
        },
        {
            section: 'Client Space',
            items: [
                { id: 'client-list', label: 'Client List', icon: <Users size={20} />, path: '/admin/clients' },
                { id: 'client-termination', label: 'Account Termination', icon: <UserPlus size={20} />, path: '/admin/clients/termination' }
            ]
        },
        {
            section: 'History',
            items: [
                { id: 'activity-log', label: 'Activity Log', icon: <Activity size={20} />, path: '/admin/activity' }
            ]
        }
    ];

    return (
        <div className="w-64 bg-gray-800 min-h-screen text-white">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Backoffice</h2>
                {menuItems.map((section) => (
                    <div key={section.section} className="mb-6">
                        <h3 className="text-sm font-semibold mb-2 text-gray-400">{section.section}</h3>
                        {section.items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveItem(item.id);
                                    navigate(item.path);
                                }}
                                className={`w-full flex items-center space-x-2 p-2 rounded-lg mb-1 ${
                                    activeItem === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const [activeItem, setActiveItem] = useState('agent-list');

    return (
        <div className="flex">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;