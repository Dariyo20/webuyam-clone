import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ShoppingCart } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useAddToCart } from '../hooks/useAddToCart';
import { QuantityStepper } from '../components/QuantityStepper';
import { ErrorState } from '../components/ErrorState';

const formatNaira = (amount: number) =>
  '₦' + new Intl.NumberFormat('en-NG').format(amount);

const placeholderFor = (name: string) => {
  const text = encodeURIComponent(name.slice(0, 20));
  return `https://placehold.co/600x600/16a34a/ffffff?text=${text}`;
};

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      <div className="bg-gray-100 rounded-lg aspect-square w-full" />
      <div className="flex flex-col gap-4 pt-2">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded w-full mt-4" />
        <div className="h-12 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isPending, isError, error, refetch } = useProduct(slug ?? '');
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  if (isPending) return <ProductDetailSkeleton />;

  if (isError) {
    // Check for 404
    const is404 =
      error instanceof Error && error.message === 'Product not found';

    if (is404) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-xl font-semibold text-gray-700 mb-2">Product not found</p>
          <p className="text-sm text-gray-400 mb-6">
            This product doesn't exist or may have been removed.
          </p>
          <Link
            to="/dashboard/shop"
            className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      );
    }

    return (
      <ErrorState
        message="Failed to load product. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const currentImg = imgSrc ?? product.image;

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product._id, quantity },
      {
        onSuccess: () => {
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Image */}
      <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center aspect-square">
        <img
          src={currentImg}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={() => setImgSrc(placeholderFor(product.name))}
        />
      </div>

      {/* Right: Details */}
      <div className="flex flex-col gap-4 pt-2">
        <h1 className="text-3xl font-bold text-gray-900 leading-snug">
          {product.name}
        </h1>

        <p className="text-2xl font-bold text-gray-900">
          {formatNaira(product.price)}
        </p>

        <p className="text-gray-600 text-sm">{product.unit}</p>

        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2">
          <span className="text-base font-medium text-gray-700">Quantity:</span>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={Math.min(product.stock, 99)}
            disabled={addToCart.isPending}
          />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={addToCart.isPending || product.stock === 0}
          className="mt-4 w-full h-12 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700
            text-white text-lg font-semibold rounded-lg transition-colors disabled:opacity-70"
        >
          {added ? (
            <>
              <Check size={20} />
              Added!
            </>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart size={20} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
