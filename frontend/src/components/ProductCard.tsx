import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Product } from '../types';
import { useAddToCart } from '../hooks/useAddToCart';
import { getApiError } from '../lib/getApiError';

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
  const addToCart = useAddToCart();

  const handleNavigate = () => {
    navigate(`/dashboard/products/${product.slug}`);
  };

  const handleAddToCart = (e: MouseEvent) => {
    e.stopPropagation();
    addToCart.mutate(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => toast.success('Item added to cart!'),
        onError: (err) => toast.error(getApiError(err)),
      }
    );
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
          className="font-semibold text-lg text-gray-800 truncate cursor-pointer hover:text-green-700"
          onClick={handleNavigate}
          title={product.name}
        >
          {product.name}
        </p>
        <p className="text-lg font-bold text-gray-900">{formatNaira(product.price)}</p>

        <button
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
          className="mt-auto w-full flex items-center justify-center gap-2 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-60
            bg-gradient-to-b from-[#4A9D44] to-[#0D5F07] hover:from-[#3d8a37] hover:to-[#0a4a05]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A9D44]"
        >
          {addToCart.isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
