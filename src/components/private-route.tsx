// src/components/PrivateRoute.tsx
import { useAuth } from "@/context/auth-context";
import { Navigate, Outlet } from "react-router";

const PrivateRoute: React.FC = () => {
    const { token } = useAuth();

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;