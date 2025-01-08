// src/components/sidebar/AdminSidebar.tsx
import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { AgentSpaceMenu } from './menu/AgentSpaceMenu';
import { ClientSpaceMenu } from './menu/ClientSpaceMenu';
import { HistoryMenu } from './menu/HistoryMenu';
import { Password } from './menu/Password';

export const AdminSidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="w-64 bg-gray-800 min-h-screen text-white">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Backoffice</h2>
                <div className="space-y-6">
                    <AgentSpaceMenu currentPath={location.pathname} />
                    <ClientSpaceMenu currentPath={location.pathname} />
                    <HistoryMenu currentPath={location.pathname} />
                    <Password currentPath={location.pathname} />

                </div>
            </div>
        </div>
    );
};