import { Outlet, NavLink } from 'react-router-dom'

export function ClientLayout() {
    const menuItems = [
        { title: 'Account', items: [
                { name: 'Portfolio', path: '/client' },
                { name: 'Update Profile', path: '/client/update-profile' },
                { name: 'New Subscription', path: '/client/new-subscription' },
                { name: 'Subscription plans', path: '/client/subscription-plans' },
            ]},
        { title: 'Payments', items: [
                { name: 'Recurring Payments', path: '/client/recurring-payments' },
                { name: 'Bills', path: '/client/bills' },
                { name: 'Send money', path: '/client/send-money' },
                { name: 'Donation', path: '/client/donation' },
            ]},
        { title: 'Partners', items: [
                { name: 'Merchant Partners', path: '/client/merchant-partners' },
            ]},
        { title: 'Virtual Cards', items: [
                { name: 'Request Virtual Card', path: '/client/request-virtual-card' },
            ]},
    ]

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Client Space</h2>
                    <nav>
                        {menuItems.map((section, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                                    {section.title}
                                </h3>
                                <ul className="space-y-2">
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            <NavLink
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded-lg text-sm ${
                                                        isActive
                                                            ? 'bg-gray-100 text-gray-900 font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                    }`
                                                }
                                            >
                                                {item.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}

