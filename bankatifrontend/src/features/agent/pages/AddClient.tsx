'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from "../../../services/api"

interface ClientFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    ceilingType: string
}

interface ApiResponse {
    client?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        ceilingType: string;
        createdAt: string;  // Added type for createdAt
        updatedAt: string;  // Added type for updatedAt
    };
    temporaryPassword?: string;
}

interface ApiError {
    response?: {
        data?: string;
    };
    message?: string;
}

const accountTypes = [
    { id: 'HSSAB1', name: 'Hssab 1 - Plafond: 200 DH' },
    { id: 'HSSAB2', name: 'Hssab 2 - Plafond: 5000 DH' },
    { id: 'HSSAB3', name: 'Hssab 3 - Plafond: 10000 DH' }
]

export default function AddClient() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<ClientFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ceilingType: 'HSSAB1'
    })
    const [error, setError] = useState<string>('')
    const [emailExists, setEmailExists] = useState(false)
    const [phoneExists, setPhoneExists] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const checkEmail = async (email: string) => {
        if (!email) return
        try {
            const response = await api.get('/client/check-email', {
                params: { email },
            })
            setEmailExists(response.data)
        } catch (error) {
            console.error('Error checking email', error)
        }
    }

    const checkPhone = async (phone: string) => {
        if (!phone) return
        try {
            const response = await api.get('/client/check-phone', {
                params: { phone },
            })
            setPhoneExists(response.data)
        } catch (error) {
            console.error('Error checking phone', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        if (emailExists) {
            setError('Cet email existe déjà.')
            setIsSubmitting(false)
            return
        }

        if (phoneExists) {
            setError('Ce numéro de téléphone existe déjà.')
            setIsSubmitting(false)
            return
        }

        try {
            const submitData = {
                ...formData,
                ceilingType: formData.ceilingType
            }

            const response = await api.post<ApiResponse>('/agent/clients', submitData)

            if (response.data.temporaryPassword) {
                // TODO: Implement email service to send temporary password
                // This should be implemented using a dedicated mailing service
                // Expected implementation:
                // await mailService.sendTemporaryPassword({
                //     to: formData.email,
                //     tempPassword: response.data.temporaryPassword,
                //     firstName: formData.firstName,
                //     lastName: formData.lastName
                // });

                // Keep the alert for now as a fallback/development purposes
                alert(`Temporary password for client: ${response.data.temporaryPassword}`)
            }

            navigate('/agent/clients')
        } catch (err) {
            const apiError = err as ApiError
            setError(
                apiError.response?.data ||
                apiError.message ||
                'Une erreur est survenue lors de la création du client'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name === 'accountType' ? 'ceilingType' : name]: value
        }))

        if (name === 'email') {
            checkEmail(value)
        }

        if (name === 'phone') {
            checkPhone(value)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold mb-6">Ouverture d'un compte de paiement</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sélectionner un produit
                            </label>
                            <select
                                name="accountType"
                                value={formData.ceilingType}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {accountTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Prénom
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Téléphone
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        phoneExists ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {phoneExists && (
                                    <p className="text-red-500 text-xs italic mt-1">Ce numéro de téléphone existe déjà.</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        emailExists ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {emailExists && (
                                    <p className="text-red-500 text-xs italic mt-1">Cet email existe déjà.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || emailExists || phoneExists}
                            className={`px-4 py-2 text-white rounded-md ${
                                isSubmitting || emailExists || phoneExists
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#FFA500] hover:bg-[#FF8C00]'
                            }`}
                        >
                            {isSubmitting ? 'Création en cours...' : 'Suivant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}