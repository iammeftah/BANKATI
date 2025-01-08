import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ClientListProps {
    userRole: 'admin' | 'agent';  // Add props interface to specify user role
}

const ClientList: React.FC<ClientListProps> = ({ userRole }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const navigate = useNavigate();

    // Get the base endpoint based on user role
    const getBaseEndpoint = () => {
        return userRole === 'admin' ? '/admin/clients' : '/agent/clients';
    };

    useEffect(() => {
        fetchClients();
    }, [userRole]); // Add userRole as dependency to refetch when role changes

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await api.get<Client[]>(getBaseEndpoint());
            setClients(response.data);
            setError('');
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError('You do not have permission to view clients');
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError('Failed to fetch clients');
            }
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: number) => {
        if (window.confirm('Are you sure you want to deactivate this client?')) {
            try {
                setIsDeleting(id);
                await api.delete(`${getBaseEndpoint()}/${id}`);
                await fetchClients();
                setIsDeleting(null);
            } catch (err: any) {
                if (err.response?.status === 403) {
                    setError('You do not have permission to deactivate clients');
                    setTimeout(() => setError(''), 3000);
                } else {
                    setError('Error deactivating client');
                    setTimeout(() => setError(''), 3000);
                }
                console.error('Error deactivating client:', err);
                setIsDeleting(null);
            }
        }
    };

    const filteredClients = clients.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

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
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => navigate(`${getBaseEndpoint()}/edit/${client.id}`)}
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDeactivate(client.id)}
                                        disabled={isDeleting === client.id}
                                    >
                                        {isDeleting === client.id ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                        ) : (
                                            <Trash2 size={20} />
                                        )}
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