import ShowFaqs from "@/components/pages/admin/Faqs/ShowFaqs"
import ShowQuestions from "@/components/pages/community-help/ShowQuestions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const Help = () => {
    // impleemnt a search later using search params so that it can be detected by both faqs and community questions

    return (
        <div className="min-h-[855px] container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">Help Center</h1>
            <div className="mb-8">
                <div className="flex mb-4">
                    <Input type="text" placeholder="Search for help..." className="mr-2" />
                    <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>

                <ShowFaqs />
            </div>

            <div>
                <ShowQuestions />
            </div>
        </div>
    )
}

export default Help