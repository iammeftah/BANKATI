import React, { useState } from 'react';
import { api } from '../../../services/api';

const AgentDashboard = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    React.useEffect(() => {
        const loadAgentData = async () => {
            try {
                console.log('Attempting to fetch agent profile...');
                const response = await api.get('/agent/profile');
                console.log('Response:', response);
                const userData = response.data;
                setFormData(prev => ({
                    ...prev,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || ''
                }));
            } catch (err: any) {
                console.error('Full error:', err);
                console.error('Response data:', err.response?.data);
                console.error('Response status:', err.response?.status);
                setError(err.response?.data || 'Failed to load user data');
            }
        };
        loadAgentData();
    }, []);

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            // Handle profile update using the correct agent endpoint
            const profileData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone
            };

            const profileResponse = await api.put('/agent/profile', profileData);

            // Handle password update if password fields are filled
            if (showPasswordSection && formData.currentPassword && formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }

                if (!validatePassword(formData.newPassword)) {
                    setError(
                        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
                    );
                    return;
                }

                await api.post('/auth/update-password', {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                });
            }

            // Update the stored user data
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const updatedUser = {
                    ...user,
                    ...profileData
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setSuccess('Profile updated successfully');

            // Clear password fields after successful update
            if (showPasswordSection) {
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Error updating profile'
            );
            console.error('Error updating profile:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Profile Section */}
                <div className="md:col-span-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    {showPasswordSection ? '- Hide Password Section' : '+ Update Password'}
                                </button>
                            </div>

                            {showPasswordSection && (
                                <div className="space-y-4 border-t pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 py-2 text-white rounded-md ${
                                        isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="md:col-span-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => window.location.href = '/agent/clients'}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                View Clients List
                            </button>
                            <button
                                onClick={() => window.location.href = '/agent/clients/add'}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Add New Client
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;