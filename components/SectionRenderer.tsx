import PromotionalBannerSwiper from '@/components/PromotionalBanner';
import Section from '@/components/Section';
import SponsoredProductsCard from '@/components/SponsoredProductsCard';
import { COLORS } from '@/constants/colors';
import { PLANT_SECTIONS } from '@/constants/constant';
import { Category } from '@/interfaces/category.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { getParentCategories } from '@/services/category.services';
import { listProducts } from '@/services/product.services';
import { toggleWishlist as toggleWishlistService } from '@/services/user.product.services';
import { IBaseProduct } from '@/types/product.types';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import CategoriesSection from './CategoriesSection';
import ProductCard from './TestingCard';

type SectionType = { id: string; title: string };
type SectionRendererProps = { section: SectionType; activeTab: string };

export const SectionRenderer: React.FC<SectionRendererProps> = ({
	section,
	activeTab,
}) => {
	// State for remote service categories (replace hardcoded array)
	const [remoteCategories, setRemoteCategories] = useState<Category[] | null>(
		null
	);
	const [catsLoading, setCatsLoading] = useState(false);
	const [catsError, setCatsError] = useState<string | null>(null);

	const [products, setProducts] = useState<IBaseProduct[]>([]);
	const [loading, setLoading] = useState(false);
	const { user } = useAppSelector((state: RootState) => state.auth);
	// const wishlistIds = user?.customerProfile?.wishlist ?? [];
	// // faster lookup for wishlist
	// const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
	const wishlistSet = useMemo(() => {
		const wishlistIds = user?.customerProfile?.wishlist ?? [];
		return new Set(wishlistIds);
	}, [user?.customerProfile?.wishlist]);

	const dispatch = useAppDispatch();

	// local wishlist set for instant UI updates (derived once from user)
	const [localWishlist, setLocalWishlist] = useState<Set<string>>(() => {
		const ids = user?.customerProfile?.wishlist ?? [];
		return new Set(ids);
	});

	// keep localWishlist in sync when user from store changes (non-destructive)
	useEffect(() => {
		const ids = user?.customerProfile?.wishlist ?? [];
		setLocalWishlist(new Set(ids));
	}, [user?.customerProfile?.wishlist]);

	const handleWishlistToggle = useCallback(
		async (productId: string) => {
			const currentlyWishlisted = localWishlist.has(productId);

			// optimistic update
			setLocalWishlist((prev) => {
				const next = new Set(prev);
				if (currentlyWishlisted) next.delete(productId);
				else next.add(productId);
				return next;
			});

			try {
				// toggle will call add/remove as appropriate
				await toggleWishlistService(productId, currentlyWishlisted);

				// update global user wishlist in RTK store to keep canonical state

				if (dispatch) {
					const updatedWishlist = currentlyWishlisted
						? (user?.customerProfile?.wishlist || []).filter(
								(id) => id !== productId
						  )
						: [...(user?.customerProfile?.wishlist || []), productId];
					const updatedUser = {
						...user,
						customerProfile: {
							...user?.customerProfile,
							wishlist: updatedWishlist,
						},
					} as any;
					//dispatch updateUser with modified user object.
					dispatch(updateUser(updatedUser));
				}
			} catch (err) {
				console.error('Wishlist toggle failed', err);

				// rollback optimistic update
				setLocalWishlist((prev) => {
					const next = new Set(prev);
					if (currentlyWishlisted) next.add(productId);
					else next.delete(productId);
					return next;
				});

				Toast.show({
					type: 'error',
					text1: 'Error',
					text2: 'Failed to update wishlist. Please try again.',
				});
			}
		},
		[localWishlist, dispatch, user]
	);

	// Get config + filters
	const sectionObj = PLANT_SECTIONS.find((s) => s.id === section.id);
	const config = sectionObj?.config || {};

	useEffect(() => {
		// skip special sections
		if (section.id === 'promo-banner' || section.id === 'quick-categories')
			return;

		let mounted = true;
		const fetchProducts = async () => {
			setLoading(true);
			try {
				// compute sectionObj locally to avoid stale refs
				const sectionObjLocal = PLANT_SECTIONS.find((s) => s.id === section.id);
				const params: Record<string, any> = {
					...(sectionObjLocal?.filters || {}),
				};

				if (Array.isArray(params.tags)) params.tags = params.tags.join(',');
				if (Array.isArray(params.categories))
					params.categories = params.categories.join(',');

				const resp = await listProducts(params);
				// defensive: ensure resp.products exists
				const fetchedProducts = Array.isArray(resp?.products)
					? resp.products
					: [];
				if (!mounted) return;
				setProducts(fetchedProducts);
			} catch (err) {
				console.error(
					`Failed to fetch products for section ${section.id}:`,
					err
				);
				if (mounted) setProducts([]);
			} finally {
				if (mounted) setLoading(false);
			}
		};

		fetchProducts();

		return () => {
			mounted = false;
		};
	}, [section.id, activeTab]);

	useEffect(() => {
		// Only fetch once or when activeTab changes if you prefer
		let mounted = true;
		const fetchCategories = async () => {
			if (section.id !== 'quick-categories') return; // only for that section
			setCatsLoading(true);
			setCatsError(null);
			try {
				const cats = await getParentCategories(
					activeTab === 'service' ? 'service' : 'product'
				);

				if (!mounted) return;

				setRemoteCategories(cats);
			} catch (err) {
				console.error('Failed to fetch categories', err);
				if (mounted) setCatsError('Unable to load categories');
			} finally {
				if (mounted) setCatsLoading(false);
			}
		};

		fetchCategories();
		return () => {
			mounted = false;
		};
	}, [section.id, activeTab]);

	const handleViewAll = useCallback(() => {
		console.log('View all categories');
		// router.push('/services/categories');
		//TODO: navigate to all categories screen
	}, []);

	// inside SectionRenderer component, near handleViewAll/handleCategoryPress
	const handleSectionViewAll = useCallback(() => {
		// customize navigation depending on section.id
		if (section.id === 'quick-categories') {
			// show all categories (you already had handleViewAll)
			handleViewAll();
			return;
		}

		if (section.id === 'sponsored') {
			router.push('/(root)/home/sponsored');
			return;
		}

		// default: open a generic "section products" list — create this screen or adjust route
		router.push({
			pathname: '/(root)/home/section/[id]',
			params: { id: section.id, title: section.title },
		});
	}, [section, handleViewAll]);

	const handleCategoryPress = (category: Category) => {
		// navigate to the category screen; pass id and name (optional)
		router.push({
			pathname: '/(root)/home/category/[id]',
			params: { id: category._id ?? category._id, name: category.name },
		});
	};

	// Render product item - updated to match the new ProductCard props signature
	const renderProductItem = useCallback(
		({ item }: { item: IBaseProduct }) => {
			// sponsored section uses special card
			if (section.id === 'sponsored') {
				return (
					<SponsoredProductsCard
						key={item._id}
						product={{
							id: item._id,
							title: item.name,
							punchLine: item.shortDescription || item.description,
							image: item.images?.[0]?.url,
						}}
					/>
				);
			}

			// For regular products render the new ProductCard which expects
			// image, title, price, rating, reviewCount, etc.
			return (
				<ProductCard
					key={item._id}
					image={item.images?.[0]?.url ?? ''}
					title={item.name}
					description={item.shortDescription ?? item.description}
					price={item.price}
					rating={item.reviewStats?.averageRating ?? 0}
					reviewCount={item.reviewStats?.totalReviews ?? 0}
					compareAtPrice={item.compareAtPrice}
					discount={
						item.compareAtPrice
							? Math.round(
									((item.compareAtPrice - item.price) / item.compareAtPrice) *
										100
							  )
							: 0
					}
					isWishlisted={wishlistSet.has(item._id)}
					// inStock={typeof item.stock === 'number' ? item.stock > 0 : true}
					onPress={() =>
						router.push({
							pathname: '/(root)/home/product/[id]',
							params: { id: item._id, product: JSON.stringify(item) },
						})
					}
					// onAddToCart={() => handleAddToCart(item._id)}
					onWishlistToggle={() => handleWishlistToggle(item._id)}
					// width={config. ?? 180}
					// height={(config.cardWidth ?? 180) * 1.3}
				/>
			);
		},
		[section.id, wishlistSet, handleWishlistToggle]
	);

	// Handle special sections - Promotional Banner
	if (sectionObj?.config?.layout === 'banner') {
		return (
			<View key={section.id} className="px-4 mb-8">
				<PromotionalBannerSwiper type="product" />
			</View>
		);
	}

	// Handle special sections - Service Categories
	if (section.id === 'quick-categories') {
		const categoriesToShow = remoteCategories ?? []; // fallback to empty array

		return (
			<View key={section.id} className="mb-6">
				{catsLoading ? (
					<ActivityIndicator size="small" color={COLORS.primary} />
				) : catsError ? (
					<Section title="Categories" containerStyle={{ marginHorizontal: 16 }}>
						<View style={{ padding: 12 }}>
							<Text>{catsError}</Text>
						</View>
					</Section>
				) : (
					<CategoriesSection
						categories={categoriesToShow}
						onViewAll={handleViewAll}
						onCategoryPress={handleCategoryPress}
					/>
				)}
			</View>
		);
	}

	// Product Sections
	const containerStyle = {
		backgroundColor: config.backgroundColor || 'transparent',
		borderRadius: config.borderRadius || 0,
	};

	return (
		<Section
			key={section.id}
			title={section.title}
			containerStyle={containerStyle}
			headerAction
			headerActionLabel="See All"
			onHeaderAction={handleSectionViewAll}
		>
			{loading ? (
				<ActivityIndicator size="small" color={COLORS.primary} />
			) : config.layout === 'grid' ? (
				<FlatList
					data={products}
					numColumns={config.numColumns || 2}
					columnWrapperStyle={{
						paddingHorizontal: 16,
						marginTop: 12,
						gap: 12,
					}}
					keyExtractor={(item) => item._id}
					contentContainerStyle={{
						paddingBottom: 8,
					}}
					renderItem={renderProductItem}
					scrollEnabled={false}
				/>
			) : (
				<FlatList
					data={products}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item._id}
					contentContainerStyle={{
						paddingVertical: 12,
						marginTop: 4,
						paddingHorizontal: 16,
						alignItems: 'flex-start',
						gap: 12,
					}}
					renderItem={renderProductItem}
				/>
			)}
		</Section>
	);
};
