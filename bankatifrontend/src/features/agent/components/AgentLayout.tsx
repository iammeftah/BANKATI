import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PlusCircle, Users } from 'lucide-react';

const AgentSidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-16 p-4">
            <div className="space-y-4">
                <button
                    onClick={() => navigate('/agent/clients')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <Users size={20} />
                    <span>Clients List</span>
                </button>

                <button
                    onClick={() => navigate('/agent/clients/add')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <PlusCircle size={20} />
                    <span>Add Client</span>
                </button>
            </div>
        </div>
    );
};

const AgentLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <AgentSidebar />
            <div className="ml-64 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AgentLayout;