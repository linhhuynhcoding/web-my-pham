import { ShoppingCart } from "lucide-react";
import { Product } from "../api/types";
import { useAddCartItem } from "../queries/cart";
import { CardMotion } from "./Card";

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const addCartItemMutation = useAddCartItem();
    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addCartItemMutation.mutate({ productId: product.id, quantity: 1 });
        // Optionally, you can add a success notification here
    };

    return (
        <CardMotion className="border rounded-xl p-4 bg-white 
        shadow-md w-60">
            <div className="relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                />
                {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-black text-xs px-2 py-1 rounded">
                        -{product.discount}%
                    </span>
                )}
            </div>
            <div className="mt-3 flex-grow flex flex-col">
                <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
                <div className="flex-grow">
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    {product.id && (
                        <div className="flex items-center mt-1 text-yellow-400 text-xs">
                            <span>⭐ {5.0}</span>
                        </div>
                    )}
                    <div className="mt-2 text-xs text-gray-400">
                        {product.buyTurn} đã bán
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-col">
                        <span className="text-red-500 font-bold">{discountedPrice.toLocaleString()}₫</span>
                        {product.discount && (
                            <span className="text-gray-400 line-through text-xs">{product.price.toLocaleString()}₫</span>
                        )}
                    </div>
                    <button onClick={handleAddToCart} className="bg-red-500 text-black p-2 rounded-full hover:bg-red-600 transition-colors disabled:bg-gray-400" disabled={addCartItemMutation.isPending}>
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </CardMotion>
    );
};