import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import AgentLayout from "./components/layout/AgentLayout";
import AgentList from './pages/admin/AgentList';
import AddAgent from './pages/admin/AddAgent';
import ClientList from './pages/admin/ClientList';
import AgentDashboard from './pages/AgentDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { Header } from "./components/layout/Header";
import AddClient from "./pages/agent/AddClient";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                    {/* Public Routes */}
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
                        <Route path="agents">
                            <Route index element={<AgentList />} />
                            <Route path="add" element={<AddAgent />} />
                        </Route>
                        <Route path="clients" element={<ClientList />} />
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
                            <Route index element={<ClientList />} />
                            <Route path="add" element={<AddClient />} />
                        </Route>
                    </Route>

                    {/* Client Routes */}
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