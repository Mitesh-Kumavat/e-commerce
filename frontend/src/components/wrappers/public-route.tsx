import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Navigate, Outlet } from "react-router-dom"

export const PublicRoute = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}