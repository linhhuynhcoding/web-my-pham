/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated ProductDetailPage with left (A+B) and right panel (C mock)
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CardSolid } from "../components/CardSolid";
import { Button } from "../components/ui/button";
import { Minus, Plus, Star } from "lucide-react";
import { useProductDetail } from "@/queries/product";

import { useCart } from "../context/CartContext";
import { Card, CardContent } from "@/components/ui/card";

export const ProductDetailPage = () => {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");

    const { data, isLoading, error } = useProductDetail(parseInt(productId || "0"));
    const { addToCart } = useCart();

    const handleQuantityChange = (amount: any) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-8">Error: {error.message}</div>;
    if (!data?.product) return <div className="text-center p-8">Sản phẩm không tồn tại.</div>;

    const { product, otherSameBrandProducts } = data;

    const mainImage = selectedImage || product.imageUrl;

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="max-w-[60%] mx-auto p-4 flex gap-6">
            {/* LEFT MAIN PANEL */}
            <div className="w-[70%] flex flex-col gap-4">
                <CardSolid className="p-6 ">
                    <div className="flex gap-8 min-h-[500px]">
                        {/* A. Image Gallery */}
                        <div className="w-2/5 flex flex-col justify-between">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-auto object-cover rounded-lg border"
                            />
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${selectedImage === img ? "border-red-500" : "border-transparent"
                                            }`}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* B. Product Info */}
                        <div className="w-3/5 flex flex-col">
                            <h1 className="text-3xl font-bold">{product.name}</h1>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-500 font-bold">5</span>
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                </div>
                                <span>|</span>
                                <span>Đã bán {product.buyTurn}</span>
                                <span>|</span>
                                <Link
                                    to={`/brands/${product.brand.id}`}
                                    className="hover:text-red-500"
                                >
                                    Thương hiệu: {product.brand.name}
                                </Link>
                            </div>

                            <p className="text-3xl font-bold text-red-700 my-4">
                                {product.price.toLocaleString("vi-VN")}đ
                            </p>

                            <span className="text-sm text-gray-500 mb-4">
                                Tình trạng: {" "}
                                <span className="font-semibold text-green-600">
                                    {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
                                </span>
                            </span>

                            <p className="text-gray-600 text-sm mb-6">{product.description}</p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="flex items-center border rounded-md">
                                    <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center">{quantity}</span>
                                    <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-base flex-grow"
                                    disabled={product.stock === 0}
                                    onClick={handleAddToCart}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardSolid>

                {/* C. Mock: Ingredients */}
                <Card className="p-4 rounded-2xl shadow text-sm">
                    <CardContent>
                        <h2 className="text font-semibold mb-2">Thành phần sản phẩm</h2>
                        <p>Bông tự nhiên – 100% cotton </p>
                    </CardContent>
                </Card>


                {/* C. Mock: Usage Instructions */}
                <Card className="p-4 rounded-2xl shadow text-sm">
                    <CardContent>
                        <h2 className="text font-semibold mb-2">Hướng dẫn sử dụng</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Làm ướt bông bằng sản phẩm tẩy trang hoặc nước hoa hồng </li>
                            <li>Nhẹ nhàng lau đều lên mặt để làm sạch </li>
                        </ul>
                    </CardContent>
                </Card>


                {/* C. Mock: Reviews Section */}
                <Card className="p-4 rounded-2xl shadow text-sm">
                    <CardContent className="space-y-4">
                        <div>
                            <h2 className="text font-semibold">Đánh giá </h2>
                            <p className="text-orange-500 text-3xl font-bold">4.8 ⭐</p>
                            <p className="text-sm text-gray-600">47 đánh giá</p>
                        </div>


                        <div className="flex space-x-2 overflow-x-auto">
                            {['Tất cả (47)', '5★ (36)', '4★ (11)', '2★ (0)', '1★ (0)', 'Có hình ảnh'].map((item) => (
                                <button key={item} className="px-3 py-1 rounded-full border text-sm whitespace-nowrap">{item}</button>
                            ))}
                        </div>


                        {/* Mock Review Item */}
                        <div className="border rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-500 font-semibold">5★</span>
                                <span className="font-medium">Rất hài lòng</span>
                                <span className="text-gray-500 text-sm">2025-10-10</span>
                            </div>
                            <p className="text-gray-700">“Sản phẩm dùng tốt, chất lượng ổn. ”</p>
                            <div className="px-2 py-1 bg-green-100 text-green-700 rounded w-fit text-xs">Hasaki</div>
                            <p className="text-gray-600 text-sm">Hasaki xin chào! Cảm ơn bạn đã đánh giá sản phẩm!</p>
                        </div>
                        <div className="border rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-500 font-semibold">5★</span>
                                <span className="font-medium">Rất hài lòng</span>
                                <span className="text-gray-500 text-sm">2025-10-10</span>
                            </div>
                            <p className="text-gray-700">“Sản phẩm dùng tốt, chất lượng ổn. ”</p>
                            <div className="px-2 py-1 bg-green-100 text-green-700 rounded w-fit text-xs">Hasaki</div>
                            <p className="text-gray-600 text-sm">Hasaki xin chào! Cảm ơn bạn đã đánh giá sản phẩm!</p>
                        </div>
                        <div className="border rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-500 font-semibold">5★</span>
                                <span className="font-medium">Rất hài lòng</span>
                                <span className="text-gray-500 text-sm">2025-10-10</span>
                            </div>
                            <p className="text-gray-700">“Sản phẩm dùng tốt, chất lượng ổn. ”</p>
                            <div className="px-2 py-1 bg-green-100 text-green-700 rounded w-fit text-xs">Hasaki</div>
                            <p className="text-gray-600 text-sm">Hasaki xin chào! Cảm ơn bạn đã đánh giá sản phẩm!</p>
                        </div>
                        <div className="border rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-500 font-semibold">5★</span>
                                <span className="font-medium">Rất hài lòng</span>
                                <span className="text-gray-500 text-sm">2025-10-10</span>
                            </div>
                            <p className="text-gray-700">“Sản phẩm dùng tốt, chất lượng ổn. ”</p>
                            <div className="px-2 py-1 bg-green-100 text-green-700 rounded w-fit text-xs">Hasaki</div>
                            <p className="text-gray-600 text-sm">Hasaki xin chào! Cảm ơn bạn đã đánh giá sản phẩm!</p>
                        </div>
                        <div className="border rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-500 font-semibold">5★</span>
                                <span className="font-medium">Rất hài lòng</span>
                                <span className="text-gray-500 text-sm">2025-10-10</span>
                            </div>
                            <p className="text-gray-700">“Sản phẩm dùng tốt, chất lượng ổn. ”</p>
                            <div className="px-2 py-1 bg-green-100 text-green-700 rounded w-fit text-xs">Hasaki</div>
                            <p className="text-gray-600 text-sm">Hasaki xin chào! Cảm ơn bạn đã đánh giá sản phẩm!</p>
                        </div>
                        <div className="border rounded-xl p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-500 font-semibold">5★</span>
                                <span className="font-medium">Rất hài lòng</span>
                                <span className="text-gray-500 text-sm">2025-10-10</span>
                            </div>
                            <p className="text-gray-700">“Sản phẩm dùng tốt, chất lượng ổn. ”</p>
                            <div className="px-2 py-1 bg-green-100 text-green-700 rounded w-fit text-xs">Hasaki</div>
                            <p className="text-gray-600 text-sm">Hasaki xin chào! Cảm ơn bạn đã đánh giá sản phẩm!</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Products same brand */}
                {/* {otherSameBrandProducts?.length > 0 && (
                    <CardSolid className="p-6 mt-4">
                        <h2 className="text-2xl font-bold mb-4">Sản phẩm cùng thương hiệu</h2>
                        <div className="grid grid-cols-5 gap-4">
                            {otherSameBrandProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </CardSolid>
                )} */}
            </div>

            {/* RIGHT PANEL — C MOCK */}
            <div className="w-[30%] flex flex-col gap-4">
                {/* Mock shipping / policy panel */}
                <div className="shadow-[0px_4px_16px_0px_#14191A14] rounded-[20px] bg-white p-2.5 ">
                    <div className="w-full flex items-center justify-center gap-2.5 mb-1.5 pt-2.5"><div className="bg-[#326E51] w-4 h-0.5"></div><div className="text-sm leading-[17px] text-center text-[#326E51] font-bold uppercase shrink-0 max-w-full">Miễn phí vận chuyển</div><div className="bg-[#326E51] w-4 h-0.5"></div></div><div className="min-h-[64px] mt-[-6px] relative text-sm leading-[16px] flex items-center gap-2.5 ml-0"><img className="" src="https://media.hcdn.vn/hsk/icons/delivery-120-minutes-100x100.png" width="80" height="80" alt="hàng chính hãng" /><div className="[&amp;_a:hover]:text-[#326E51] [&amp;_a]:flex [&amp;_a]:items-center [&amp;_a]:gap-2.5"><p>Giao Nhanh Miễn Phí 2H. <strong>Trễ tặng 100K</strong></p></div></div><div className="min-h-[64px] mt-[-6px] relative text-sm leading-[16px] flex items-center gap-2.5 ml-0"><img className="" src="https://media.hcdn.vn/hsk/icons/img_quality_3_100x100.png" width="80" height="80" alt="hàng chính hãng" /><div className="[&amp;_a:hover]:text-[#326E51] [&amp;_a]:flex [&amp;_a]:items-center [&amp;_a]:gap-2.5"><p>Hasaki đền bù <strong>100%</strong> hãng đền bù <strong>100%</strong> nếu phát hiện hàng giả</p></div></div><div className="min-h-[64px] mt-[-6px] relative text-sm leading-[16px] flex items-center gap-2.5 ml-0"><img className="" src="https://media.hcdn.vn/hsk/icons/img_quality_2_100x100.png" width="80" height="80" alt="hàng chính hãng" /><div className="[&amp;_a:hover]:text-[#326E51] [&amp;_a]:flex [&amp;_a]:items-center [&amp;_a]:gap-2.5"><p><strong>Giao Hàng Miễn Phí</strong> (từ 90K tại 60 Tỉnh Thành trừ huyện, toàn Quốc từ 249K)</p></div></div><div className="min-h-[64px] mt-[-6px] relative text-sm leading-[16px] flex items-center gap-2.5 ml-0"><img className="" src="https://media.hcdn.vn/hsk/icons/img_quality_44_100x100.png" width="80" height="80" alt="hàng chính hãng" /><div className="[&amp;_a:hover]:text-[#326E51] [&amp;_a]:flex [&amp;_a]:items-center [&amp;_a]:gap-2.5"><p>Đổi trả trong <strong>30 ngày</strong></p></div></div><a className="block w-full mt-1.5 p-2.5 pb-0 text-sm font-medium text-[#777777] text-center border-t-[1px] border-t-[#DDDDDD]" href="https://hotro.hasaki.vn/">Xem thêm</a>
                </div>


                {/* Brand box */}
                <CardSolid className="p-4 flex items-center justify-center gap-4">
                    <img
                        src={product.brand.imageUrl || "/placeholder-brand.png"}
                        alt={product.brand.name}
                        className="h-24 object-contain"
                    />
                    {/* <div className="flex flex-col">
                        <span className="font-bold text-lg">{product.brand.name}</span>
                        <Button className="mt-2 bg-gray-100 text-black hover:bg-gray-200 text-sm">
                            Theo dõi
                        </Button>
                    </div> */}
                </CardSolid>

                {/* Mock recommended products */}
                <CardSolid className="p-4">
                    <p className="font-semibold mb-3">Sản phẩm cùng thương hiệu</p>

                    <div className="space-y-3">
                        {
                            otherSameBrandProducts?.length > 0 && (
                                otherSameBrandProducts.map((p) => (
                                    <>
                                        <div className="flex gap-3 items-center">
                                            <img className="h-14 w-14 rounded" src={p.imageUrl} alt={p.name} />
                                            <div className="flex flex-col text-sm text-gray-600">
                                                <span>{p.name}</span>
                                                <span className="text-red-500 font-semibold">{p.price.toLocaleString("vi-VN")}</span>
                                            </div>
                                        </div>
                                    </>
                                ))
                            )
                        }
                    </div>
                </CardSolid>
            </div>
        </div>
    );
};
