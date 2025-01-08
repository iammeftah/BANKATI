import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Agent, Client } from '../../../types/auth.type';
import { api } from '../../../services/api';

// Generic Modal Component
const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};



export const AgentEditModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    agent: Agent | null;
    onUpdate: () => void;
}> = ({ isOpen, onClose, agent, onUpdate }) => {
    const [formData, setFormData] = useState<Partial<Agent>>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        phone?: string;
    }>({});

    useEffect(() => {
        if (agent) {
            // Include all Agent fields in the form data
            setFormData({
                firstName: agent.firstName,
                lastName: agent.lastName,
                email: agent.email,
                phone: agent.phone,
                address: agent.address || '',
                birthDate: agent.birthDate || '',
                identityType: agent.identityType || 'CIN',
                identityNumber: agent.identityNumber || '',
                registrationNumber: agent.registrationNumber || '',
                patentNumber: agent.patentNumber || ''
            });
            setValidationErrors({});
        }
    }, [agent]);

    const validateField = async (field: 'email' | 'phone', value: string) => {
        if (!agent || value === agent[field]) return true;

        try {
            const response = await api.get(`/admin/check-${field}`, {
                params: { [field]: value }
            });
            return !response.data;
        } catch (err) {
            console.error(`Error checking ${field}:`, err);
            return false;
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'email' || name === 'phone') {
            const isValid = await validateField(name, value);
            if (!isValid) {
                setValidationErrors(prev => ({
                    ...prev,
                    [name]: `This ${name} is already in use`
                }));
            } else {
                setValidationErrors(prev => ({
                    ...prev,
                    [name]: undefined
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agent) return;

        try {
            setLoading(true);
            setError('');

            // Validate required fields
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                setError('Required fields cannot be empty');
                return;
            }

            const [isEmailValid, isPhoneValid] = await Promise.all([
                validateField('email', formData.email || ''),
                validateField('phone', formData.phone || '')
            ]);

            const newValidationErrors = {
                email: !isEmailValid ? 'This email is already in use' : undefined,
                phone: !isPhoneValid ? 'This phone number is already in use' : undefined
            };

            setValidationErrors(newValidationErrors);

            if (!isEmailValid || !isPhoneValid) {
                setError('Please fix the validation errors before submitting');
                return;
            }

            const response = await api.put(`/admin/agents/${agent.id}`, formData);

            if (response.status === 200) {
                onUpdate();
                onClose();
            } else {
                setError(response.data || 'Error updating agent');
            }
        } catch (err: any) {
            console.error('Error updating agent:', err);
            setError(err.response?.data || 'Error updating agent. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4">Edit Agent</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                                validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Identity Number</label>
                        <input
                            type="text"
                            name="identityNumber"
                            value={formData.identityNumber || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || Object.keys(validationErrors).length > 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Agent'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};





export const ClientEditModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    onUpdate: () => void;
}> = ({ isOpen, onClose, client, onUpdate }) => {
    const [formData, setFormData] = useState<Partial<Client>>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        phone?: string;
    }>({});

    useEffect(() => {
        if (client) {
            setFormData({
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email,
                phone: client.phone,
                ceilingType: client.ceilingType,
                status: client.status,
                balance: client.balance
            });
            setValidationErrors({});
        }
    }, [client]);

    const validateField = async (field: 'email' | 'phone', value: string) => {
        if (!client || value === client[field]) return true;

        try {
            const response = await api.get(`/agent/check-${field}`, {
                params: { [field]: value }
            });
            return !response.data;
        } catch (err) {
            console.error(`Error checking ${field}:`, err);
            return false;
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'balance' ? parseFloat(value) : value
        }));

        if (name === 'email' || name === 'phone') {
            const isValid = await validateField(name, value);
            if (!isValid) {
                setValidationErrors(prev => ({
                    ...prev,
                    [name]: `This ${name} is already in use`
                }));
            } else {
                setValidationErrors(prev => ({
                    ...prev,
                    [name]: undefined
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;

        try {
            setLoading(true);
            setError('');

            const [isEmailValid, isPhoneValid] = await Promise.all([
                validateField('email', formData.email || ''),
                validateField('phone', formData.phone || '')
            ]);

            if (!isEmailValid || !isPhoneValid) {
                setError('Please fix the validation errors before submitting');
                return;
            }

            const response = await api.put(`/agent/clients/${client.id}`, formData);

            if (response.status === 200) {
                onUpdate();
                onClose();
            }
        } catch (err: any) {
            setError(err.response?.data || 'Error updating client');
            console.error('Error updating client:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4">Edit Client</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                                validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ceiling Type</label>
                        <select
                            name="ceilingType"
                            value={formData.ceilingType || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="HSSAB1">HSSAB1</option>
                            <option value="HSSAB2">HSSAB2</option>
                            <option value="HSSAB3">HSSAB3</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || Object.keys(validationErrors).length > 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Client'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};