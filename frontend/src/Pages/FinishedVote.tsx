import { Link, useSearchParams } from "react-router"
import { CheckmarkIcon } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Clipboard, House } from "lucide-react";

const FinishedVote = () => {
    const [searchParams] = useSearchParams();
    const pollId = searchParams.get('pollId');

    return (
        <div className="min-h-[855px] flex items-center justify-center bg-white">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckmarkIcon className="h-12 w-12 text-blue-900" />
                </div>
                <h1 className="text-3xl font-bold text-blue-900 mb-4">Vote Submitted</h1>
                <p className="text-blue-800 mb-6">
                    Your vote has been submitted successfully.
                </p>
                <div className="space-y-4">
                    <Button className="w-full gap-0">
                        <House className="h-5 w-5 mr-1" />
                        <Link to={`/elections/${pollId}`}>Return to Election</Link>
                    </Button>
                    <Button className="w-full gap-0">
                        <Clipboard className="h-5 w-5 mr-1" />
                        <Link to={`/viewFinishVote/${pollId}`}>View your votes</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FinishedVote