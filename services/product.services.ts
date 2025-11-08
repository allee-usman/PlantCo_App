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
}

export interface ProductFacets {
	totalCount: number;
	priceRange: { min: number; max: number };
	categories: { _id: string; name: string; count: number }[];
}

// --- Helpers for React Native FormData typing ---

// React-Native file descriptor accepted at runtime.
// We cast to `any` when appending to satisfy TypeScript DOM typings.
type RNFile = {
	uri: string;
	name: string;
	type?: string;
};

const appendFileToForm = (form: FormData, fieldName: string, file: RNFile) => {
	// cast to any to satisfy TypeScript; runtime (RN/Expo) expects this shape
	form.append(fieldName, file as any);
};

// Append a scalar/complex value to the form safely
const appendValueToForm = (form: FormData, key: string, value: any) => {
	if (value === null || typeof value === 'undefined') return;
	if (typeof value === 'string') {
		form.append(key, value);
	} else if (typeof value === 'number' || typeof value === 'boolean') {
		form.append(key, String(value));
	} else {
		// For objects/arrays, stringify so backend can parse if needed
		form.append(key, JSON.stringify(value));
	}
};

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

// Create new product (Admin or Vendor)
export const createProduct = async (
	productData: Omit<IBaseProduct, '_id' | 'slug' | 'createdAt' | 'updatedAt'>,
	imageUris: string[]
): Promise<IBaseProduct> => {
	const form = new FormData();

	Object.entries(productData).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach((v) => appendValueToForm(form, `${key}[]`, v));
		} else {
			appendValueToForm(form, key, value);
		}
	});

	imageUris.forEach((uri, index) => {
		const filename = uri.split('/').pop() || `image_${index}.jpg`;
		const match = /\.(\w+)$/.exec(filename);
		const type = match ? `image/${match[1]}` : 'image/jpeg';
		const file: RNFile = { uri, name: filename, type };
		appendFileToForm(form, 'images', file);
	});

	const { data } = await api.post<IBaseProduct>('/products', form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});

	return data;
};

// Update existing product
export const updateProduct = async (
	id: string,
	productData: Partial<IBaseProduct>,
	imageUris?: string[]
): Promise<IBaseProduct> => {
	const form = new FormData();

	Object.entries(productData).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach((v) => appendValueToForm(form, `${key}[]`, v));
		} else {
			appendValueToForm(form, key, value);
		}
	});

	if (imageUris && imageUris.length > 0) {
		imageUris.forEach((uri, index) => {
			const filename = uri.split('/').pop() || `image_${index}.jpg`;
			const match = /\.(\w+)$/.exec(filename);
			const type = match ? `image/${match[1]}` : 'image/jpeg';
			const file: RNFile = { uri, name: filename, type };
			appendFileToForm(form, 'images', file);
		});
	}

	const { data } = await api.patch<IBaseProduct>(`/products/${id}`, form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});

	return data;
};

// Delete product (admin/vendor only)
export const deleteProduct = async (
	id: string
): Promise<{ success: boolean; message: string }> => {
	const { data } = await api.delete(`/products/${id}`);
	return data;
};

// Update product status (Admin only)
export const updateProductStatus = async (
	id: string,
	status: 'active' | 'inactive' | 'pending'
): Promise<IBaseProduct> => {
	const { data } = await api.patch(`/products/${id}/status`, { status });
	return data;
};
