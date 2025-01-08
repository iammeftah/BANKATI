import React, { useState } from 'react'

interface Creditor {
    id: string
    name: string
    logo: string
}

export function NewSubscription() {
    const [selectedCreditor, setSelectedCreditor] = useState<string | null>(null)

    const creditors: Creditor[] = [
        { id: 'iam', name: 'IAM', logo: '/path-to-iam-logo.png' },
        { id: 'inwi', name: 'INWI', logo: '/path-to-inwi-logo.png' },
        { id: 'orange', name: 'Orange', logo: '/path-to-orange-logo.png' },
        { id: 'radeema', name: 'RADEEMA', logo: '/path-to-radeema-logo.png' },
        { id: 'redal', name: 'REDAL', logo: '/path-to-redal-logo.png' },
        { id: 'lydec', name: 'LYDEC', logo: '/path-to-lydec-logo.png' },
    ]

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Subscription</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Select a Creditor</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {creditors.map((creditor) => (
                        <button
                            key={creditor.id}
                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                                selectedCreditor === creditor.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedCreditor(creditor.id)}
                        >
                            <img src={creditor.logo} alt={creditor.name} className="w-16 h-16 object-contain mb-2" />
                            <span className="text-sm font-medium">{creditor.name}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Your Selection</h3>
                    <p className="text-gray-600">
                        {selectedCreditor
                            ? `Step 1 of 2: Selected ${creditors.find(c => c.id === selectedCreditor)?.name}`
                            : 'Step 1 of 2: Select a Creditor'}
                    </p>
                    <button
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={!selectedCreditor}
                    >
                        Create Subscription
                    </button>
                </div>
            </div>
        </div>
    )
}

