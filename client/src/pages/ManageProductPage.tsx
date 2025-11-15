import { useState, ChangeEvent } from "react";
import { Brand, Category, Product, ProductFilter, ProductOrderBy } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useListBrands } from "@/queries/useAdminBrands";
import { useListCategories } from "@/queries/useAdminCategories";
import { Check, ChevronsUpDown, PackageOpen, Search, DollarSign } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
import { EditProductModal } from "@/components/EditProductModal";
import { CreateProductModal } from "@/components/CreateProductModal";
import { useListProducts } from "@/queries/useAdminProducts";


export const ManageProductPage = () => {
    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState<ProductOrderBy>();
    const [filters, setFilters] = useState<ProductFilter>({});
    const debouncedFilters = useDebounce(filters, 500);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [openBrandPopover, setOpenBrandPopover] = useState(false);
    const [openCategoryPopover, setOpenCategoryPopover] = useState(false);

    // Fetch all brands for the filter dropdown (no pagination needed for the filter list)
    const { data: brandsData } = useListBrands({});

    // Fetch all categories for the filter dropdown
    const { data: categoriesData } = useListCategories({});

    const { data, isLoading, error } = useListProducts({
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

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "min" || name === "max") {
            setFilters((prev) => ({
                ...prev,
                priceRange: { ...prev.priceRange!, [name]: parseFloat(value) || 0 },
            }));
        } else {
            setFilters((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBrandSelect = (brandId: number) => {
        setFilters((prev) => {
            const brandIds = prev.brandIds || [];
            const newBrandIds = brandIds.includes(brandId)
                ? brandIds.filter((id) => id !== brandId)
                : [...brandIds, brandId];
            return { ...prev, brandIds: newBrandIds };
        });
    };

    const handleCategorySelect = (categoryId: number) => {
        setFilters((prev) => {
            const categoryIds = prev.categoryIds || [];
            const newCategoryIds = categoryIds.includes(categoryId)
                ? categoryIds.filter((id) => id !== categoryId)
                : [...categoryIds, categoryId];
            return { ...prev, categoryIds: newCategoryIds };
        });
    };

    const handleOrderByChange = (value: string) => {
        setOrderBy(() => (parseInt(value)));
    };

    const getSelectedBrands = () => {
        return (
            brandsData?.brands.filter((b) => filters.brandIds?.includes(b.id)) || []
        );
    };

    const getSelectedCategories = () => {
        return (
            categoriesData?.categories.filter((c) =>
                filters.categoryIds?.includes(c.id)
            ) || []
        );
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <button className="!border-2 !bg-white text-black" onClick={() => setIsCreateModalOpen(true)}>Create Product</button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Product Name..."
                                name="keyword"
                                value={filters.keyword || ""}
                                onChange={handleFilterChange}
                                className="pl-10"
                            />
                        </div>
                        <Popover open={openBrandPopover} onOpenChange={setOpenBrandPopover}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openBrandPopover}
                                    className="w-full justify-between"
                                >
                                    Select Brands...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search brand..." />
                                    <CommandEmpty>No brand found.</CommandEmpty>
                                    <CommandGroup>
                                        {brandsData?.brands.map((brand) => (
                                            <CommandItem
                                                key={brand.id}
                                                onSelect={() => handleBrandSelect(brand.id)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        filters.brandIds?.includes(brand.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {brand.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCategoryPopover}
                                    className="w-full justify-between"
                                >
                                    Select Categories...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search category..." />
                                    <CommandEmpty>No category found.</CommandEmpty>
                                    <CommandGroup>
                                        {categoriesData?.categories.map((category) => (
                                            <CommandItem
                                                key={category.id}
                                                onSelect={() => handleCategorySelect(category.id)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        filters.categoryIds?.includes(category.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {category.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Select
                            value={orderBy?.toString() || ""}
                            onValueChange={handleOrderByChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Best Seller</SelectItem>
                                <SelectItem value="1">Price: Low to High</SelectItem>
                                <SelectItem value="2">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative flex items-center">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                placeholder="Min Price"
                                name="min"
                                value={filters.priceRange?.min || ""}
                                onChange={handleFilterChange}
                                className="pl-10 rounded-r-none"
                            />
                            <span className="px-3 py-2 bg-muted border-y border-input">-</span>
                            <Input type="number" placeholder="Max Price" name="max" value={filters.priceRange?.max || ""} onChange={handleFilterChange} className="rounded-l-none" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {getSelectedBrands().map((brand: Brand) => (
                            <Badge
                                key={brand.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {brand.name}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => handleBrandSelect(brand.id)}
                                >
                                    &times;
                                </Button>
                            </Badge>
                        ))}
                        {getSelectedCategories().map((category: Category) => (
                            <Badge
                                key={category.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {category.name}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => handleCategorySelect(category.id)}
                                >
                                    &times;
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {error && <p className="text-red-500">Failed to load products.</p>}

            {!error && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>All Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <TableSkeleton columns={7} />
                            ) : data?.products && data.products.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Brand</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.products.map((product: Product) => (
                                            <TableRow key={product.id} className="hover:bg-muted/50">
                                                <TableCell>{product.id}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                                <TableCell>{product.stock}</TableCell>
                                                <TableCell>{product.category?.name}</TableCell>
                                                <TableCell>{product.brand?.name}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingProductId(product.id)}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="destructive" size="sm">
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-10 min-h-[200px]">
                                    <PackageOpen className="h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-lg text-muted-foreground">
                                        No products found.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
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
                </>
            )}

            <EditProductModal
                productId={editingProductId}
                onClose={() => setEditingProductId(null)}
            />

            <CreateProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};