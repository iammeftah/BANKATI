import React, { useState } from 'react';
import { api } from '../../services/api';

// Separate interface for form data
interface AgentFormData {
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
    phone: string;
    password: string;
    identityType: 'CIN' | 'PASSPORT' | 'RESIDENT_PERMIT';
    identityNumber: string;
    birthDate: string;
    address: string;
    registrationNumber: string;
    patentNumber: string;
}

// Interface for API submission (excluding confirmEmail)
interface AgentSubmissionData extends Omit<AgentFormData, 'confirmEmail'> {}

const generateSecurePassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

const AddAgent = () => {
    const [formData, setFormData] = useState<AgentFormData>({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        phone: '',
        password: '',
        identityType: 'CIN',
        identityNumber: '',
        birthDate: '',
        address: '',
        registrationNumber: '',
        patentNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [phoneExists, setPhoneExists] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Trigger email check
        if (name === 'email') {
            checkEmail(value);
        }

        // Trigger phone check
        if (name === 'phone') {
            checkPhone(value);
        }
    };

    const checkEmail = async (email: string) => {
        try {
            const response = await api.get(`/admin/check-email`, { params: { email } });
            setEmailExists(response.data);
        } catch (error) {
            console.error('Error checking email', error);
        }
    };

    const checkPhone = async (phone: string) => {
        try {
            const response = await api.get(`/admin/check-phone`, { params: { phone } });
            setPhoneExists(response.data);
        } catch (error) {
            console.error('Error checking phone', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.email !== formData.confirmEmail) {
            setError('Les adresses email ne correspondent pas');
            return;
        }

        if (emailExists) {
            setError('Cet email existe déjà.');
            return;
        }

        if (phoneExists) {
            setError('Ce numéro de téléphone existe déjà.');
            return;
        }

        try {
            // Submission logic here

            const generatedPassword = generateSecurePassword();

            console.log("Generated password: ", generatedPassword);

            // Remove confirmEmail and create submission data
            const { confirmEmail, ...restData } = formData;
            const submissionData: AgentSubmissionData = {
                ...restData,
                password: generatedPassword
            };

            await api.post('/admin/agents', submissionData);

            setSuccess('Agent ajouté avec succès!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                confirmEmail: '',
                phone: '',
                password: '',
                identityType: 'CIN',
                identityNumber: '',
                birthDate: '',
                address: '',
                registrationNumber: '',
                patentNumber: ''
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'ajout de l\'agent');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Agent</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            Nom *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Prénom *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identityType">
                            Pièce d'identité *
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="identityType"
                            name="identityType"
                            value={formData.identityType}
                            onChange={handleChange}
                            required
                        >
                            <option value="CIN">CIN</option>
                            <option value="PASSPORT">Passport</option>
                            <option value="RESIDENT_PERMIT">Carte de séjour</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identityNumber">
                            N° pièce d'identité *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="identityNumber"
                            name="identityNumber"
                            type="text"
                            value={formData.identityNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
                            Date de naissance *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                            Adresse *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmEmail">
                            Confirmation Email *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirmEmail"
                            name="confirmEmail"
                            type="email"
                            value={formData.confirmEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Numéro de téléphone *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationNumber">
                            N° d'immatriculation *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="registrationNumber"
                            name="registrationNumber"
                            type="text"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patentNumber">
                            N° Patente *
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="patentNumber"
                            name="patentNumber"
                            type="text"
                            value={formData.patentNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAgent;