import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import CreateCandidates from "./CreateCandidates"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteCandidate from "./DeleteCandidate"
import UpdateCandidate from "./UpdateCandidate"

type CandidatesProps = {
    pollId: number
}

const Candidates = ({
   pollId 
}: CandidatesProps) => {
    const { id: partyId } = useParams()

    const { data: parties, isLoading } = useQuery({
        queryKey: ['candidates', partyId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/candidates?partyId=${partyId}`)

            if(response.status >= 400) {
                return
            }

            return response.data
        },
        refetchOnWindowFocus: false
    })

    if(!partyId) {
        // something went wrong
        return
    }

    if(isLoading) return <LoadingSpinner />

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0" >
                <CardTitle>Candidates</CardTitle>
                <CreateCandidates partyId={partyId} pollId={pollId} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Votes</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parties?.map((candidate: any) => (
                            <TableRow key={candidate.id}>
                                <TableCell className="font-medium">{candidate.name}</TableCell>
                                <TableCell>{candidate.position}</TableCell>
                                <TableCell>100</TableCell>
                                {/* <TableCell>{candidate.votes.toLocaleString()}</TableCell> */}
                                <TableCell className="text-right">
                                    <UpdateCandidate initialData={candidate} pollId={pollId} candidateId={candidate.id} />
                                    <DeleteCandidate candidateId={candidate.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Candidates