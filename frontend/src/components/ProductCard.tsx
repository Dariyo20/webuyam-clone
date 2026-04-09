import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const formatNaira = (amount: number) =>
  '₦' + new Intl.NumberFormat('en-NG').format(amount);

const placeholderFor = (name: string) => {
  const text = encodeURIComponent(name.slice(0, 20));
  return `https://placehold.co/400x400/16a34a/ffffff?text=${text}`;
};

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleNavigate = () => {
    navigate(`/dashboard/products/${product.slug}`);
  };

  const handleAddToCart = (e: MouseEvent) => {
    e.stopPropagation();
    console.log('Add to cart:', product._id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div
        className="aspect-square w-full overflow-hidden cursor-pointer bg-gray-50"
        onClick={handleNavigate}
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImgSrc(placeholderFor(product.name))}
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p
          className="font-semibold text-sm text-gray-800 truncate cursor-pointer hover:text-green-700"
          onClick={handleNavigate}
          title={product.name}
        >
          {product.name}
        </p>
        <p className="font-bold text-sm text-gray-900">{formatNaira(product.price)}</p>

        <button
          onClick={handleAddToCart}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
