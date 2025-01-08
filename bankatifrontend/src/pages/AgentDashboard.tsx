'use client'

export default function AgentDashboard() {
    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Clients</h3>
                        <div className="text-2xl font-bold">247</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Active Accounts</h3>
                        <div className="text-2xl font-bold">186</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Pending Approvals</h3>
                        <div className="text-2xl font-bold">12</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
