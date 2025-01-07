import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

const ClientList = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await api.get<Client[]>('/admin/clients');
            setClients(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch clients');
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: number) => {
        if (window.confirm('Are you sure you want to deactivate this client?')) {
            try {
                await api.delete(`/admin/clients/${id}`);
                await fetchClients();
            } catch (err) {
                console.error('Error deactivating client:', err);
            }
        }
    };

    const filteredClients = clients.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Client List</h1>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="px-4 py-2 border rounded-lg w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                        <tr key={client.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {`${client.firstName} ${client.lastName}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {client.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {client.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800">
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDeactivate(client.id)}
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

export default ClientList;