import React, { useState } from 'react'

interface Recipient {
    id: string
    name: string
    avatar: string
}

export function SendMoney() {
    const [amount, setAmount] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState('USD')
    const [note, setNote] = useState('')

    const recentRecipients: Recipient[] = [
        { id: '1', name: 'Alice Johnson', avatar: '/path-to-alice-avatar.jpg' },
        { id: '2', name: 'Bob Smith', avatar: '/path-to-bob-avatar.jpg' },
        { id: '3', name: 'Carol Williams', avatar: '/path-to-carol-avatar.jpg' },
        // Add more recipients as needed
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle the money transfer logic here
        console.log('Sending money:', { amount, selectedCurrency, note })
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Send Money</h1>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient First Name
                                </label>
                                <input
                                    type="text"
                                    id="recipient"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter recipient's first name"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="recipient-last-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient Last Name
                                </label>
                                <input
                                    type="text"
                                    id="recipient-last-name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter recipient's last name"
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <div className="flex-grow mr-2">
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                                        Currency
                                    </label>
                                    <select
                                        id="currency"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                    Note (Optional)
                                </label>
                                <textarea
                                    id="note"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    placeholder="Add a note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Send Money
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Recipients</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {recentRecipients.map((recipient) => (
                                <div key={recipient.id} className="flex flex-col items-center">
                                    <img
                                        src={recipient.avatar}
                                        alt={recipient.name}
                                        className="w-12 h-12 rounded-full mb-2"
                                    />
                                    <span className="text-sm text-center">{recipient.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

