import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLoadCheckout } from "../queries/checkout";
import { Loader2 } from "lucide-react";
import { CardSolid } from "../components/CardSolid";

export const CheckoutPage = () => {
    const { cartItems: encodedItemIds } = useParams<{ cartItems: string }>();
    const { data: checkoutData, isLoading, error } = useLoadCheckout(encodedItemIds);

    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement order placement logic
        console.log({
            address,
            notes,
            selectedPaymentMethod,
            items: checkoutData?.orderInfo.items,
        });
        alert('Order placed! (See console for details)');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error loading checkout: {error.message}</div>;
    }

    const { orderInfo, orderDetailForm } = checkoutData || {};

    return (
        <div className="max-w-[60%] mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-3 gap-8">
                {/* Order Form Column */}
                <div className="col-span-2">
                    <CardSolid className="p-6 space-y-6">
                        <h2 className="text-2xl font-bold">Shipping Information</h2>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div >
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Method</h3>
                            <div className="space-y-4">
                                {orderDetailForm?.availablePaymentMethods.map((method) => (
                                    <div
                                        key={method.type}
                                        onClick={() => setSelectedPaymentMethod(method.name)}
                                        className={`max-w-[200px] min-h-[100px] p-4 border rounded-md cursor-pointer transition-all ${selectedPaymentMethod === method.name ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-300'
                                            }`}
                                    >
                                        <p className="font-semibold">{method.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardSolid>
                </div>

                {/* Order Info Column */}
                <div className="col-span-1">
                    <CardSolid className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {orderInfo?.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{item.product.name} x {item.quantity}</span>
                                    <span className="text-gray-600">${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Shipping Fee</span>
                                <span>${orderInfo?.shippingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span>${orderInfo?.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <button type="submit" className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors">
                            Place Order
                        </button>
                    </CardSolid>
                </div>
            </form>
        </div>
    );
};