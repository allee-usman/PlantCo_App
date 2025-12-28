// hooks/useServiceProviders.ts

import {
	addProviderToFavorites,
	getAllServiceProviders,
	ListProvidersQuery,
	removeProviderFromFavorites,
} from '@/services/provider.services';
import { ServiceProvider } from '@/types/provider.types';
import { useCallback, useEffect, useState } from 'react';

interface UseServiceProvidersOptions {
	query?: ListProvidersQuery;
	enabled?: boolean;
	autoFetch?: boolean;
}

interface UseServiceProvidersReturn {
	providers: ServiceProvider[];
	loading: boolean;
	error: string | null;
	page: number;
	totalPages: number;
	hasMore: boolean;
	refetch: () => Promise<void>;
	fetchMore: () => Promise<void>;
	toggleFavorite: (providerId: string) => Promise<void>;
	favoriteLoading: Record<string, boolean>;
}

export const useServiceProviders = (
	options: UseServiceProvidersOptions = {}
): UseServiceProvidersReturn => {
	const { query = {}, enabled = true, autoFetch = true } = options;

	const [providers, setProviders] = useState<ServiceProvider[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(query.page || 1);
	const [totalPages, setTotalPages] = useState(1);
	const [favoriteLoading, setFavoriteLoading] = useState<
		Record<string, boolean>
	>({});

	const fetchProviders = useCallback(
		async (pageNum: number = page, append: boolean = false) => {
			if (!enabled) return;

			setLoading(true);
			setError(null);

			try {
				const response = await getAllServiceProviders({
					...query,
					page: pageNum,
				});

				if (append) {
					setProviders((prev) => [...prev, ...response.providers]);
				} else {
					setProviders(response.providers);
				}

				setPage(response.page);
				setTotalPages(response.totalPages);
			} catch (err: any) {
				console.error('Failed to fetch service providers:', err);
				setError(err.message || 'Failed to load service providers');
			} finally {
				setLoading(false);
			}
		},
		[enabled, query, page]
	);

	const refetch = useCallback(async () => {
		setPage(1);
		await fetchProviders(1, false);
	}, [fetchProviders]);

	const fetchMore = useCallback(async () => {
		if (page < totalPages && !loading) {
			await fetchProviders(page + 1, true);
		}
	}, [page, totalPages, loading, fetchProviders]);

	const toggleFavorite = useCallback(
		async (providerId: string) => {
			setFavoriteLoading((prev) => ({ ...prev, [providerId]: true }));

			try {
				// Check if provider is currently favorited
				const isFavorite = providers.find((p) => p._id === providerId);

				if (isFavorite) {
					await removeProviderFromFavorites(providerId);
				} else {
					await addProviderToFavorites(providerId);
				}

				// Optimistically update the UI
				// You might want to refetch or update local state based on your needs
				await refetch();
			} catch (err: any) {
				console.error('Failed to toggle favorite:', err);
				setError(err.message || 'Failed to update favorites');
			} finally {
				setFavoriteLoading((prev) => ({ ...prev, [providerId]: false }));
			}
		},
		[providers, refetch]
	);

	useEffect(() => {
		if (autoFetch && enabled) {
			fetchProviders(1, false);
		}
	}, [autoFetch, enabled]);

	return {
		providers,
		loading,
		error,
		page,
		totalPages,
		hasMore: page < totalPages,
		refetch,
		fetchMore,
		toggleFavorite,
		favoriteLoading,
	};
};

// Hook for single provider
export const useServiceProvider = (providerId?: string) => {
	const [provider, setProvider] = useState<ServiceProvider | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProvider = useCallback(async () => {
		if (!providerId) return;

		setLoading(true);
		setError(null);

		try {
			const { getServiceProviderById } = await import(
				'@/services/provider.services'
			);
			const data = await getServiceProviderById(providerId);
			setProvider(data);
		} catch (err: any) {
			console.error('Failed to fetch provider:', err);
			setError(err.message || 'Failed to load provider');
		} finally {
			setLoading(false);
		}
	}, [providerId]);

	useEffect(() => {
		if (providerId) {
			fetchProvider();
		}
	}, [providerId, fetchProvider]);

	return {
		provider,
		loading,
		error,
		refetch: fetchProvider,
	};
};
