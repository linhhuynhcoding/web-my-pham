/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { JSX, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { decodeToken, getAccessTokenFromLocalStorage } from "@/libs/jwt";

export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="h-full w-full flex flex-1 h-screen bg-gray-50 min-h-screen">
            <Sidebar currentPage={location.pathname} onNavigate={(page) => navigate(`${page}`)} />
            <div className="flex flex-1 flex-col overflow-hidden p-4">
                {/* <Header title={currentPage} /> */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

interface AdminRouteProps {
    children: JSX.Element;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            const accessToken = getAccessTokenFromLocalStorage();

            if (!accessToken) {
                navigate("/login", { replace: true });
                return;
            }

            const jwtDecoded = decodeToken(accessToken) as any;

            if (!jwtDecoded) {
                navigate("/login", { replace: true });
                return;
            }

            setIsAuthenticated(true);

            const role = (jwtDecoded?.role as string)?.toLowerCase();
            if (role === "admin") {
                setIsAdmin(true);
            } else {
                navigate("/login", { replace: true });
            }
        }
    }, [isAuthenticated, setIsAuthenticated, setIsAdmin, navigate]);

    if (!isAuthenticated || !isAdmin) {
        return null; // chờ useEffect update trạng thái
    }

    return children;
};
