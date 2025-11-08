import PromotionalBannerSwiper from '@/components/PromotionalBanner';
import Section from '@/components/Section';
import SponsoredProductsCard from '@/components/SponsoredProductsCard';
import { COLORS } from '@/constants/colors';
import { PLANT_SECTIONS } from '@/constants/constant';
import { Category } from '@/interfaces/category.interface';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { getParentCategories } from '@/services/category.services';
import { listProducts } from '@/services/product.services';
import { IBaseProduct } from '@/types/product.types';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import CategoriesSection from './CategoriesSection';
import ProductCard from './ProductCard';
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
	const wishlistIds = user?.wishlist ?? [];

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
				// getParentCategories accepts optional type -> use 'service'
				// console.log('Getting categories for: ', activeTab);

				const cats = await getParentCategories(
					activeTab === 'service' ? 'service' : 'product'
				);
				// console.log('getParentCategories raw response:', cats);

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

	const handleViewAll = () => {
		console.log('View all categories');
		// router.push('/services/categories');
		//TODO: navigate to all categories screen
	};

	const handleCategoryPress = (category: Category) => {
		// navigate to the category screen; pass id and name (optional)
		router.push({
			pathname: '/(root)/home/category/[id]',
			params: { id: category._id ?? category._id, name: category.name },
		});
	};

	// Render product item
	const renderProductItem = useCallback(
		({ item }: { item: IBaseProduct }) => {
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

			return (
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
						isWishlisted: wishlistIds.includes(item._id),
					}}
					onPress={() =>
						router.push({
							pathname: '/(root)/home/product/[id]',
							params: {
								id: item._id,
								product: JSON.stringify(item),
							},
						})
					}
					// onPress={() =>
					// 	router.push({
					// 		pathname: '/(root)/home/product/[id]',
					// 		params: { id: item._id },
					// 	})
					// } //TODO: pass product id only
				/>
			);
		},
		[wishlistIds, section.id]
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
		// console.log(
		// 	'remoteCategories passed to CategoriesSection:',
		// 	remoteCategories
		// );
		return (
			<View key={section.id} className="mb-6">
				{catsLoading ? (
					<ActivityIndicator size="small" color={COLORS.primary} />
				) : catsError ? (
					<Section /* reuse your Section component or simple view */
						title="Categories"
						containerStyle={{ marginHorizontal: 16 }}
					>
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

	// --- Product Sections ---
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
						gap: 12,
						paddingVertical: 12,
						marginTop: 4,
						paddingHorizontal: 16,
						alignItems: 'flex-start',
					}}
					renderItem={renderProductItem}
				/>
			)}
		</Section>
	);
};
