// services/category.services.ts
import { Category, CategoryType } from '@/interfaces/interface';
import api from '@/utils/api';

/** Response shape for listCategories */
export interface CategoryListResponse {
	total: number;
	page: number;
	limit: number;
	pages: number;
	data: Category[];
}

/** Query options for listCategories */
export interface ListCategoriesQuery {
	page?: number | string;
	limit?: number | string;
	search?: string;
	type?: CategoryType;
	parent?: string | 'null';
	isActive?: boolean | string;
	sortBy?: string; // e.g. "order,-createdAt"
}

/** Payloads */
export interface CreateCategoryPayload {
	name: string;
	description?: string;
	parent?: string | null;
	type?: CategoryType;
	// For file uploads use imageUri (local file URI). If you already have a hosted image,
	// set imageUrl or image as part of the payload (imageUrl preferred).
	imageUri?: string;
	imageUrl?: string;
	isActive?: boolean;
	order?: number;
	metaTitle?: string;
	metaDescription?: string;
}

export interface UpdateCategoryPayload {
	name?: string;
	description?: string;
	parent?: string | null;
	type?: CategoryType;
	imageUri?: string;
	imageUrl?: string;
	isActive?: boolean;
	order?: number;
	metaTitle?: string;
	metaDescription?: string;
}

/**
 * Helpers
 */
const appendImageToForm = (
	form: FormData,
	uri: string,
	fieldName = 'image'
) => {
	const filename = uri.split('/').pop() || `image_${Date.now()}.jpg`;
	const match = /\.(\w+)$/.exec(filename);
	const type = match ? `image/${match[1]}` : 'image/jpeg';

	form.append(fieldName, {
		uri,
		name: filename,
		type,
	} as any);
};

/**
 * Services
 */

/** List categories with query params */
export const listCategories = async (
	query: ListCategoriesQuery = {}
): Promise<CategoryListResponse> => {
	const { data } = await api.get<CategoryListResponse>('/categories', {
		params: query,
	});
	return data;
};

/** Get single category by id */
export const getCategoryById = async (id: string): Promise<Category> => {
	const { data } = await api.get<Category>(`/categories/${id}`);
	return data;
};

/** Get category by slug */
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
	const { data } = await api.get<Category>(
		`/categories/slug/${encodeURIComponent(slug)}`
	);
	return data;
};

/** Get category tree (two-level) */
export const getCategoryTree = async (
	query: Partial<ListCategoriesQuery> = {}
): Promise<Category[]> => {
	const { data } = await api.get<Category[]>('/categories/tree', {
		params: query,
	});
	return data;
};

/** Get parent (top-level) categories */
export const getParentCategories = async (
	type?: CategoryType
): Promise<Category[]> => {
	const params = type ? { type } : undefined;
	const response = await api.get<{ success: boolean; data: Category[] }>(
		'/categories/parents',
		{ params }
	);
	return response.data.data; // 👈 unwrap the array here
};

/**
 * Create category.
 * If payload.imageUri is provided, sends multipart/form-data with file field name "image".
 * Otherwise sends JSON.
 */
export const createCategory = async (
	payload: CreateCategoryPayload
): Promise<Category> => {
	if (payload.imageUri) {
		const form = new FormData();
		// append text fields
		form.append('name', payload.name);
		if (payload.description) form.append('description', payload.description);
		if (typeof payload.parent !== 'undefined' && payload.parent !== null)
			form.append('parent', payload.parent);
		if (payload.parent === null) form.append('parent', 'null'); // explicit null -> server interprets
		if (payload.type) form.append('type', payload.type);
		if (typeof payload.isActive !== 'undefined')
			form.append('isActive', String(payload.isActive));
		if (typeof payload.order !== 'undefined')
			form.append('order', String(payload.order));
		if (payload.metaTitle) form.append('metaTitle', payload.metaTitle);
		if (payload.metaDescription)
			form.append('metaDescription', payload.metaDescription);

		// append file
		appendImageToForm(form, payload.imageUri, 'image');

		const { data } = await api.post<Category>('/categories', form, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return data;
	}

	// fallback to JSON (supports imageUrl)
	const body: any = {
		name: payload.name,
		description: payload.description,
		parent: typeof payload.parent !== 'undefined' ? payload.parent : undefined,
		type: payload.type,
		imageUrl: payload.imageUrl,
		isActive: payload.isActive,
		order: payload.order,
		metaTitle: payload.metaTitle,
		metaDescription: payload.metaDescription,
	};

	const { data } = await api.post<Category>('/categories', body);
	return data;
};

/**
 * Update category.
 * If payload.imageUri is provided, sends multipart/form-data (PUT with multipart).
 * Note: some clients or servers have trouble with PUT + multipart. If issues appear,
 * consider using POST /categories/:id?_method=PUT with method-override, or provide a dedicated endpoint for image.
 */
export const updateCategory = async (
	id: string,
	payload: UpdateCategoryPayload
): Promise<Category> => {
	if (payload.imageUri) {
		const form = new FormData();
		// append optional text fields
		if (payload.name) form.append('name', payload.name);
		if (payload.description) form.append('description', payload.description);
		if (typeof payload.parent !== 'undefined' && payload.parent !== null)
			form.append('parent', payload.parent);
		if (payload.parent === null) form.append('parent', 'null');
		if (payload.type) form.append('type', payload.type);
		if (typeof payload.isActive !== 'undefined')
			form.append('isActive', String(payload.isActive));
		if (typeof payload.order !== 'undefined')
			form.append('order', String(payload.order));
		if (payload.metaTitle) form.append('metaTitle', payload.metaTitle);
		if (payload.metaDescription)
			form.append('metaDescription', payload.metaDescription);

		// file
		appendImageToForm(form, payload.imageUri, 'image');

		const { data } = await api.put<Category>(`/categories/${id}`, form, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return data;
	}

	const body: any = {
		name: payload.name,
		description: payload.description,
		parent: typeof payload.parent !== 'undefined' ? payload.parent : undefined,
		type: payload.type,
		imageUrl: payload.imageUrl,
		isActive: payload.isActive,
		order: payload.order,
		metaTitle: payload.metaTitle,
		metaDescription: payload.metaDescription,
	};

	const { data } = await api.put<Category>(`/categories/${id}`, body);
	return data;
};

/** Soft delete category (authorized) */
export const softDeleteCategory = async (id: string): Promise<Category> => {
	const { data } = await api.delete<Category>(`/categories/${id}`);
	return data;
};

/** Restore soft-deleted category */
export const restoreCategory = async (id: string): Promise<Category> => {
	const { data } = await api.post<Category>(`/categories/${id}/restore`);
	return data;
};

/** Hard delete category (admin only) */
export const hardDeleteCategory = async (
	id: string
): Promise<{ success: boolean; message: string }> => {
	const { data } = await api.delete<{ success: boolean; message: string }>(
		`/categories/${id}/hard`
	);
	return data;
};

/** Toggle active */
export const toggleActive = async (id: string): Promise<Category> => {
	const { data } = await api.post<Category>(`/categories/${id}/toggle-active`);
	return data;
};

export default {
	listCategories,
	getCategoryById,
	getCategoryBySlug,
	getCategoryTree,
	getParentCategories,
	createCategory,
	updateCategory,
	softDeleteCategory,
	restoreCategory,
	hardDeleteCategory,
	toggleActive,
};
