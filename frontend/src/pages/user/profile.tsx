"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { getCurrentUser, updateCurrentUser } from "@/api/users"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, User, Mail, Edit3, Save, X } from "lucide-react"
import { toast } from "sonner"

type ProfileFormData = {
    name: string
    email: string
}

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>()

    const {
        data: userResponse,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
    })

    const user = userResponse?.data

    // Update user mutation
    const updateMutation = useMutation({
        mutationFn: updateCurrentUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] })
            setIsEditing(false)
            toast.success("Profile updated successfully!")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile")
        },
    })

    const handleEdit = () => {
        reset({ name: user?.name || "", email: user?.email || "" })
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        reset()
    }

    const onSubmit = (data: ProfileFormData) => {
        if (!data.name.trim() || !data.email.trim()) {
            toast.error("Name and email are required")
            return
        }
        updateMutation.mutate(data)
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading profile...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center text-red-600">Failed to load profile. Please try again.</div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container max-w-2xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground mt-2">Manage your personal information and account settings</p>
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                                        {user?.name ? getInitials(user.name) : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-xl">{user?.name}</CardTitle>
                                    <CardDescription className="text-base">{user?.email}</CardDescription>
                                </div>
                            </div>
                            {!isEditing && (
                                <Button onClick={handleEdit} variant="outline" size="sm">
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {isEditing ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        {...register("name", {
                                            required: "Name is required",
                                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                                        })}
                                        placeholder="Enter your full name"
                                        className="h-11"
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        placeholder="Enter your email address"
                                        className="h-11"
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={updateMutation.isPending || !isDirty} className="flex-1">
                                        {updateMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button type="button" onClick={handleCancel} variant="outline" disabled={updateMutation.isPending}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                        <p className="text-base font-semibold">{user?.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                        <p className="text-base font-semibold">{user?.email}</p>
                                    </div>
                                </div>

                                {user?.createdAt && (
                                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                                            <p className="text-base font-semibold">
                                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
