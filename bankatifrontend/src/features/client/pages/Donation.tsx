import React, { useState } from 'react'

interface Charity {
    id: string
    name: string
    logo: string
}

export function Donation() {
    const [selectedCharity, setSelectedCharity] = useState<string | null>(null)

    const charities: Charity[] = [
        { id: 'alcs', name: 'ALCS', logo: '/path-to-alcs-logo.png' },
        { id: 'amh', name: 'AMH', logo: '/path-to-amh-logo.png' },
        { id: 'sos', name: 'SOS Villages d\'Enfants Maroc', logo: '/path-to-sos-logo.png' },
        { id: 'fms', name: 'Fondation Mohammed V pour la Solidarité', logo: '/path-to-fms-logo.png' },
        { id: 'insaf', name: 'Association Insaf', logo: '/path-to-insaf-logo.png' },
        { id: 'bayti', name: 'Bayti', logo: '/path-to-bayti-logo.png' },
        { id: 'asf', name: 'Association Solidarité Féminine', logo: '/path-to-asf-logo.png' },
    ]

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Make a Donation</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Select a Charity</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {charities.map((charity) => (
                        <button
                            key={charity.id}
                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                                selectedCharity === charity.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedCharity(charity.id)}
                        >
                            <img src={charity.logo} alt={charity.name} className="w-16 h-16 object-contain mb-2" />
                            <span className="text-sm font-medium text-center">{charity.name}</span>
                        </button>
                    ))}
                </div>
                {selectedCharity && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Donation Amount</h3>
                        <div className="flex space-x-4 mb-4">
                            {[10, 20, 50, 100].map((amount) => (
                                <button
                                    key={amount}
                                    className="px-4 py-2 border rounded-md hover:bg-blue-50 hover:border-blue-300"
                                >
                                    ${amount}
                                </button>
                            ))}
                            <input
                                type="number"
                                placeholder="Other amount"
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Donate Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

