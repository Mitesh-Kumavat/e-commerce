import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllUsers, deleteUserById } from "@/api/users"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Users, AlertTriangle, Mail, Calendar, ShoppingBag } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface User {
    _id: string
    name: string
    email: string
    createdAt: string
    updatedAt: string
    isDeleted: boolean
    totalOrders: number
}

export default function ManageUsersPage() {
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
    })

    const deleteUserMutation = useMutation({
        mutationFn: deleteUserById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success("User deleted", {
                description: "User deleted successfully",
            })
            setDeleteUserId(null)
        },
        onError: (error: any) => {
            toast.error("Failed to delete user", {
                description: error.response?.data?.message || "Failed to delete user",
            })
        },
    })

    const handleDeleteUser = (userId: string) => {
        deleteUserMutation.mutate(userId)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Users</h3>
                    <p className="text-gray-600">Failed to load users data. Please try again.</p>
                </div>
            </div>
        )
    }

    const users: User[] = data?.data || []

    return (
        <div className="space-y-6 p-6 pt-2">
            <div>
                <h1 className="text-3xl font-bold text-balance">Manage Users</h1>
            </div>

            <Card className="shadow-sm border-0 bg-white">

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/30">
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            User
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                        <div className="flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4" />
                                            Orders
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Joined
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500 md:hidden">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <div className="text-gray-600 text-sm">{user.email}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {user.totalOrders}
                                                <span className="text-sm text-gray-600 hidden sm:inline">total orders</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden lg:table-cell">
                                            <div className="text-sm text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge
                                                variant={user.isDeleted ? "destructive" : "default"}
                                                className={
                                                    !user.isDeleted
                                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                        : "bg-red-100 text-red-800 hover:bg-red-100"
                                                }
                                            >
                                                {user.isDeleted ? "Deleted" : "Active"}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {!user.isDeleted && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteUserId(user._id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
                                                    disabled={deleteUserMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete user</span>
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                            <p className="text-gray-600 text-sm">No users are registered yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteUserMutation.isPending}
                        >
                            {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
