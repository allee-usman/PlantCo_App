import CustomHeader from '@/components/CustomHeader';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import ProductCard from '@/components/TestingCard';
import { COLORS } from '@/constants/colors';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cartSlice';
import { RootState } from '@/redux/store';
import { listProducts } from '@/services/product.services';
import { toggleWishlist } from '@/services/user.product.services';
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
import Toast from 'react-native-toast-message';

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
	const { width: screenWidth } = useWindowDimensions();
	const { id: categoryId, name: categoryName } = useLocalSearchParams<Params>();
	const router = useRouter();

	const dispatch = useAppDispatch();
	const { user } = useAppSelector((s: RootState) => s.auth);
	const wishlistIds = user?.customerProfile?.wishlist ?? [];
	const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
	// track per-item "just added" success state (shows checkmark briefly)
	const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

	// store timers so we can clear them on unmount or when re-adding
	const addedTimersRef = React.useRef<
		Record<string, ReturnType<typeof setTimeout>>
	>({});

	const [products, setProducts] = useState<IBaseProduct[]>([]);
	const [page, setPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number | null>(null);
	const [loading, setLoading] = useState(false); // initial / paging combined
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	// track per-item adding state (shows spinner on card)
	const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});

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
				params: { id: item._id, product: JSON.stringify(item) },
			});
		},
		[router]
	);

	// action: add to cart for an item id (shows spinner)
	// const handleAddToCart = useCallback(
	// 	async (productId: string, quantity = 1) => {
	// 		try {
	// 			setAddingMap((m) => ({ ...m, [productId]: true }));
	// 			await dispatch(
	// 				// dispatch thunk, unwrap optional
	// 				(addToCart as any)({ productId, quantity })
	// 			).unwrap?.();
	// 			Toast.show({
	// 				type: 'success',
	// 				text1: 'Added to Cart',
	// 			});
	// 		} catch (err: any) {
	// 			console.error('Add to cart error', err);
	// 			Toast.show({
	// 				type: 'error',
	// 				text1: 'Error',
	// 				text2:
	// 					err?.message ||
	// 					err?.data?.message ||
	// 					'Failed to add item to cart. Please try again.',
	// 			});
	// 		} finally {
	// 			setAddingMap((m) => ({ ...m, [productId]: false }));
	// 		}
	// 	},
	// 	[dispatch]
	// );
	const handleAddToCart = useCallback(
		async (productId: string, quantity = 1) => {
			// prevent duplicate calls
			if (addingMap[productId]) return;

			try {
				// show spinner on card
				setAddingMap((m) => ({ ...m, [productId]: true }));

				// dispatch addToCart thunk; use unwrap if available to get throw on error
				await dispatch((addToCart as any)({ productId, quantity })).unwrap?.();

				// show success toast
				Toast.show({ type: 'success', text1: 'Added to Cart' });

				// show checkmark briefly
				setAddedMap((m) => ({ ...m, [productId]: true }));

				// clear any existing timer for this id
				if (addedTimersRef.current[productId]) {
					clearTimeout(addedTimersRef.current[productId]);
				}
				// auto-clear checkmark after 2s
				const t = setTimeout(() => {
					setAddedMap((m) => {
						const copy = { ...m };
						delete copy[productId];
						return copy;
					});
					delete addedTimersRef.current[productId];
				}, 2000);
				addedTimersRef.current[productId] = t;
			} catch (err: any) {
				console.error('Add to cart error', err);
				Toast.show({
					type: 'error',
					text1: 'Error',
					text2:
						err?.message ||
						err?.data?.message ||
						'Failed to add item to cart. Please try again.',
				});
			} finally {
				// always clear adding spinner
				setAddingMap((m) => {
					const copy = { ...m };
					delete copy[productId];
					return copy;
				});
			}
		},
		[dispatch, addingMap]
	);

	// action: toggle wishlist
	const handleWishlistToggle = useCallback(async (productId: string) => {
		try {
			// optimistic toast; ideally update store/user on success
			await toggleWishlist(productId, wishlistSet.has(productId));
			Toast.show({
				type: 'success',
				text1: 'Wishlist updated',
			});
			// optional: trigger refresh of auth or product lists if needed
		} catch (err) {
			console.error('Wishlist toggle failed', err);
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: 'Failed to update wishlist',
			});
		}
	}, []);

	const cardWidth = screenWidth / 2 - 20;

	const renderProductItem = useCallback(
		({ item }: { item: IBaseProduct }) => {
			return (
				<ProductCard
					image={item.images?.[0]?.url ?? ''}
					title={item.name}
					// description={item.description}
					price={item.price}
					rating={item.reviewStats?.averageRating}
					reviewCount={item.reviewStats?.totalReviews}
					// compareAtPrice={item.compareAtPrice}
					// discount={item.discount}
					isWishlisted={wishlistSet.has(item._id)}
					width={cardWidth}
					height={cardWidth * 1.5}
					// inStock={item.inStock}
					onAddToCart={() => handleAddToCart(item._id)}
					onWishlistToggle={() => handleWishlistToggle(item._id)}
					addingToCart={!!addingMap[item._id]}
					onPress={() => handleProductPress(item)}
					added={!!addedMap[item._id]}
				/>
			);
		},
		[
			wishlistSet,
			cardWidth,
			handleAddToCart,
			handleWishlistToggle,
			addingMap,
			handleProductPress,
			addedMap,
		]
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
					<View className="flex-1 justify-between items-center">
						<LottieLoadingIndicator />
					</View>
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
						paddingBottom: 110,
						gap: 8,
					}}
					showsVerticalScrollIndicator={false}
					numColumns={2}
					columnWrapperStyle={{
						justifyContent: 'space-between',
						// marginBottom: 12,
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
