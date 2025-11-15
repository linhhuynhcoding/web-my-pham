/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { CardSolid } from "../components/CardSolid";
import { useProductsByCategory } from "../queries/product";
import { PaginationControls } from "../components/PaginationControls";
import { ProductFilter, ProductOrderBy } from "../api/types";

const priceRanges = [
    { id: 'p1', label: 'Dưới 100.000đ', max: 100000 },
    { id: 'p2', label: '100.000đ - 250.000đ', min: 100000, max: 250000 },
    { id: 'p3', label: '250.000đ - 500.000đ', min: 250000, max: 500000 },
    { id: 'p4', label: 'Trên 500.000đ', min: 500000 },
];

const ProductCardSkeleton = () => (
    <div className="border rounded-lg p-2 flex flex-col gap-2 animate-pulse bg-gray-100">
        <div className="bg-gray-300 h-40 w-full rounded"></div>
        <div className="bg-gray-300 h-4 w-3/4 rounded mt-2"></div>
        <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
    </div>
);

export const CategoryProductPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<ProductFilter>({});
    const [orderBy, setOrderBy] = useState<ProductOrderBy>(ProductOrderBy.BEST_SELLER);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
    // Assuming origins are static for now as they are not returned from the API
    const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);

    const { data, isLoading, error } = useProductsByCategory(
        parseInt(categoryId || "0"),
        filters,
        orderBy,
        { currentPage: page, pageSize: 12 }
    );

    const resetFiltersAndPagination = () => {
        setPage(1);
    };

    const handleBrandFilterChange = (brandId: number, checked: boolean) => {
        setFilters(prevFilters => {
            const currentBrandIds = prevFilters.brandIds || [];
            if (checked) {
                return { ...prevFilters, brandIds: [...currentBrandIds, brandId] };
            } else {
                return { ...prevFilters, brandIds: currentBrandIds.filter(id => id !== brandId) };
            }
        });
        resetFiltersAndPagination();
    };

    const handlePriceFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        const rangeId = event.target.value;
        const selectedRange = priceRanges.find(r => r.id === rangeId);

        setSelectedPriceRange(rangeId);

        setFilters(prevFilters => ({
            ...prevFilters,
            priceRange: {
                max: selectedRange?.max,
                min: selectedRange?.min,
            },
        }));
        resetFiltersAndPagination();
    };

    const handleOriginFilterChange = (origin: string, checked: boolean) => {
        let newOrigins: string[];
        if (checked) {
            newOrigins = [...selectedOrigins, origin];
        } else {
            newOrigins = selectedOrigins.filter(o => o !== origin);
        }
        setSelectedOrigins(newOrigins);
        setFilters(prevFilters => ({
            ...prevFilters,
            origins: newOrigins.length > 0 ? newOrigins : undefined
        }));
        resetFiltersAndPagination();
    };


    if (error) {
        return <div className="text-red-500 text-center">Error loading products: {error.message}</div>;
    }

    return <div className="max-w-[60%] mx-auto flex w-full h-full gap-2 p-2">
        <CardSolid className="w-[15%] h-full rounded-none p-4">
            <h2 className="font-bold text-red-700 text-xl">Bộ lọc</h2>
            <div className="flex flex-col gap-4  text-xs">
                {/* Price Filter */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Giá</h3>
                    <div className="flex flex-col gap-1">
                        {priceRanges.map(range => (
                            <label key={range.id}>
                                <input
                                    type="radio"
                                    name="price"
                                    value={range.id}
                                    checked={selectedPriceRange === range.id}
                                    onChange={handlePriceFilterChange}
                                    className="mr-2" /> {range.label}</label>
                        ))}
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

                {/* Origin Filter */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold">Xuất xứ</h3>
                    <div className="flex flex-col gap-1">
                        {['Mỹ', 'Hàn Quốc', 'Pháp'].map(origin => (
                            <label key={origin}>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedOrigins.includes(origin)}
                                    onChange={(e) => handleOriginFilterChange(origin, e.target.checked)}
                                /> {origin}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </CardSolid>
        <CardSolid className="w-full h-full rounded-none p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-red-700 text-xl">Danh sách sản phẩm</h2>
                <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="sort-by" className="font-semibold">Sắp xếp theo:</label>
                    <select
                        id="sort-by"
                        value={orderBy}
                        onChange={(e) => setOrderBy(parseInt(e.target.value))}
                        className="p-1 border rounded-md"
                    >
                        <option value={ProductOrderBy.BEST_SELLER}>Bán chạy</option>
                        <option value={ProductOrderBy.PRICE_ASC}>Giá: Thấp đến Cao</option>
                        <option value={ProductOrderBy.PRICE_DESC}>Giá: Cao đến Thấp</option>
                    </select>
                </div>
            </div>
            {
                isLoading ?
                    <>
                        <div className="w-full grid grid-cols-4 gap-2 mb-4">
                            {Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)}
                        </div>
                    </>
                    : <>
                        <div className="w-full grid grid-cols-4 gap-2 mb-4">
                            {data?.products && data.products.length > 0 ? data.products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            )) : <p>Không tìm thấy sản phẩm nào phù hợp.</p>}
                        </div>
                        <PaginationControls pagination={data?.pagination} onPageChange={setPage} />
                    </>
            }
        </CardSolid>
    </div>
}