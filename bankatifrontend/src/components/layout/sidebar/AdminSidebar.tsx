import React from 'react';
import { useLocation } from 'react-router-dom';
import { AgentSpaceMenu } from './menu/AgentSpaceMenu';
import { ClientSpaceMenu } from './menu/ClientSpaceMenu';
import { HistoryMenu } from './menu/HistoryMenu';
import { Password } from './menu/Password';

export const AdminSidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="w-64 bg-gray-900 min-h-screen text-gray-300">
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-white">Backoffice</h2>
                <div className="space-y-8">
                    <AgentSpaceMenu currentPath={location.pathname} />
                    <ClientSpaceMenu currentPath={location.pathname} />
                    <HistoryMenu currentPath={location.pathname} />
                    <Password currentPath={location.pathname} />
                </div>
            </div>
        </div>
    );
};

