import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Users = () => {
    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axiosFetch.get('/user')

            return response.data
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-900">Users</h1>
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
                            {users.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.student_id}</TableCell>
                                    <TableCell>{user.year_level}</TableCell>
                                    <TableCell>{user.course}</TableCell>
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
                    >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Previous
                    </Button>
                    <p className="text-base text-muted-foreground">
                        Page 1
                    </p>
                    <Button
                    variant="outline"
                    size="lg"
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