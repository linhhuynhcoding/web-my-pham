
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteCartItem, useLoadCart, useUpdateCartItem } from '../queries/cart';
import { Loader2, Trash2 } from 'lucide-react';
import { CardSolid } from '../components/CardSolid';
import { CartItem } from '../api/types';
import { useState } from 'react';

export const CartPage = () => {
    const { data: cartData, isLoading, error } = useLoadCart();
    const updateCartItemMutation = useUpdateCartItem();
    const deleteCartItemMutation = useDeleteCartItem();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const handleSelectItem = (itemId: number, isChecked: boolean) => {
        setSelectedItems((prevSelected) => {
            if (isChecked) {
                // Add item to selection
                return [...prevSelected, itemId];
            } else {
                // Remove item from selection
                return prevSelected.filter((id) => id !== itemId);
            }
        });
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one item to checkout.');
            return;
        }
        const selectedItemsString = selectedItems.join(',');
        const encodedItems = btoa(selectedItemsString); // Base64 encode the string
        navigate(`/checkout/${encodedItems}`);
    };

    const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
        if (newQuantity > 0) {
            updateCartItemMutation.mutate({ cartItemId, quantity: newQuantity });
        }
    };

    const handleDeleteItem = (cartItemId: number) => {
        deleteCartItemMutation.mutate({ cartItemId });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error loading cart: {error.message}</div>;
    }

    const cartItems = cartData?.items || [];

    return (
        <div className="max-w-[60%] mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {cartItems.length === 0 ? (
                <CardSolid className="text-center p-10">
                    <p className="text-lg text-gray-600">Your cart is empty.</p>
                    <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                        Continue Shopping
                    </Link>
                </CardSolid>
            ) : (
                <div className="grid grid-cols-3 gap-8">
                    {/* Cart Items Column */}
                    <div className="col-span-2">
                        <CardSolid className="p-4 space-y-4">
                            {cartItems.map((item: CartItem) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                    />
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500">Price: ${item.product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="border rounded-md px-2 py-1">-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="border rounded-md px-2 py-1">+</button>
                                    </div>
                                    <p className="font-semibold w-24 text-right">${item.subtotal.toFixed(2)}</p>
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </CardSolid>
                    </div>

                    {/* Checkout Column */}
                    <div className="col-span-1">
                        <CardSolid className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${cartData?.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>${cartData?.checkOutBill.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Proceed to Checkout
                            </button>
                        </CardSolid>
                    </div>
                </div>
            )}
        </div>
    );
};