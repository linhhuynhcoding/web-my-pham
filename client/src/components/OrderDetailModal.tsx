import { useOrderDetails } from "@/queries/order";
import { useUpdateOrderStatus } from "@/queries/useAdminOrders";
import { ModalOverlay } from "./ui/ModalOverlay";
import { TableSkeleton } from "./ui/TableSkeleton";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { OrderItem } from "@/api/types";
import { useState, useEffect } from "react";

interface OrderDetailModalProps {
    orderId: number | null;
    onClose: () => void;
}

export const OrderDetailModal = ({
    orderId,
    onClose,
}: OrderDetailModalProps) => {
    const {
        data,
        isLoading,
        isError,
    } = useOrderDetails(orderId?.toString());
    const updateStatusMutation = useUpdateOrderStatus();
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const order = data;

    useEffect(() => {
        if (order?.status) {
            setSelectedStatus(order.status.toUpperCase());
        }
    }, [order?.status]);

    const handleStatusUpdate = () => {
        if (orderId && selectedStatus) {
            updateStatusMutation.mutate(
                { orderId, status: selectedStatus },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        }
    };

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
        switch (status) {
            case "DELIVERED":
                return "default";
            case "CANCELLED":
                return "destructive";
            case "PENDING":
            case "PROCESSING":
            case "SHIPPED":
            default:
                return "secondary";
        }
    };
    return (
        <ModalOverlay
            isOpen={orderId !== null}
            onClose={onClose}
            title={`Order Detail #${orderId}`}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={handleStatusUpdate}
                        disabled={updateStatusMutation.isPending}
                    >
                        {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                    </Button>
                </>
            }
        >
            {isLoading && <TableSkeleton columns={4} rows={3} />}
            {isError && <p className="text-red-500">Failed to load order details.</p>}
            {order && (
                <div className="grid gap-6 md:grid-cols-5">
                    <div className="md:col-span-3 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-center">Quantity</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item: OrderItem) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <span className="font-medium">{item.product.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><span className="font-semibold">Email:</span> {order.userEmail}</p>
                                <p><span className="font-semibold">Phone:</span> {order.phone}</p>
                                <p><span className="font-semibold">Address:</span> {order.shippingAddress}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Order Date:</span>
                                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Status:</span>
                                    <Badge variant={getStatusBadgeVariant(order.status.toUpperCase())}>{order.status}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total:</span>
                                    <span className="text-lg font-bold">${order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-semibold">Update Status</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="PROCESSING">Processing</SelectItem>
                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </ModalOverlay>
    );
};