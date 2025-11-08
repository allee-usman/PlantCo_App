import CustomHeader from '@/components/CustomHeader';
import ProductCard from '@/components/ProductCard';
import { COLORS } from '@/constants/colors';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { listProducts } from '@/services/product.services';
import { IBaseProduct } from '@/types/product.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	useWindowDimensions,
	View,
} from 'react-native';

/**
 * Route params expected:
 *  - id: string (category id)
 *  - name?: string (category name for header/title)
 *
 * Usage:
 * router.push({ pathname: '/(root)/home/category/[id]', params: { id: categoryId, name: categoryName } })
 */

type Params = {
	id?: string;
	name?: string;
};

const PAGE_LIMIT = 16;

export default function CategoryProductsScreen() {
	const { id: categoryId, name: categoryName } = useLocalSearchParams<Params>();
	const router = useRouter();

	const { user } = useAppSelector((s: RootState) => s.auth);
	const wishlistIds = user?.wishlist ?? [];
	const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

	const [products, setProducts] = useState<IBaseProduct[]>([]);
	const [page, setPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number | null>(null);
	const [loading, setLoading] = useState(false); // initial / paging combined
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const safeCategoryId = String(categoryId ?? '');

	const fetchProducts = useCallback(
		async (opts?: { page?: number; append?: boolean }) => {
			if (!safeCategoryId) {
				setProducts([]);
				setTotalCount(0);
				return;
			}

			const targetPage = opts?.page ?? 1;
			const append = !!opts?.append;

			if (append) {
				setIsFetchingMore(true);
			} else if (targetPage === 1 && !refreshing) {
				setLoading(true);
			}

			setError(null);

			try {
				const { products: fetched, totalCount: fetchedTotal } =
					await listProducts({
						category: safeCategoryId,
						page: targetPage,
						limit: PAGE_LIMIT,
					});

				if (append) {
					setProducts((prev) => {
						// dedupe by _id just in case
						const map = new Map(prev.map((p) => [p._id, p]));
						fetched.forEach((p) => map.set(p._id, p));
						return Array.from(map.values());
					});
				} else {
					setProducts(fetched);
				}

				setTotalCount(fetchedTotal);
				setPage(targetPage);
			} catch (err) {
				console.error('Failed to load category products', err);
				setError('Unable to load products. Please try again.');
			} finally {
				setLoading(false);
				setRefreshing(false);
				setIsFetchingMore(false);
			}
		},
		[safeCategoryId, refreshing]
	);

	useEffect(() => {
		// initial load
		fetchProducts({ page: 1, append: false });
		// reset page when category changes
		return () => {
			setProducts([]);
			setPage(1);
			setTotalCount(null);
		};
	}, [safeCategoryId, fetchProducts]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchProducts({ page: 1, append: false });
	}, [fetchProducts]);

	const loadMore = useCallback(() => {
		// don't fetch more if already fetching, or no more items
		if (isFetchingMore || loading) return;
		if (totalCount !== null && products.length >= totalCount) return;
		const nextPage = page + 1;
		setIsFetchingMore(true);
		fetchProducts({ page: nextPage, append: true });
	}, [
		isFetchingMore,
		loading,
		page,
		totalCount,
		products.length,
		fetchProducts,
	]);

	const renderIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] rounded-full items-center justify-center">
				<Ionicons
					name={src as any} //TODO: Change type
					size={24}
					color={isDark ? COLORS.gray[100] : COLORS.gray[950]}
				/>
			</View>
		);
	};

	const handleProductPress = useCallback(
		(item: IBaseProduct) => {
			// navigate to product details by id only
			router.push({
				pathname: '/(root)/home/product/[id]',
				params: { id: item._id },
			});
		},
		[router]
	);
	const { width: screenWidth } = useWindowDimensions();

	const renderProductItem = useCallback(
		({ item }: { item: IBaseProduct }) => (
			<ProductCard
				product={{
					id: item._id,
					name: item.name,
					price: item.price,
					compareAtPrice: item.compareAtPrice,
					image: item.images?.[0]?.url,
					rating: item.reviewStats?.averageRating,
					reviewCount: item.reviewStats?.totalReviews,
					description: item.description,
					isWishlisted: wishlistSet.has(item._id),
				}}
				width={screenWidth / 2 - 24}
				onPress={() => handleProductPress(item)}
			/>
		),
		[wishlistSet, handleProductPress]
	);

	const keyExtractor = (item: IBaseProduct) => item._id;

	const ListEmpty = () => {
		if (loading) return null; // spinner shown above
		return (
			<View style={{ padding: 24, alignItems: 'center' }}>
				<Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
					No products found
				</Text>
				<Text style={{ textAlign: 'center', color: '#666' }}>
					{categoryName
						? `No products found for "${categoryName}".`
						: 'No products found for this category.'}
				</Text>
			</View>
		);
	};

	return (
		<View className="flex bg-light-screen dark:bg-gray-800">
			{/* Header */}
			{/* <CustomHeader
				style={{
					paddingVertical: 12,
					paddingHorizontal: 16,
					borderBottomWidth: 1,
					borderBottomColor: '#eee',
					backgroundColor: '#fff',
				}}
			>
				<Text style={{ fontSize: 20, fontWeight: '700' }}>
					{categoryName ?? 'Category'}
				</Text>
				{totalCount !== null && (
					<Text style={{ color: '#666', marginTop: 4 }}>
						{totalCount} product{totalCount === 1 ? '' : 's'}
					</Text>
				)}
			</CustomHeader> */}
			<CustomHeader
				title={categoryName ?? 'Category'}
				onIconLeftPress={() => {
					router.back();
				}}
				iconLeft={renderIcon('chevron-back-outline')}
				iconRight={renderIcon('filter-outline')}
				onIconRightPress={() => {
					// Handle filter options
					console.log('Filter orders');
				}}
			/>

			{/* Content */}
			{loading && products.length === 0 ? (
				<View
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			) : error ? (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						padding: 16,
					}}
				>
					<Text style={{ marginBottom: 8 }}>{error}</Text>
					<Text
						style={{ color: '#666' }}
						onPress={() => fetchProducts({ page: 1, append: false })}
					>
						Tap to retry
					</Text>
				</View>
			) : (
				<FlatList
					data={products}
					keyExtractor={keyExtractor}
					renderItem={renderProductItem}
					contentContainerStyle={{
						paddingHorizontal: 16,
						paddingVertical: 12,
						gap: 12,
					}}
					showsVerticalScrollIndicator={false}
					numColumns={2}
					columnWrapperStyle={{
						justifyContent: 'space-between',
						marginBottom: 12,
					}}
					onEndReachedThreshold={0.6}
					onEndReached={loadMore}
					ListEmptyComponent={ListEmpty}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					// small footer loader when paginating
					ListFooterComponent={() =>
						isFetchingMore ? (
							<View style={{ padding: 12 }}>
								<ActivityIndicator size="small" color={COLORS.primary} />
							</View>
						) : null
					}
				/>
			)}
		</View>
	);
}
