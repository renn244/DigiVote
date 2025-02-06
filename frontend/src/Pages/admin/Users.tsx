import UserOptions from "@/components/pages/admin/User/UserOptions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axios"
import useDebounce from "@/lib/useDebounce"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"

const UsersHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState<string>(searchParams.get('search') || '')
    const debounceSearch = useDebounce(search, 300);

    useEffect(() => {
        setSearchParams((param) => ({
            ...param,
            search: debounceSearch
        }))
    }, [debounceSearch])

    return (
        <div className="flex items-center w-full max-w-[400px] mr-7">
            <div className="w-full max-w-lg relative">
                <SearchIcon className="w-4 h-4 absolute left-2.5 top-3 text-gray-500 dark:text-gray-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                type="text" placeholder="Search student id" className="pl-8 focus-visible:ring-0" />
            </div>
        </div>
    )
}

const Users = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''

    const { data: users } = useQuery({
        queryKey: ['users', page, search],
        queryFn: async () => {
            const response = await axiosFetch.get(`/user?page=${page}&search=${search}`);

            return response.data
        }
    })

    const handlePagination = (direction: 'next' | 'previous') => {
        let newPage = page;

        if(direction === 'next') {
            newPage += 1
        } else {
            newPage -= 1
        }

        setSearchParams((param) => ({
            ...param,
            page: newPage
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-900">Users</h1>
                <UsersHeader />
            </div>
            
            {/* Table */}
            <Card>
                <CardContent className="h-[660px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-auto lg:w-[450px]">Name</TableHead>
                                <TableHead>Std Id</TableHead>
                                <TableHead>Year Level</TableHead>
                                <TableHead>Course/Strand</TableHead>
                                <TableHead className="w-[40px]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.users?.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.student_id}</TableCell>
                                    <TableCell>{user.year_level}</TableCell>
                                    <TableCell>{user.course}</TableCell>
                                    <TableCell>
                                        <UserOptions searchParams={{
                                            search: search,
                                            page: page
                                        }} 
                                        userId={user.id} name={user.name} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                    disabled={users?.hasNext === false}
                    >
                        Next
                        <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Users