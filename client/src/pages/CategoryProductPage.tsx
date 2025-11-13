/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { CardSolid } from "../components/CardSolid";
import { useProductsByCategory } from "../queries/product";
import { PaginationControls } from "../components/PaginationControls";
import { ProductFilter, ProductOrderBy } from "../api/types";

export const CategoryProductPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<ProductFilter>({});
    const [orderBy, setOrderBy] = useState<ProductOrderBy>(ProductOrderBy.BEST_SELLER);

    const { data, isLoading, error } = useProductsByCategory(
        parseInt(categoryId || "0"),
        filters,
        orderBy,
        { currentPage: page, pageSize: 12 }
    );

    const handleBrandFilterChange = (brandId: number, checked: boolean) => {
        setFilters(prevFilters => {
            const currentBrandIds = prevFilters.brandIds || [];
            if (checked) {
                return { ...prevFilters, brandIds: [...currentBrandIds, brandId] };
            } else {
                return { ...prevFilters, brandIds: currentBrandIds.filter(id => id !== brandId) };
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin h-10 w-10" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">Error loading products: {error.message}</div>;
    }

    return <div className="max-w-[60%] mx-auto flex w-full h-full gap-4 p-2">
        <CardSolid className="w-[20%] h-full rounded-none p-4">
            <h2 className="font-bold text-red-700 text-2xl">Bộ lọc</h2>
            <div className="flex flex-col gap-4">
                {/* Price Filter (Static for now) */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Giá</h3>
                    <div className="flex flex-col gap-1">
                        {/* TODO: Implement price filter logic */}
                        <label><input type="checkbox" className="mr-2" /> Dưới 100.000đ</label>
                        <label><input type="checkbox" className="mr-2" /> 100.000đ - 250.000đ</label>
                        <label><input type="checkbox" className="mr-2" /> 250.000đ - 500.000đ</label>
                        <label><input type="checkbox" className="mr-2" /> Trên 500.000đ</label>
                    </div>
                </div>

                {/* Brand Filter */}
                {data?.brands && data.brands.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Thương hiệu</h3>
                        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {data.brands.map(brand => (
                                <label key={brand.id}>
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        onChange={(e) => handleBrandFilterChange(brand.id, e.target.checked)}
                                        checked={filters.brandIds?.includes(brand.id)}
                                    />
                                    {brand.name}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Origin Filter (Static for now) */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Xuất xứ</h3>
                    <div className="flex flex-col gap-1">
                        {/* TODO: Implement origin filter logic */}
                        <label><input type="checkbox" className="mr-2" /> Mỹ</label>
                        <label><input type="checkbox" className="mr-2" /> Hàn Quốc</label>
                        <label><input type="checkbox" className="mr-2" /> Pháp</label>
                    </div>
                </div>
            </div>
        </CardSolid>
        <CardSolid className="w-[80%] h-full rounded-none p-4">
            <h2 className="font-bold text-red-700 text-2xl">Danh sách sản phẩm</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
                {data?.products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <PaginationControls pagination={data?.pagination} onPageChange={setPage} />
        </CardSolid>
    </div>
}