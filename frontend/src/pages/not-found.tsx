import { Link } from "react-router-dom"
import { Frown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 text-center">
            <Frown className="h-24 w-24 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                404 - Page Not Found
            </h1>
            <p className="max-w-md text-muted-foreground">
                Oops! The page you're looking for doesn't seem to exist. It might have been moved or deleted.
            </p>
            <Button asChild>
                <Link to="/">
                    Go to Homepage
                </Link>
            </Button>
        </div>
    )
}