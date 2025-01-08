import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');

    // LoginPage.tsx - update handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('token', response.token);

            // Check if we have a valid user role before navigating
            if (response?.user?.role) {
                switch (response.user.role) {
                    case 'ADMIN':
                        navigate('/admin');
                        break;
                    case 'AGENT':
                        navigate('/agent');
                        break;
                    case 'CLIENT':
                        navigate('/client');
                        break;
                    default:
                        setError('Invalid user role');
                }
            } else {
                setError('Invalid response from server');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center">Sign In</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={credentials.phone}
                            onChange={(e) =>
                                setCredentials({ ...credentials, phone: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) =>
                                setCredentials({ ...credentials, password: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};