import ShowFaqs from "@/components/pages/admin/Faqs/ShowFaqs"
import ShowQuestions from "@/components/pages/community-help/ShowQuestions"
import { Input } from "@/components/ui/input"
import useDebounce from "@/lib/useDebounce"
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"

/*
* make this public from unauthenticated users
* but make it so that they are not able to comment or post questions
*/

const HelpHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const debounceValue = useDebounce(search, 450);

    useEffect(() => {
        setSearchParams((prev) => ({
            ...prev,
            search: debounceValue
        }))
    }, [debounceValue])

    return (
        <div className="flex items-center relative mb-4">
            <SearchIcon className="absolute ml-2 h-5 w-5 text-gray-500" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
            type="text" placeholder="Search for help..." className="mr-2 pl-8 focus-visible:ring-0" />
        </div>
    )
}

const Help = () => {
    return (
        <div className="min-h-[855px] container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">Help Center</h1>
            <div className="mb-8">
                <HelpHeader />

                <ShowFaqs />
            </div>

            <div>
                <ShowQuestions />
            </div>
        </div>
    )
}

export default Help