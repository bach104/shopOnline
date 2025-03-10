import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../redux/features/shop/productsApi";
import { toast } from "react-toastify";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAddToCartMutation } from "../../../redux/features/cart/cartApi";
import { selectAllCartItems } from "../../../redux/features/cart/cartSlice";

const ReviewProducts = () => {
  const { id } = useParams();
  const [addToCart] = useAddToCartMutation();
  const cartItems = useSelector(selectAllCartItems);

  const [cachedProduct, setCachedProduct] = useState(null);
  const { data } = useGetProductByIdQuery(id, { skip: !!cachedProduct });

  useEffect(() => {
    if (data?.product) {
      setCachedProduct(data.product);
    }
  }, [data]);

  const product = cachedProduct || data?.product;
  const scrollRef = useRef(null);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    if (product) {
      setSelectedSize(product.size?.[0] || null);
      setSelectedColor(product.color?.[0] || null);
    }
  }, [product]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 150, behavior: "smooth" });
    }
  };

  const addToCartHandler = async () => {
    if (!selectedSize || !selectedColor) {
      toast.warning("Vui lòng chọn size và màu sắc trước khi thêm vào giỏ hàng!");
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.productId === product._id && item.size === selectedSize && item.color === selectedColor
    );
    if (existingItem) {
      toast.info("Sản phẩm với size và màu sắc này đã có trong giỏ hàng!");
    } else {
      try {
        const cartData = {
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        };
        await addToCart(cartData).unwrap();
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        toast.error("Bạn cần đăng nhập lại");
      }
    }
  };

  return (
    <div className="p-4 grid grid-cols-4 gap-6">
      <div className="flex col-span-2 flex-col">
        <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-xl font-mono">
          {product?.images?.length ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div>Không có hình ảnh</div>
          )}
        </div>

        <div className="relative w-full mt-2">
          {product?.images?.length > 4 && (
            <>
              <button
                onClick={() => handleScroll(-1)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-md z-10"
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
              <button
                onClick={() => handleScroll(1)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-md z-10"
              >
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </>
          )}
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto max-w-full whitespace-nowrap scroll-smooth no-scrollbar">
            {product?.images?.map((img, index) => (
              <div key={index} className="h-28 w-36 flex-shrink-0">
                <img src={img} alt={`Ảnh ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <h2 className="text-3xl font-bold">{product?.name}</h2>
        <p className="mt-2 text-lg font-bold">
          {product?.price?.toLocaleString("vi-VN")}đ{" "}
          <span className="text-gray-600 line-through text-sm">
            {product?.oldPrice?.toLocaleString("vi-VN")}đ
          </span>
        </p>

        <div className="p-4">
          <h4 className="font-bold">Mô tả sản phẩm</h4>
          <div className="min-h-[140px] mx-2 mt-2 rounded">
            <p>{product?.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-4">
          <p className="text-sm font-semibold">Size:</p>
          <div className="flex gap-2 mt-1">
            {product?.size?.map((size) => (
              <button
                key={size}
                className={`border border-black px-2 py-0.5 rounded ${selectedSize === size ? "bg-black text-white" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-end gap-4">
          <p className="text-sm font-semibold">Màu sắc:</p>
          <div className="flex gap-2 mt-1">
            {product?.color?.map((color) => (
              <button
                key={color}
                className={`border border-black px-2 py-0.5 rounded ${selectedColor === color ? "bg-black text-white" : ""}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <p className="text-sm font-semibold mr-2">Số lượng:</p>
          <div>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-black opacity-80 text-white w-6 rounded">-</button>
            <span className="mx-2">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="bg-black opacity-80 text-white w-6 rounded">+</button>
          </div>
        </div>
        <button className="mt-4 bg-black text-white px-6 py-2 rounded" onClick={addToCartHandler}>
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ReviewProducts;
