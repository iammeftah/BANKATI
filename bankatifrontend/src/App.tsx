import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/security/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import AdminLayout from './features/admin/components/AdminLayout';
import AgentLayout from "./features/agent/components/AgentLayout";
import {AgentList} from './features/admin/pages/AgentList';
import AddAgent from './features/admin/pages/AddAgent';
import {ClientList} from './features/admin/pages/ClientList';
import AgentDashboard from './features/agent/pages/AgentDashboard';
import { ClientDashboard } from './features/client/pages/ClientDashboard';
import { Header } from "./components/layout/Header";
import AddClient from "./features/agent/pages/AddClient";
import UpdatePassword from "./components/common/forms/UpdatePassword";
import React from "react";
import { NewSubscription } from './features/client/pages/NewSubscription';
import { SendMoney } from './features/client/pages/SendMoney';
import { Donation } from './features/client/pages/Donation';
import {RecurringPayments} from "./features/client/pages/ReccuringPayment";
import {ClientLayout} from "./features/client/components/ClientLayout";
import {SubscriptionPlans} from "./features/client/pages/SubscriptionPlans";
import UpdateProfile from './features/client/components/UpdateProfile';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/update-password" element={<UpdatePassword />} />



                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AgentList />} />
                        <Route path="agents">
                            <Route index element={<AgentList />} />
                            <Route path="add" element={<AddAgent />} />
                        </Route>
                        <Route path="clients" element={<ClientList userRole="admin" />} />
                    </Route>

                    {/* Agent Routes - Separate from Admin routes */}
                    <Route
                        path="/agent"
                        element={
                            <ProtectedRoute allowedRoles={['AGENT']}>
                                <AgentLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AgentDashboard />} />
                        <Route path="clients">
                            <Route index element={<ClientList userRole="agent" />} />
                            <Route path="add" element={<AddClient />} />
                        </Route>
                    </Route>

                    {/* Client Routes */}
                    <Route
                        path="/client"
                        element={
                            <ProtectedRoute allowedRoles={['CLIENT']}>
                                <ClientLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<ClientDashboard />} />
                        <Route path="new-subscription" element={<NewSubscription />} />
                        <Route path="update-profile" element={<UpdateProfile />} />
                        <Route path="subscription-plans" element={<SubscriptionPlans />} />
                        <Route path="recurring-payments" element={<RecurringPayments />} />
                        <Route path="send-money" element={<SendMoney />} />
                        <Route path="donation" element={<Donation />} />
                    </Route>




                </Routes>
            </div>
        </Router>
    );
}

export default App;