// AgentList.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { api } from "../../../services/api";
import { Agent } from '../../../types/auth.type';

const AgentList: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const response = await api.get<Agent[]>('/admin/agents');
            setAgents(response.data);
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const handleDeactivate = async (id: number) => {
        if (window.confirm('Are you sure you want to deactivate this agent?')) {
            try {
                await api.delete(`/admin/agents/${id}`);
                fetchAgents();
            } catch (error) {
                console.error('Error deactivating agent:', error);
            }
        }
    };

    const filteredAgents = agents.filter(agent =>
        agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone.includes(searchTerm)
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Agent List</h1>
                <input
                    type="text"
                    placeholder="Search by name or phone"
                    className="px-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAgents.map((agent) => (
                        <tr key={agent.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{`${agent.firstName} ${agent.lastName}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{agent.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{agent.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800">
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDeactivate(agent.id)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentList;