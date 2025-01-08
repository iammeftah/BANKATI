'use client'

import {Link} from "react-router-dom";

export default function AgentDashboard() {
    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>
            <Link
                to="/update-password"
                className="text-gray-600 hover:text-gray-800"
            >
                Change Password
            </Link>
        </div>
    )
}
