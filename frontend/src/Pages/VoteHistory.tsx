import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axios"
import useDebounce from "@/lib/useDebounce"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useSearchParams } from "react-router"

const VoteHistoryHeader = () => {
    const [_, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState('')
    const debounceSearch = useDebounce(search, 300)

    useEffect(() => {
        setSearchParams((param) => ({
            ...param,
            search: debounceSearch
        }))
    }, [debounceSearch])

    return (
        <div className="flex items-center mr-7 w-full max-w-[400px]">
            <div className="relative w-full">
                <SearchIcon className="w-4 h-4 absolute left-2.5 top-3 text-gray-500 dark:text-gray-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                type="text" placeholder="Search election name" className="mr-2 w-full max-w-[500px] pl-8" />
            </div>
        </div>
    )
}

const VoteHistory = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const { data: voteHistory } = useQuery({
        queryKey: ['voteHistory', page, search],
        queryFn: async () => {
            const response = await axiosFetch.get(`/vote/getVoteHistory?page=${page}&search=${search}`)

            if(response.status >= 400) {
                toast.error('Failed to fetch vote history')
                return
            }

            return response.data
        },
        refetchOnWindowFocus: false
    })

    const handlePagination = (direction: 'next' | 'previous') => {
        let newPage = page;

        if(direction === 'next') {
            newPage = page + 1;
        } else {
            newPage = page - 1;
        }

        setSearchParams((param) => ({
            ...param,
            page: newPage
        }));
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 md:gap-0">
                <h1 className="text-2xl font-semibold leading-none tracking-tight ml-2 md:ml-5">Your Vote History</h1>
                <VoteHistoryHeader />
            </div>
            <Card>
                <CardContent className="pt-3">

                    {/* Table */}
                    <div className="h-[561px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Election Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Vote Type</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {voteHistory?.votes?.map((vote: any) => (
                                    <TableRow>
                                        <TableCell>{vote.election_name}</TableCell>
                                        <TableCell>{new Date(vote.created_at).toDateString()}</TableCell>
                                        <TableCell>{vote.vote_type}</TableCell>
                                        <TableCell>
                                            <Button asChild variant="outline" size="sm">
                                                <Link to={`/viewFinishVote/${vote.poll_id}`}>
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                </CardContent>
            </Card>
            
            {/* Pagination */}
            <div className="mt-4">
                <div className="flex items-center space-x-4">
                    <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handlePagination('previous')}
                    disabled={page <= 1}
                    >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Previous
                    </Button>
                    <p className="text-base text-muted-foreground">
                        Page {page}
                    </p>
                    <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handlePagination('next')}
                    disabled={voteHistory?.hasNext === false}
                    >
                        Next
                        <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default VoteHistory