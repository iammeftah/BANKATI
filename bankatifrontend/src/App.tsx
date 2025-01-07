import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AgentDashboard } from './pages/AgentDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import {Header} from "./components/layout/Header";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
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