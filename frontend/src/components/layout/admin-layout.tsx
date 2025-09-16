import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    LayoutDashboard,
    Plus,
    Package,
    Users,
    LogOut,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { logout } from '@/store/auth-slice';
import { logOutUser } from '@/api/auth';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';

const sidebarItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { title: "Add Product", icon: Plus, href: "/admin/add-product" },
    { title: "Manage Products", icon: Package, href: "/admin/manage-products" },
    { title: "Manage Users", icon: Users, href: "/admin/manage-users" },
]

interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: logOutUser,
        onSuccess: () => {
            dispatch(logout());
            queryClient.invalidateQueries();
            toast.success("Logged out successfully");
            navigate("/login");
        },
        onError: (error) => {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar */}
                <Sidebar variant="inset" className="border-r">
                    <SidebarHeader className="border-b border-sidebar-border">
                        <div className="flex items-center gap-2 px-4 py-1">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Package className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">E-Commerce</span>
                                <span className="truncate text-xs text-sidebar-foreground/70">Admin Panel</span>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {sidebarItems.map((item) => {
                                        const Icon = item.icon
                                        const isActive = location.pathname === item.href

                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                                    <Link to={item.href}>
                                                        <Icon className="size-4" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-sidebar-border">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                {user ? (
                                    <>
                                        <SidebarMenuButton
                                            size="lg"
                                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                                                <AvatarFallback className="rounded-lg">
                                                    {user.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">{user.name}</span>
                                                <span className="truncate text-xs text-sidebar-foreground/70">{user.email}</span>
                                            </div>
                                        </SidebarMenuButton>
                                        <Separator />
                                        <SidebarMenuButton onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </SidebarMenuButton>
                                    </>
                                ) : (
                                    <p className="text-sm text-center text-muted-foreground">User not found.</p>
                                )}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset>
                    <header className="flex h-14 shrink-0 items-center border-b bg-card px-4">
                        <SidebarTrigger className="-ml-1" />
                    </header>
                    <main className="flex-1 p-6">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}