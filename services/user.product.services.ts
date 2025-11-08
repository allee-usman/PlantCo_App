import { IBaseProduct } from '@/types/product.types';
import api from '@/utils/api'; // your existing axios instance

/**
 * -------------------------------
 * Wishlist APIs
 * -------------------------------
 */

/** ✅ Fetch wishlist products */
export const getWishlistProducts = async (): Promise<IBaseProduct[]> => {
	const { data } = await api.get<{
		success: boolean;
		products: IBaseProduct[];
	}>('/user/wishlist');
	return data.products;
};

/** ✅ Add product to wishlist */
export const addToWishlist = async (
	productId: string
): Promise<IBaseProduct[]> => {
	const { data } = await api.post<{ success: boolean; wishlist: string[] }>(
		`/user/wishlist/${productId}`
	);
	return data.wishlist as unknown as IBaseProduct[];
};

/** ✅ Remove product from wishlist */
export const removeFromWishlist = async (
	productId: string
): Promise<IBaseProduct[]> => {
	const { data } = await api.delete<{ success: boolean; wishlist: string[] }>(
		`/user/wishlist/${productId}`
	);
	return data.wishlist as unknown as IBaseProduct[];
};

/** 🌀 Toggle wishlist (optional utility) */
export const toggleWishlist = async (
	productId: string,
	isWishlisted: boolean
) => {
	if (isWishlisted) {
		return removeFromWishlist(productId);
	} else {
		return addToWishlist(productId);
	}
};

/**
 * -------------------------------
 * Recently Viewed APIs
 * -------------------------------
 */

/** ✅ Fetch recently viewed products */
export const getRecentlyViewedProducts = async (): Promise<IBaseProduct[]> => {
	const { data } = await api.get<{
		success: boolean;
		products: IBaseProduct[];
	}>('/user/recently-viewed');
	return data.products;
};

/** ✅ Add a product to recently viewed */
export const addRecentlyViewedProduct = async (productId: string) => {
	await api.post(`/user/recently-viewed/${productId}`);
};

/** ✅ Clear recently viewed list */
export const clearRecentlyViewedProducts = async () => {
	await api.delete('/user/recently-viewed');
};
