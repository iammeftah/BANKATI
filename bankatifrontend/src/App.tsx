// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import AgentList from './components/UsersLists/AgentList';
import AddAgent from './pages/admin/AddAgent';
import ClientList from './pages/admin/ClientList';
// import { ClientTermination } from './pages/admin/ClientTermination';
// import { ActivityLog } from './pages/admin/ActivityLog';
import { AgentDashboard } from './pages/AgentDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { Header } from "./components/layout/Header";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />

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
                        <Route path="agents" element={<AgentList />} />

                        <Route path="agents/add" element={<AddAgent />} />
                        <Route path="clients" element={<ClientList />} />
                        {/*
                        <Route path="clients/termination" element={<ClientTermination />} />
                        <Route path="activity" element={<ActivityLog />} />
                        */}
                    </Route>

                    {/* Other Dashboard Routes */}
                    <Route
                        path="/agent"
                        element={
                            <ProtectedRoute allowedRoles={['AGENT']}>
                                <AgentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/client"
                        element={
                            <ProtectedRoute allowedRoles={['CLIENT']}>
                                <ClientDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;