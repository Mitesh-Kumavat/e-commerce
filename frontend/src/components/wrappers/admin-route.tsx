import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Navigate, Outlet } from "react-router-dom"

export const AdminRoute = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    const isAdmin = isAuthenticated && user?.role === "admin"

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}