import { Button } from "@/components/ui/button"
import { FileQuestion, HelpCircle, House } from "lucide-react"
import { Link } from "react-router"

const NotFound = () => {
    return (
        <div className="min-h-[855px] flex items-center justify-center bg-white">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="h-12 w-12 text-blue-900" />
                    </div>
                        <h1 className="text-3xl font-bold text-blue-900 mb-4">404 - Page Not Found</h1>
                        <p className="text-blue-800 mb-6">
                            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                        </p>
                    <div className="space-y-4">
                    <Button className="w-full gap-0">
                        <House className="h-5 w-5 mr-1" />
                        <Link to="/">Return to Home</Link>
                    </Button>
                    <Button variant="outline" className="w-full gap-0">
                        <HelpCircle className="h-5 w-5 mr-1" />
                        <Link to="/help">Get Help</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound