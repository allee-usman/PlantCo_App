import {
	createProduct,
	deleteProduct,
	getProduct,
	getProductFacets,
	listProducts,
	Product,
	ProductFacets,
	ProductFilters,
	updateProduct,
	updateProductStatus,
} from '@/services/product.services';
import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryResult,
} from '@tanstack/react-query';

// ----------------------
// Query Keys
// ----------------------
const PRODUCT_KEYS = {
	all: ['products'] as const,
	list: (filters?: ProductFilters) =>
		[...PRODUCT_KEYS.all, 'list', filters] as const,
	details: (idOrSlug: string) =>
		[...PRODUCT_KEYS.all, 'details', idOrSlug] as const,
	facets: ['products', 'facets'] as const,
};

// ----------------------
// Hooks
// ----------------------

// ✅ Get all products (with filters)
export const useProducts = (
	filters?: ProductFilters
): UseQueryResult<{ products: Product[]; totalCount: number }> => {
	return useQuery({
		queryKey: PRODUCT_KEYS.list(filters),
		queryFn: () => listProducts(filters),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

// ✅ Get product facets (counts, categories, price ranges)
export const useProductFacets = (): UseQueryResult<ProductFacets> => {
	return useQuery({
		queryKey: PRODUCT_KEYS.facets,
		queryFn: getProductFacets,
		staleTime: 1000 * 60 * 10,
	});
};

// ✅ Get single product by ID or slug
export const useProduct = (idOrSlug: string): UseQueryResult<Product> => {
	return useQuery({
		queryKey: PRODUCT_KEYS.details(idOrSlug),
		queryFn: () => getProduct(idOrSlug),
		enabled: !!idOrSlug,
	});
};

// ✅ Create product
export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productData,
			imageUris,
		}: {
			productData: Omit<Product, '_id' | 'slug' | 'createdAt' | 'updatedAt'>;
			imageUris: string[];
		}) => createProduct(productData, imageUris),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
		},
	});
};

// ✅ Update product
export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			productData,
			imageUris,
		}: {
			id: string;
			productData: Partial<Product>;
			imageUris?: string[];
		}) => updateProduct(id, productData, imageUris),

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: PRODUCT_KEYS.details(data._id),
			});
			queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
		},
	});
};

// ✅ Delete product
export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
		},
	});
};

// ✅ Update product status
export const useUpdateProductStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			status,
		}: {
			id: string;
			status: 'active' | 'inactive' | 'pending';
		}) => updateProductStatus(id, status),

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: PRODUCT_KEYS.details(data._id),
			});
			queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
		},
	});
};
