import { useGetAccounts } from "@/api/useGetAccounts";
import { User } from "@/api/types";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useMemo } from "react";

export const ManageAccountPage = () => {
    const [page, setPage] = useState(1);
    const [searchEmail, setSearchEmail] = useState("");

    const { data, isLoading, error } = useGetAccounts({
        pagination: {
            currentPage: page,
            pageSize: 10,
        },
    });

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= (data?.pagination?.lastPage || 1)) {
            setPage(newPage);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!data?.users) return [];
        if (!searchEmail) return data.users;
        return data.users.filter((user) =>
            user.email.toLowerCase().includes(searchEmail.toLowerCase())
        );
    }, [data?.users, searchEmail]);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manage Accounts</h1>
            <div className="mb-4">
                <Input
                    placeholder="Search by Email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Failed to load accounts.</p>}
            {!isLoading && !error && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Accounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user: User) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="flex items-center justify-center space-x-2 py-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={() => handlePageChange(page - 1)}
                                    />
                                </PaginationItem>
                                {Array.from({ length: data?.pagination?.lastPage || 1 }).map(
                                    (_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                )}
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={() => handlePageChange(page + 1)} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
};