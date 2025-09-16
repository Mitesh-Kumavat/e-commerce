import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Loader2, Mail, Lock, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation } from "@tanstack/react-query"
import { login } from "@/api/auth"
import { loginSuccess } from "@/store/auth-slice"
import { useDispatch } from "react-redux"

type LoginForm = {
    email: string
    password: string
}

export function LoginForm() {

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>()

    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            dispatch(loginSuccess(data?.data))
        }
    })

    const onSubmit = (data: LoginForm) => {
        mutate(data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary rounded-full p-3">
                            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-balance">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account to continue shopping</p>
                </div>

                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="pl-10"
                                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                                    />
                                </div>
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>

                            {error && (
                                <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-md">
                                    {(error as any)?.response?.data?.message || "Login failed. Please try again."}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-card-foreground hover:text-card-foreground/80 font-medium transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}