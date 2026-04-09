import { Link } from 'react-router-dom';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useUpdateCartItem } from '../hooks/useUpdateCartItem';
import { useRemoveCartItem } from '../hooks/useRemoveCartItem';
import { QuantityStepper } from '../components/QuantityStepper';
import { ErrorState } from '../components/ErrorState';

const formatNaira = (amount: number) =>
  '₦' + new Intl.NumberFormat('en-NG').format(amount);

const placeholderFor = (name: string) => {
  const text = encodeURIComponent(name.slice(0, 18));
  return `https://placehold.co/80x80/16a34a/ffffff?text=${text}`;
};

function CartSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function Cart() {
  const { data: cart, isPending, isError, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isPending) return <CartSkeleton />;

  if (isError) {
    return (
      <ErrorState
        message="Failed to load your cart. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-1">Your cart is empty</h3>
        <p className="text-sm text-gray-400 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/dashboard/shop"
          className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="space-y-3">
        {cart.items.map((item) => {
          const product = item.productId;
          const lineTotal = product.price * item.quantity;

          return (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
            >
              {/* Image */}
              <img
                src={product.image ?? placeholderFor(product.name)}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-50"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = placeholderFor(product.name);
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">{product.unit}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">
                  {formatNaira(product.price)}
                </p>
              </div>

              {/* Stepper */}
              <QuantityStepper
                value={item.quantity}
                onChange={(newQty) =>
                  updateItem.mutate({ productId: product._id, quantity: newQty })
                }
                min={1}
                max={99}
                disabled={updateItem.isPending || removeItem.isPending}
              />

              {/* Line total */}
              <p className="w-28 text-right font-bold text-gray-900 text-base">
                {formatNaira(lineTotal)}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeItem.mutate(product._id)}
                disabled={removeItem.isPending || updateItem.isPending}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 flex-shrink-0"
                aria-label="Remove item"
              >
                <X size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-base text-gray-700">
          <span>Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
