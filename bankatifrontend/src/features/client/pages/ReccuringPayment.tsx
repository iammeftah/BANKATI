import React from 'react'

interface RecurringPayment {
    id: string
    service: string
    amount: number
    frequency: string
    nextPayment: string
    status: 'active' | 'paused'
}

export function RecurringPayments() {
    const payments: RecurringPayment[] = [
        { id: '1', service: 'Netflix Subscription', amount: 14.99, frequency: 'Monthly', nextPayment: 'Jan 1, 2024', status: 'active' },
        { id: '2', service: 'Gym Membership', amount: 49.99, frequency: 'Monthly', nextPayment: 'Jan 5, 2024', status: 'active' },
        { id: '3', service: 'Cloud Storage', amount: 9.99, frequency: 'Monthly', nextPayment: 'Jan 15, 2024', status: 'paused' },
    ]

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Recurring Payments</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{payment.service}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{payment.frequency}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{payment.nextPayment}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                                        payment.status === 'active'
                                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                                >
                                    {payment.status === 'active' ? 'Pause' : 'Resume'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

