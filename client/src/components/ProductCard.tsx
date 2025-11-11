import { Product } from "../api/types";
import { CardMotion } from "./Card";

interface ProductCardProps {
    product: Product;
}


export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    return (
        <CardMotion className="border rounded-xl p-4 bg-white shadow-md w-60">
            <div className="relative">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                />
                {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{product.discount}%
                    </span>
                )}
            </div>
            <div className="mt-3">
                <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                    <span className="text-red-500 font-bold">{discountedPrice.toLocaleString()}₫</span>
                    {product.discount && (
                        <span className="text-gray-400 line-through text-xs">{product.price.toLocaleString()}₫</span>
                    )}
                </div>
                {product.id && (
                    <div className="flex items-center mt-1 text-yellow-400 text-xs">
                        <span>⭐ {5.0}</span>
                    </div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                    {product.buy_turn} đã bán
                </div>
            </div>
        </CardMotion>
    );
};