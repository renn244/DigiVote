import LoadingSpinner from "@/components/common/LoadingSpinner"
import CreateParties from "@/components/pages/admin/Parties/CreateParties"
import DeleteParties from "@/components/pages/admin/Parties/DeleteParties"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Edit } from "lucide-react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router"

const Parties = () => {
    const navigate = useNavigate()

    const { data: parties, isLoading } = useQuery({
        queryKey: ['parties'],
        queryFn: async () => {
            const response = await axiosFetch.get('/parties')

            if(response.status >= 400) {
                toast.error(response.data.message);
                return;
            }

            return response.data
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-900">Political Parties</h1>
                <CreateParties />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-auto lg:w-[450px]" >Name</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Poll</TableHead>
                        <TableHead className="w-[120px]">Created_at</TableHead>
                        <TableHead className="flex justify-end items-center pr-5">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {parties.map((party: any) => (
                        <TableRow key={party.id} onClick={() => navigate(`/admin/parties/${party.id}`)}>
                            <TableCell className="">
                                {party.name}
                            </TableCell>
                            <TableCell>
                                {/* poll branch */}
                                {party.branch}
                            </TableCell>
                            <TableCell>
                                {/* poll title */}
                                {party.title} 
                            </TableCell>
                            <TableCell>
                                {format(new Date(party.created_at), 'yyyy-MM-dd')}
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2 justify-end z-50">
                                    <Link onClick={(e) => e.stopPropagation()}
                                    to={`/admin/parties/update/${party.id}`}>
                                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <DeleteParties partyId={party.id} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Parties