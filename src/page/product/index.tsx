import { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { BiCartAdd } from "react-icons/bi";
import Shoe from "../../assets/image/shop/shop4.jpeg";
import { productData, renderMessage } from "./data";

const Product = () => {
  const [activeTab, setActiveTab] = useState("review");

  const renderStars = () => {
    const fullStars = Math.floor(productData.rating);
    const hasHalfStar = productData.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1 text-yellow-500">
        {Array(fullStars)
          .fill(null)
          .map((_, i) => (
            <FaStar key={`full-${i}`} />
          ))}
        {hasHalfStar && <FaStarHalfAlt />}
        {Array(emptyStars)
          .fill(null)
          .map((_, i) => (
            <FaRegStar key={`empty-${i}`} />
          ))}
        <span className="text-sm text-gray-600 ml-2">
          ({productData.rating})
        </span>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="space-y-4">
        {productData.reviews?.map((review, idx) => (
          <div key={idx} className="border p-4 rounded bg-slate-50">
            <p className="font-semibold text-gray-800">{review.username}</p>
            <div className="flex items-center text-yellow-500">
              {Array(Math.floor(review.rating))
                .fill(null)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
              {review.rating % 1 >= 0.5 && <FaStarHalfAlt />}
            </div>
            <p className="text-gray-600 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full px-4 md:px-10 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Product Image */}
        <div className="flex-1">
          <div className="p-4 md:p-10 bg-white shadow-sm">
            <img
              src={productData.img}
              alt="product"
              className="w-full object-cover rounded"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-100 p-4 mt-4 rounded">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                className="w-full h-24 object-cover rounded"
                src={Shoe}
                alt="thumb"
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 pt-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {productData.title}
          </h1>
          {renderStars()}
          <div className="mt-5 flex items-end gap-2">
            <h2 className="text-red-500 font-bold text-2xl">
              {productData.priceEth}
            </h2>
            <span className="text-gray-700 font-medium">ETH</span>
          </div>
          <div className="mt-4 text-gray-700 max-w-xl">
            {productData.description}
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input
              className="p-3 border rounded w-20 text-center"
              type="number"
              defaultValue={1}
              min={1}
              name="itemNumber"
              id="itemNumber"
            />
            <button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 py-3 px-5 rounded">
              <BiCartAdd size={20} /> Add to Cart
            </button>
          </div>

          {/* Tabs: Review / Disclaimer */}
          <div className="mt-20 max-w-3xl">
            <div className="flex gap-4 border-b mb-4">
              <button
                onClick={() => setActiveTab("review")}
                className={`pb-2 font-medium ${
                  activeTab === "review"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
              >
                Review
              </button>
              <button
                onClick={() => setActiveTab("disclaimer")}
                className={`pb-2 font-medium ${
                  activeTab === "disclaimer"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
              >
                Disclaimer
              </button>
            </div>

            <div>
              {activeTab === "review" ? (
                renderReviews()
              ) : (
                <p className="text-gray-600 whitespace-pre-line">
                  {renderMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
