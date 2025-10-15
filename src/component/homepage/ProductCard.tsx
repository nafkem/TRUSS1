import { BiCartAdd } from "react-icons/bi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface IProduct {
  name: string;
  description: string;
  rating: number;
  priceEth: number;
  image: string;
}

const ProductCard = ({ product }: { product: IProduct }) => {
  const renderStars = () => {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1 text-yellow-500">
        {Array(fullStars).fill(<FaStar />)}
        {hasHalfStar && <FaStarHalfAlt />}
        {Array(emptyStars).fill(<FaRegStar />)}
        <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 p-4 w-full">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-72 object-cover rounded-lg mb-4"
      />
      <Link
        to={`/product/${product.name}`}
        className="text-lg font-semibold text-gray-800"
      >
        {product.name}
      </Link>
      <p className="text-sm text-gray-600 mt-1 mb-3 line-clamp-2">
        {product.description}
      </p>
      {renderStars()}
      <div className="mt-4 font-bold text-primary flex items-center justify-between">
        {product.priceEth} $USD
        <button className="bg-orange-400 text-white flex items-center gap-2 py-2 px-4 rounded-md">
          <BiCartAdd className="w-5 h-5" />
          <p>Add to cart</p>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
