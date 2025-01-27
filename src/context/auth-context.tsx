import { createContext, useContext, useState } from "react";

interface AuthContextType {
    user: string | null;
    token: string | null;
    login: (token: string, user: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = (token: string, user: string) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};