import React, { useState } from 'react'

interface Plan {
    id: string
    name: string
    price: number
    features: string[]
    isCurrentPlan?: boolean
}

export function SubscriptionPlans() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly')

    const plans: Plan[] = [
        {
            id: 'hssab1',
            name: 'HSSAB1',
            price: 5,
            features: [
                'Free ATM withdrawals',
                'Online banking',
                'Mobile app access',
                'Basic customer support',
                'Monthly account statement',
                'Debit card included',
            ],
            isCurrentPlan: true,
        },
        {
            id: 'hssab2',
            name: 'HSSAB2',
            price: 10,
            features: [
                'All HSSAB1 features',
                'Overdraft protection',
                'Higher daily transaction limits',
                'Cashback on debit card purchases',
                'Free foreign currency exchanges',
                'Priority customer support',
                'Quarterly investment newsletter',
            ],
        },
        {
            id: 'hssab3',
            name: 'HSSAB3',
            price: 20,
            features: [
                'All HSSAB2 features',
                'Priority customer service',
                'Travel insurance',
                'Exclusive rewards program',
                'Unlimited free international transfers',
                'Personalized financial advice',
                'Concierge services',
                'Access to exclusive events',
                'Premium metal card',
            ],
        },
    ]

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>
            <div className="mb-6 flex justify-center">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                            billingCycle === 'monthly'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                            billingCycle === 'annually'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setBillingCycle('annually')}
                    >
                        Annually
                    </button>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow p-6 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                        <p className="text-gray-600 mb-4">
                            {plan.isCurrentPlan ? 'Basic account for everyday banking' : 'Enhanced account with additional benefits'}
                        </p>
                        <div className="text-3xl font-bold mb-4">
                            ${billingCycle === 'monthly' ? plan.price : plan.price * 10}/
                            <span className="text-lg text-gray-600">{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                        </div>
                        <ul className="mb-6 flex-grow">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center mb-2">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`w-full px-4 py-2 rounded-lg ${
                                plan.isCurrentPlan
                                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            disabled={plan.isCurrentPlan}
                        >
                            {plan.isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

