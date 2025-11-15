import { useState, ChangeEvent } from "react";
import { useAdminLoadOrders } from "@/queries/useAdminOrders";
import { AdminOrderFilter, AdminOrderOrderBy, Order } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
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
import { useDebounce } from "./useDebounce";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { OrderDetailModal } from "@/components/OrderDetailModal";
import { PackageOpen, Search, Hash, CalendarDays, CircleDollarSign } from "lucide-react";

export const ManageOrderPage = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<AdminOrderFilter>({});
    const [orderBy, setOrderBy] = useState<AdminOrderOrderBy>();
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const debouncedFilters = useDebounce(filters, 500);

    const { data, isLoading, error } = useAdminLoadOrders({
        pagination: {
            currentPage: page,
            pageSize: 10,
        },
        filter: debouncedFilters,
        orderBy: orderBy,
    });

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= (data?.pagination?.lastPage || 1)) {
            setPage(newPage);
        }
    };

    const handleFilterChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "min" || name === "max") {
            setFilters((prev) => ({
                ...prev,
                totalAmountRange: { ...prev.totalAmountRange!, [name]: parseFloat(value) || 0 },
            }));
        } else if (name === "orderId") {
            setFilters((prev) => ({ ...prev, [name]: parseInt(value) || undefined }));
        }
        else {
            setFilters((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDateChange = (dateRange: DateRange | undefined) => {
        setFilters((prev) => ({
            ...prev,
            dateRange: {
                startDate: dateRange?.from?.toISOString(),
                endDate: dateRange?.to?.toISOString(),
            },
        }));
    };

    const handleStatusChange = (status: string) => {
        setFilters((prev) => ({ ...prev, status: status === "ALL" ? undefined : status }));
    };

    const handleOrderByChange = (value: string) => {
        setOrderBy(parseInt(value) as AdminOrderOrderBy);
    };

    const getStatusBadgeClasses = (
        status: string
    ): string => {
        switch (status.toUpperCase()) {
            case "DELIVERED":
                return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700";
            case "SHIPPED":
                return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700";
            case "PROCESSING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700";
            case "PENDING":
            default:
                return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600";
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by User Email..."
                                name="userEmail"
                                value={filters.userEmail || ""}
                                onChange={handleFilterChange}
                                className="pl-10"
                            />
                        </div>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                placeholder="Order ID"
                                name="orderId"
                                value={filters.orderId || ""}
                                onChange={handleFilterChange}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filters.status || "ALL"} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={orderBy?.toString()} onValueChange={handleOrderByChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Order Date (Newest First)</SelectItem>
                                <SelectItem value="1">Order Date (Oldest First)</SelectItem>
                                <SelectItem value="2">Total Amount (High to Low)</SelectItem>
                                <SelectItem value="3">
                                    Total Amount (Low to High)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <DateRangePicker
                                date={{
                                    from: filters.dateRange?.startDate ? new Date(filters.dateRange.startDate) : undefined,
                                    to: filters.dateRange?.endDate ? new Date(filters.dateRange.endDate) : undefined,
                                }}
                                onDateChange={handleDateChange}
                                className="pl-10"
                            />
                        </div>
                        <div className="relative flex items-center">
                            <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" placeholder="Min Amount" name="min" value={filters.totalAmountRange?.min || ""} onChange={handleFilterChange} className="pl-10 rounded-r-none" />
                            <span className="px-3 py-2 bg-muted border-y border-input">-</span>
                            <Input type="number" placeholder="Max Amount" name="max" value={filters.totalAmountRange?.max || ""} onChange={handleFilterChange} className="rounded-l-none" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error && <p className="text-red-500">Failed to load orders.</p>}

            {!error && (
                <Card className="flex-grow">
                    <CardHeader>
                        <CardTitle>All Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                        {isLoading ? (
                            <TableSkeleton columns={6} />
                        ) : data?.orders && data.orders.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Total Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Order Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.orders.map((order: Order) => (
                                        <TableRow key={order.id} className="hover:bg-muted/50">
                                            <TableCell>#{order.id}</TableCell>
                                            <TableCell>{order.userEmail}</TableCell>
                                            <TableCell>
                                                ${order.totalPrice.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadgeClasses(order.status)}>{order.status.toUpperCase()}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedOrderId(order.id)}
                                                >
                                                    See Detail
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center p-10 min-h-[300px]">
                                <PackageOpen className="h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-lg text-muted-foreground">
                                    Hiện tại không có đơn hàng nào
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="flex items-center justify-center space-x-2 py-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
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
                            <PaginationNext onClick={() => handlePageChange(page + 1)} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <OrderDetailModal
                orderId={selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
            />
        </div>
    );
};