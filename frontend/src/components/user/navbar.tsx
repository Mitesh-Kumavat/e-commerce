// src/components/UserNavbar.tsx
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
    const [searchQuery, setSearchQuery] = useState('')
    const queryClient = useQueryClient()

    const logoutMutation = useMutation({
        mutationFn: logOutUser,
        onSuccess: () => {
            queryClient.clear()
            dispatch(reduxLogout());
            navigate("/login")
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        navigate(`/?keyword=${searchQuery}`)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo and Branding */}
                <div className="flex-shrink-0 flex items-center">
                    <Link to="/" className="flex items-center space-x-2 text-lg font-bold">
                        <ShoppingBagIcon className="h-6 w-6 text-primary" />
                        <span className="hidden md:block">E-Shop</span>
                    </Link>
                </div>

                <div className="hidden md:flex flex-grow justify-center mx-4">
                    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search for products..."
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Right-aligned Navigation and Actions */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Explore
                        </Link>
                        <Link to="/orders" className="text-sm font-medium transition-colors hover:text-primary">
                            View Orders
                        </Link>
                    </nav>

                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/cart">
                            <ShoppingCart className="h-5 w-5" />
                        </Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <UserCircle2 className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem asChild>
                                <Link to="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex flex-col space-y-4 pt-8">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                            <div className="flex flex-col space-y-2">
                                <Link to="/explore" className="text-lg font-medium">Explore</Link>
                                <Link to="/orders" className="text-lg font-medium">View Orders</Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}