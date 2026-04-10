import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../hooks/useCart';
import { useUpdateCartItem } from '../hooks/useUpdateCartItem';
import { useRemoveCartItem } from '../hooks/useRemoveCartItem';
import { getApiError } from '../lib/getApiError';
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
    <div className="flex flex-col lg:flex-row gap-6 items-start animate-pulse">
      <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="h-7 bg-gray-200 rounded w-1/3" />
        <div className="border-t border-gray-100 pt-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100">
              <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-80 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
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

  // Filter out items whose product was deleted (e.g. after a re-seed)
  const validItems = cart.items.filter((item) => item.productId != null);

  const subtotal = validItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const isMutating = updateItem.isPending || removeItem.isPending;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ── Left column: cart items ───────────────────────────────── */}
      <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-[#0D5F07] mb-4">
          Shopping Cart ({validItems.length}{' '}
          {validItems.length === 1 ? 'item' : 'items'})
        </h2>
        <div className="border-t border-gray-200" />

        {/* Items */}
        <div className="divide-y divide-gray-200">
          {validItems.map((item) => {
            const product = item.productId;
            const lineTotal = product.price * item.quantity;

            return (
              <div
                key={item._id}
                className="flex items-center gap-4 py-4"
              >
                {/* Always-checked decorative checkbox */}
                <div className="w-5 h-5 rounded-full bg-[#0D5F07] flex items-center justify-center flex-shrink-0">
                  <Check size={11} strokeWidth={3} className="text-white" />
                </div>

                {/* Thumbnail */}
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
                  <p className="text-sm text-gray-500 mt-0.5">{product.unit}</p>
                </div>

                {/* Stepper */}
                <QuantityStepper
                  value={item.quantity}
                  onChange={(newQty) =>
                    updateItem.mutate(
                      { productId: product._id, quantity: newQty },
                      {
                        onSuccess: () => toast.success('Cart updated'),
                        onError: (err) => toast.error(getApiError(err)),
                      }
                    )
                  }
                  min={1}
                  max={99}
                  disabled={isMutating}
                />

                {/* Price + Remove */}
                <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                  <p className="font-bold text-gray-900 text-base">
                    {formatNaira(lineTotal)}
                  </p>
                  <button
                    onClick={() =>
                      removeItem.mutate(product._id, {
                        onSuccess: () => toast.success('Item removed'),
                        onError: (err) => toast.error(getApiError(err)),
                      })
                    }
                    disabled={isMutating}
                    className="text-red-500 text-sm hover:underline disabled:opacity-40 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right column: order summary ───────────────────────────── */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
          <h3 className="text-xl font-bold text-[#0D5F07] mb-4">Order Summary</h3>
          <div className="border-t border-gray-200 mb-4" />

          <div className="space-y-3">
            <div className="flex justify-between text-base text-gray-700">
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base text-gray-700">
              <span>Delivery</span>
              <span>₦0.00</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4" />

          <div className="flex justify-between text-lg font-bold text-gray-900 mb-5">
            <span>Total</span>
            <span>{formatNaira(subtotal)}</span>
          </div>

          <button
            onClick={() => toast.info('Checkout coming soon')}
            className="w-full h-12 text-white text-base font-semibold rounded-lg transition-colors
              bg-gradient-to-b from-[#4A9D44] to-[#0D5F07] hover:from-[#3d8a37] hover:to-[#0a4a05]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A9D44]"
          >
            Proceed to Checkout
          </button>

          <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            Delivery fee calculated based on your location
            <br />
            Estimated delivery: 1–3 business days
          </p>
        </div>
      </div>
    </div>
  );
}
