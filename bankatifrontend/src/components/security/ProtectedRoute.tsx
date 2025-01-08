// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: string[];
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        authService.logout(); // Clear any invalid auth data
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};