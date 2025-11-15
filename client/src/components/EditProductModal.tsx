import { useEffect, useState, useRef } from "react";
import { Product } from "@/api/types";
import { useGetProductDetail, useUpdateProduct } from "@/queries/useAdminProducts";
import { useListBrands } from "@/queries/useAdminBrands";
import { useListCategories } from "@/queries/useAdminCategories";
import { ModalOverlay } from "./ui/ModalOverlay";
import { useUploadFile } from "@/queries/useUploadFile";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Loader2, Upload } from "lucide-react";

interface EditProductModalProps {
    productId: number | null;
    onClose: () => void;
}

export const EditProductModal = ({
    productId,
    onClose,
}: EditProductModalProps) => {
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
    const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadMutation = useUploadFile();

    const { data: productData, isLoading: isLoadingProduct } = useGetProductDetail(
        { productId: productId! },
        { enabled: !!productId }
    );
    const { data: brandsData } = useListBrands({});
    const { data: categoriesData } = useListCategories({});
    const updateProductMutation = useUpdateProduct();

    useEffect(() => {
        if (productData?.product) {
            setFormData(productData.product);
            setSelectedCategoryId(productData.product.category?.id);
            setSelectedBrandId(productData.product.brand?.id);
        }
    }, [productData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: "brandId" | "categoryId", value: string) => {
        if (name === "brandId") {
            setSelectedBrandId(parseInt(value));
        } else {
            setSelectedCategoryId(parseInt(value));
        }
    };

    const handleImagePlaceholderClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadMutation.mutate(
                { file_data: file },
                {
                    onSuccess: (data) => {
                        setFormData((prev) => ({ ...prev, imageUrl: data.file_url }));
                    },
                }
            );
        }
    };

    const handleSubmit = () => {
        if (!productId) return;
        updateProductMutation.mutate(
            {
                productId,
                ...formData,
                stock: Number(formData.stock),
                price: Number(formData.price),
                categoryId: selectedCategoryId,
                brandId: selectedBrandId,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    const renderForm = () => {
        if (isLoadingProduct) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            );
        }

        return (
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price</Label>
                    <Input id="price" name="price" type="number" value={formData.price || ""} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">Stock</Label>
                    <Input id="stock" name="stock" type="number" value={formData.stock || ""} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Image</Label>
                    <div className="col-span-3">
                        <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <div
                            className="border-2 border-dashed border-muted-foreground/50 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={handleImagePlaceholderClick}
                        >
                            {uploadMutation.isPending ? (
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            ) : formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Product preview" className="h-full w-full object-cover rounded-lg" />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="mx-auto h-8 w-8" />
                                    <p>Click to upload an image</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryId" className="text-right">Category</Label>
                    <Select
                        value={selectedCategoryId?.toString()}
                        onValueChange={(value) => handleSelectChange("categoryId", value)}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categoriesData?.categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="brandId" className="text-right">Brand</Label>
                    <Select
                        value={selectedBrandId?.toString()}
                        onValueChange={(value) => handleSelectChange("brandId", value)}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                            {brandsData?.brands.map((b) => (
                                <SelectItem key={b.id} value={b.id.toString()}>
                                    {b.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="buyTurn" className="text-right">Buy Turn</Label>
                    <Input id="buyTurn" name="buyTurn" type="number" value={formData.buyTurn || 0} disabled className="col-span-3" />
                </div>
            </div>
        );
    };

    return (
        <ModalOverlay
            isOpen={productId !== null}
            onClose={onClose}
            title="Edit Product"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={updateProductMutation.isPending}>
                        {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </>
            }
        >
            {renderForm()}
        </ModalOverlay>
    );
};