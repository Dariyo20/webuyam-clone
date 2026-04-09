import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductGridSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Pagination } from '../components/Pagination';

export function Shop() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch } = useProducts(page);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductGridSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load products. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  if (data.data.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={64} />}
        title="No products found"
        description="There are no products available right now. Check back later."
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {data.meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
