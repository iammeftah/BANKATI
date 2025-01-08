import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import { Client } from '../../../types/auth.type';
import { ClientEditModal } from "../../../components/common/forms/EditModal";

interface ClientListProps {
    userRole: 'admin' | 'agent';
}

export const ClientList: React.FC<ClientListProps> = ({ userRole }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getBaseEndpoint = () => {
        return userRole === 'admin' ? '/admin/clients' : '/agent/clients';
    };

    useEffect(() => {
        fetchClients();
    }, [userRole]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await api.get<Client[]>(getBaseEndpoint());
            setClients(response.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.status === 403
                ? 'You do not have permission to view clients'
                : 'Failed to fetch clients');
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
        setIsEditModalOpen(true);
    };

    const handleDeactivate = async (id: number) => {
        if (window.confirm('Are you sure you want to deactivate this client?')) {
            try {
                setIsDeleting(id);
                await api.delete(`${getBaseEndpoint()}/${id}`);
                await fetchClients();
            } catch (err: any) {
                setError(err.response?.status === 403
                    ? 'You do not have permission to deactivate clients'
                    : 'Error deactivating client');
                console.error('Error deactivating client:', err);
                setTimeout(() => setError(''), 3000);
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const filteredClients = clients.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="w-full">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Client List</h1>
                <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    className="px-4 py-2 border rounded-lg w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                        <tr key={client.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{`${client.firstName} ${client.lastName}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {client.ceilingType}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(client.balance)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                    client.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                    {client.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(client.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(client.updatedAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => handleEdit(client)}
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

            <ClientEditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedClient(null);
                }}
                client={selectedClient}
                onUpdate={fetchClients}
            />
        </div>
    );
};

