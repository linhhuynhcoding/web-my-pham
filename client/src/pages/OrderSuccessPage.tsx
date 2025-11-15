import { Link, useParams } from 'react-router-dom';
import { useOrderDetails } from '../queries/order';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { CardSolid } from '../components/CardSolid';

export const OrderSuccessPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { data: order, isLoading, error } = useOrderDetails(orderId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error loading order details: {error.message}</div>;
    }

    if (!order) {
        return <div className="text-center py-10">Order not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <CardSolid className="p-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">Thank you for your order!</h1>
                <p className="mt-2 text-gray-600">Your order has been placed successfully.</p>
                <p className="mt-1 text-sm text-gray-500">Order ID: #{order.id}</p>

                <div className="text-left my-8">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="border rounded-md">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-4 border-b last:border-b-0">
                                <div className="flex items-center">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div>
                        <h3 className="font-bold">Shipping Address</h3>
                        <p>{order.shippingAddress}</p>
                        <p>{order.phone}</p>
                    </div>
                    <div className="md:text-right">
                        <h3 className="font-bold">Total Amount</h3>
                        <p className="text-2xl font-bold">${order.totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        to="/profile/orders"
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        View My Orders
                    </Link>
                </div>
            </CardSolid>
        </div>
    );
};