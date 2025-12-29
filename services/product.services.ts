// product.services.ts
import { IBaseProduct } from '@/types/product.types';
import api from '@/utils/api';

export interface ProductImage {
	_id?: string;
	url: string;
	alt: string;
	isPrimary?: boolean;
}

export interface ProductFilters {
	search?: string;
	category?: string;
	type?: string;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	limit?: number;
	sort?: string;
	featured?: boolean;
	inStock?: boolean;
}

export interface ProductFacets {
	totalCount: number;
	priceRange: { min: number; max: number };
	categories: { _id: string; name: string; count: number }[];
}

// Product APIs

// List all products with filters
export const listProducts = async (
	params?: ProductFilters
): Promise<{ products: IBaseProduct[]; totalCount: number }> => {
	const res = await api.get('/products', { params });
	// console.log(res.data);

	return {
		products: res.data.data || [], // backend data array
		totalCount: res.data.meta?.total || 0, // backend meta.total
	};
};

// Get facets (counts, categories, price ranges)
export const getProductFacets = async (): Promise<ProductFacets> => {
	const { data } = await api.get('/products/facets');
	return data;
};

// Get a single product by ID or slug
export const getProduct = async (idOrSlug: string): Promise<IBaseProduct> => {
	const { data } = await api.get(`/products/${idOrSlug}`);
	return data;
};
