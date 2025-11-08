import { getRecentlyViewedProducts } from '@/services/user.product.services';
import { IBaseProduct } from '@/types/product.types';
import { useEffect, useState } from 'react';

export const useRecentlyViewedProducts = () => {
	const [products, setProducts] = useState<IBaseProduct[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const data = await getRecentlyViewedProducts();
				setProducts(data);
			} catch (error) {
				console.error('Error fetching recently viewed products:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	return { products, loading };
};
