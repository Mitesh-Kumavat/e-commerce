import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, ShoppingCart, UserCircle2, Menu, ShoppingBagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logOutUser } from "@/api/auth"
import { useDispatch } from "react-redux"
import { logout as reduxLogout } from "@/store/auth-slice"

export const UserNavbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState("")
    const queryClient = useQueryClient()

    const logoutMutation = useMutation({
        mutationFn: logOutUser,
        onSuccess: () => {
            queryClient.clear()
            dispatch(reduxLogout())
            navigate("/login")
        },
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        navigate(`/?keyword=${searchQuery}`)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-8">

                <div className="flex-shrink-0 flex items-center min-w-0">
                    <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 text-base sm:text-lg font-bold">
                        <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                        <span className="hidden sm:block truncate">E-Commerce</span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center mx-2 sm:mx-4 max-w-md lg:max-w-xl">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 sm:pl-9 text-sm h-9 sm:h-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                    <nav className="hidden lg:flex items-center space-x-4 mr-2">
                        <Link to="/" className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap">
                            Explore
                        </Link>
                        <Link to="/orders" className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap">
                            Orders
                        </Link>
                    </nav>

                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" asChild>
                        <Link to="/cart">
                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                                <UserCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
                            <DropdownMenuItem asChild>
                                <Link to="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Sheet>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 p-0">
                            <div className="flex flex-col h-full">

                                <div className="px-6 py-4 border-b bg-muted/30">
                                    <div className="flex items-center space-x-2">
                                        <ShoppingBagIcon className="h-6 w-6 text-primary" />
                                        <span className="text-lg font-bold">E-Commerce</span>
                                    </div>
                                </div>

                                <div className="flex-1 px-6 py-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                                Browse
                                            </h3>
                                            <div className="space-y-1">
                                                <SheetTrigger asChild>
                                                    <Link
                                                        to="/"
                                                        className="flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-lg hover:bg-accent transition-colors group"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span>Explore Products</span>
                                                    </Link>
                                                </SheetTrigger>
                                                <SheetTrigger asChild>
                                                    <Link
                                                        to="/orders"
                                                        className="flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-lg hover:bg-accent transition-colors group"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span>My Orders</span>
                                                    </Link>
                                                </SheetTrigger>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                                Quick Actions
                                            </h3>
                                            <div className="space-y-1">
                                                <SheetTrigger asChild>
                                                    <Link
                                                        to="/cart"
                                                        className="flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-lg hover:bg-accent transition-colors group"
                                                    >
                                                        <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <span>Shopping Cart</span>
                                                    </Link>
                                                </SheetTrigger>
                                                <SheetTrigger asChild>
                                                    <Link
                                                        to="/profile"
                                                        className="flex items-center space-x-3 text-base font-medium py-3 px-3 rounded-lg hover:bg-accent transition-colors group"
                                                    >
                                                        <UserCircle2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <span>My Profile</span>
                                                    </Link>
                                                </SheetTrigger>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
