import LoadingSpinner from "@/components/common/LoadingSpinner"
import CreatePoll from "@/components/pages/admin/Poll/CreatePoll"
import DeletePoll from "@/components/pages/admin/Poll/DeletePoll"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axios"
import { poll } from "@/types/poll"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Edit } from "lucide-react"
import toast from "react-hot-toast"
import { Link } from "react-router"



const Polls = () => {
    
    const { data: polls, isLoading } = useQuery({
        queryKey: ['polls'],
        queryFn: async () => {
            const response = await axiosFetch.get('/poll');

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            return response.data;
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) return <LoadingSpinner />

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Poll Management</h1>
                <CreatePoll />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-auto lg:w-[450px]">Title</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[120px]">Start Date</TableHead>
                        <TableHead className="w-[120px]">End Date</TableHead>
                        <TableHead className="flex justify-end items-center pr-5">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {polls.map((poll: poll) => (
                        <TableRow key={poll.id}>
                            <TableCell className="font-medium">
                                {poll.title}
                            </TableCell>
                            <TableCell>
                                {poll.branch}
                            </TableCell>
                            <TableCell>
                                {poll.vote_type}
                            </TableCell>
                            <TableCell>
                                {format(new Date(poll.start_date), 'yyyy-MM-dd')}
                            </TableCell>
                            <TableCell>
                                {format(new Date(poll.end_date), 'yyyy-MM-dd')}
                            </TableCell>
                            <TableCell>
                            <div className="flex space-x-2 justify-end">
                                <Link to={`/admin/polls/update/${poll.id}`}>
                                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <DeletePoll pollId={poll.id} />
                            </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Polls