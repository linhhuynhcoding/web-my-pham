/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from '@/api/types';
import { useAddCartItem } from '@/queries/cart';
import { toast } from 'react-hot-toast';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    isAddingToCart: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const addCartItemMutation = useAddCartItem();

    const addToCart = useCallback((product: Product, quantity: number) => {
        addCartItemMutation.mutate({ productId: product.id, quantity }, {
            onSuccess: () => {
                setCartItems(prevItems => {
                    const existingItem = prevItems.find(item => item.product.id === product.id);

                    if (existingItem) {
                        return prevItems.map(item =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        );
                    }
                    return [...prevItems, { product, quantity }];
                });
                toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
            },
            onError: (error) => {
                toast.error(`Lỗi: ${error.message || 'Không thể thêm vào giỏ hàng.'}`);
            }
        });

    }, [addCartItemMutation]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            isAddingToCart: addCartItemMutation.isPending
        }}>
            {children}
        </CartContext.Provider>
    );
};