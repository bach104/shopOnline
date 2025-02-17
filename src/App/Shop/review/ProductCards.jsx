import { Link } from "react-router-dom";
import RatingStar from "../../../components/RatingStars";
import AddToCart from "../cart/AddToCart";
import { useState } from "react";

const ProductCards = ({ products, gridCols }) => {
  const [setCartCount] = useState(0); 

  return (
    <div
      className={
        gridCols ||
        "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 pt-5"
      }
    >
      {products?.map((product) => (
        <div
          key={product.id}
          className="border transition product__hv relative rounded-lg shadow-md overflow-hidden"
        >
          <Link to={`/products/${product.id}`} state={{ product }} className="block h-full">
            {product.images?.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-64 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-md">
                No Image
              </div>
            )}
            <div className="w-full p-3 absolute bottom-0 left-0 right-0 bg-black/50">
              <h3 className="text-white truncate font-semibold">{product.name}</h3>
              <p className="text-white">
                {product.price
                  ? `${product.price.toLocaleString("vi-VN")}đ`
                  : "Liên hệ"}{" "}
                {product?.oldPrice && (
                  <s className="text-gray-300 ml-2">
                    {product.oldPrice.toLocaleString("vi-VN")}đ
                  </s>
                )}
              </p>
              <RatingStar rating={product.starRatings?.averageRating || 0} />
            </div>
          </Link>
          <AddToCart
            productId={product.id} 
            name={product.name} 
            price={product.price} 
            image={product.images[0]}
            size={product.size}
            color={product.color}
            setCartCount={setCartCount}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
