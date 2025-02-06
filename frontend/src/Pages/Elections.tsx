import ElectionCard from "@/components/pages/ElectionCard"
import { Card, CardContent } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { pollsView } from "@/types/poll"
import { useQuery } from "@tanstack/react-query"
import { VoteIcon } from "lucide-react"
import toast from "react-hot-toast"


const Elections = () => {

  // request data for available election in your branch
  const { data:elections, isLoading } = useQuery({
    queryKey: ['elections'],
    queryFn: async () => {
      const response = await axiosFetch.get(`/poll`)

      if(response.status >= 400) {
        toast.error(response.data.message)
        return
      }

      return response.data as pollsView
    },
    refetchOnWindowFocus: false
  })

  if(isLoading) {
    return (
      <div className="min-h-[855px] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">
            Upcoming Elections
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[855px] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          Upcoming Elections
        </h1>
          {elections && elections?.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {elections?.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          ) : (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <VoteIcon className="w-16 h-16 text-yellow-400 mb-4" />
                <h2 className="text-2xl font-semibold text-yellow-800 mb-2">No Elections Available</h2>
                <p className="text-yellow-600 text-center max-w-md">
                  Sorry, there are currently no elections available in your branch. Please check back later for upcoming elections.
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}

export default Elections