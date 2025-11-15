import { useState, useRef } from "react";
import { CreateProductRequest } from "@/api/types";
import { useCreateProduct } from "@/queries/useAdminProducts";
import { useListBrands } from "@/queries/useAdminBrands";
import { useListCategories } from "@/queries/useAdminCategories";
import { useUploadFile } from "@/queries/useUploadFile";
import { ModalOverlay } from "./ui/ModalOverlay";
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
import { Upload, Loader2 } from "lucide-react";

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateProductModal = ({
    isOpen,
    onClose,
}: CreateProductModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadMutation = useUploadFile();
    const [formData, setFormData] = useState<Partial<CreateProductRequest>>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        brandId: undefined,
        categoryId: undefined,
    });

    const { data: brandsData } = useListBrands({});
    const { data: categoriesData } = useListCategories({});
    const createProductMutation = useCreateProduct();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: "brandId" | "categoryId", value: string) => {
        setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    };

    const handleImagePlaceholderClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadMutation.mutate({ file_data: file }, {
                onSuccess: (data) => {
                    setFormData(prev => ({ ...prev, imageUrl: data.file_url }));
                }
            });
        }
    };
    const handleSubmit = () => {
        createProductMutation.mutate(
            formData,
            {
                onSuccess: () => {
                    onClose();
                    setFormData({ name: "", description: "", price: 0, stock: 0, imageUrl: "" }); // Reset form
                },
            }
        );
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Product"
            description="Fill in the details below to add a new product to the catalog."
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={createProductMutation.isPending}>
                        {createProductMutation.isPending ? "Creating..." : "Create Product"}
                    </Button>
                </>
            }
        >
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
                        value={formData.categoryId?.toString()}
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
                        value={formData.brandId?.toString()}
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
            </div>
        </ModalOverlay>
    );
};