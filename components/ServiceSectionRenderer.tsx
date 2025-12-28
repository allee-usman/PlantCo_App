// components/ServiceSectionRenderer.tsx
import PromotionalBannerSwiper from '@/components/PromotionalBanner';
import Section from '@/components/Section';
import { COLORS } from '@/constants/colors';
import { SERVICE_SECTIONS } from '@/constants/constant';
import { useCardDimensions } from '@/hooks/useCardDimensions';
import { Category } from '@/interfaces/category.interface';
import { User } from '@/interfaces/interface';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { getParentCategories } from '@/services/category.services';
import {
	getAllServiceProviders,
	ListProvidersQuery,
} from '@/services/provider.services';
import { serviceProviderService } from '@/services/sm.services';
import { Service } from '@/types/service.types';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import CategoriesSection from './CategoriesSection';
import ServiceCard from './ServiceCard';
import ListingCard from './ServiceListingCard';

type SectionType = { id: string; title: string; subtitle?: string };
type SectionRendererProps = { section: SectionType; activeTab: string };

export const ServiceSectionRenderer: React.FC<SectionRendererProps> = ({
	section,
	activeTab,
}) => {
	const [remoteCategories, setRemoteCategories] = useState<Category[] | null>(
		null
	);
	const [catsLoading, setCatsLoading] = useState(false);
	const [catsError, setCatsError] = useState<string | null>(null);

	// NEW: Separate state for providers and services
	const [providers, setProviders] = useState<User[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(false);

	const { cardWidth, cardHeight } = useCardDimensions({
		cardType: 'service',
		fullWidth: true,
	});

	// Get favorites from Redux instead of user profile
	const favoriteProviderIds = useAppSelector(
		(state: RootState) => state.favorites?.favoriteProviderIds ?? []
	);

	// FIXED: Find section configuration from SERVICE_SECTIONS
	const sectionObj = SERVICE_SECTIONS.find((s) => s.id === section.id);
	const config = sectionObj?.config || {};
	// NEW: Get mode from section config (provider or service)
	const mode = sectionObj?.mode || 'provider'; // Default to 'provider' if not specified

	// NEW: Fetch data based on section mode (provider or service)
	useEffect(() => {
		// FIXED: Skip data fetching for special sections that don't need providers/services
		if (section.id === 'promo-banner' || section.id === 'quick-categories')
			return;

		let mounted = true;

		const loadData = async () => {
			if (!sectionObj) return;
			const filters = sectionObj?.filters || {};

			try {
				setLoading(true);

				// NEW: Check mode and fetch accordingly
				if (mode === 'provider') {
					// FETCH PROVIDERS: Build query params from section filters
					const query: ListProvidersQuery = {
						limit: filters.limit || 8,
						...(filters.serviceTypes && { serviceTypes: filters.serviceTypes }),
						...(filters.specializations && {
							specializations: filters.specializations,
						}),
						...(filters.minRating && { minRating: filters.minRating }),
						...(filters.minExperience && {
							minExperience: filters.minExperience,
						}),
						...(filters.status && { status: filters.status }),
						...(filters.maxHourlyRate && {
							maxHourlyRate: filters.maxHourlyRate,
						}),
						// NEW: Handle sort parameter from filters
						...(filters.sort && {
							sortBy: filters.sort.split(':')[0],
							sortOrder: filters.sort.split(':')[1] as 'asc' | 'desc',
						}),
						...(filters.verified !== undefined && {
							verified: filters.verified,
						}),
						// NEW: Location-based filtering flag
						...(filters.locationBased && {
							locationBased: filters.locationBased,
						}),
					};

					const resp = await getAllServiceProviders(query);
					const fetchedProviders = Array.isArray(resp) ? resp : [];

					if (!mounted) return;
					setProviders(fetchedProviders);
					setServices([]); // Clear services when fetching providers
				} else if (mode === 'service') {
					const resp = await serviceProviderService.listServices({
						serviceType: filters.serviceTypes,
						// minRating: 4,
						// page: 1,
						// provider: filters.provider,
						limit: filters.limit || 4,
						active: true,
					});

					// console.log('API response data: ', resp.data);

					const fetchedServices = Array.isArray(resp.data) ? resp.data : [];

					if (!mounted) return;
					setServices(fetchedServices);
					setProviders([]); // Clear providers when fetching services
				}
			} catch (err) {
				console.error(
					`Failed to fetch ${mode}s for section ${section.id}:`,
					err
				);
			} finally {
				if (mounted) setLoading(false);
			}
		};

		loadData();
		return () => {
			mounted = false;
		};
	}, [section.id, activeTab, mode, sectionObj]);

	// Fetch categories for quick-categories section
	useEffect(() => {
		let mounted = true;
		const fetchCategories = async () => {
			// FIXED: Only fetch categories for quick-categories section
			if (section.id !== 'quick-categories') return;

			setCatsLoading(true);
			setCatsError(null);
			try {
				const cats = await getParentCategories('service');
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

	// NEW: Handler for "View All" categories
	const handleViewAll = () => {
		console.log('View all categories');
		// router.push('/services/categories');
	};

	// NEW: Handler for category press
	const handleCategoryPress = (category: Category) => {
		router.push({
			pathname: '/(root)/home/category/[id]',
			params: { id: category._id ?? category._id, name: category.name },
		});
	};

	// NEW: Handler for provider card press
	const handleProviderPress = useCallback((providerId: string) => {
		router.push({
			pathname: '/(root)/plant-care/profile/[providerId]',
			params: {
				providerId: providerId,
			},
		});
	}, []);

	// NEW: Handler for service card press
	const handleServicePress = useCallback((serviceId: string) => {
		router.push({
			pathname: '/(root)/plant-care/service/[serviceId]',
			params: {
				serviceId: serviceId,
			},
		});
	}, []);

	// NEW: Handler for book button press
	const handleBookPress = useCallback(
		(id: string) => {
			if (mode === 'provider') {
				router.push({
					pathname: '/(root)/plant-care/profile/[providerId]',
					params: {
						providerId: id,
					},
				});
			} else {
				router.push({
					pathname: '/(root)/plant-care/service/[serviceId]',
					params: {
						serviceId: id,
					},
				});
			}
		},
		[mode]
	);

	// NEW: Render individual provider card item
	const renderProviderItem = useCallback(
		({ item }: { item: User }) => {
			const isFavorite = favoriteProviderIds.includes(item._id);

			return (
				<ServiceCard
					image={item.avatar?.url!}
					name={item.serviceProviderProfile?.businessName!}
					price={item.serviceProviderProfile?.pricing?.hourlyRate!}
					rating={item.serviceProviderProfile?.stats?.averageRating!}
					reviewCount={item.serviceProviderProfile?.stats?.totalReviews!}
					specialities={
						item.serviceProviderProfile?.experience?.specializations || []
					}
					status={item.serviceProviderProfile?.availability?.status!}
					experience={
						item.serviceProviderProfile?.experience?.yearsInBusiness
							? `${item.serviceProviderProfile.experience.yearsInBusiness}+ years`
							: undefined
					}
					location="Johar Town F-Block"
					completedJobs={item.serviceProviderProfile?.stats?.completedJobs}
					responseTime={item.serviceProviderProfile?.stats?.responseTime?.toString()}
					verified={
						item.serviceProviderProfile?.verificationStatus === 'verified'
					}
					width={cardWidth}
					height={cardHeight}
					isFavorite={isFavorite}
					onPress={() => handleProviderPress(item._id)}
					onBookPress={() => handleBookPress(item._id)}
				/>
			);
		},
		[
			favoriteProviderIds,
			cardWidth,
			cardHeight,
			handleProviderPress,
			handleBookPress,
		]
	);

	// NEW: Render individual service card item
	const renderServiceItem = useCallback(
		({ item }: { item: any }) => {
			// TODO: Add proper Service interface and mapping
			return (
				<View className="px-4">
					<ListingCard
						listing={item}
						onPress={() => handleServicePress(item._id)}
						// onBookPress={() => handleBookPress(item._id)}
					/>
				</View>
			);
		},
		[handleServicePress]
	);

	// SECTION RENDER: Promotional Banner
	if (sectionObj?.config?.layout === 'banner') {
		return (
			<View key={section.id} className="px-4 mb-8">
				<PromotionalBannerSwiper type="service" />
			</View>
		);
	}

	// SECTION RENDER: Service Categories (quick-categories)
	if (section.id === 'quick-categories') {
		const categoriesToShow = remoteCategories ?? [];
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

	// SECTION RENDER: Provider/Service sections (horizontal/grid layouts)
	// NEW: Apply container styling from section config
	const containerStyle = {
		borderRadius: config.borderRadius || 0,
		backgroundColor: config.backgroundColor || 'transparent',
	};

	// NEW: Determine which data to render based on mode
	const dataToRender = mode === 'provider' ? providers : services;
	const renderItem =
		mode === 'provider' ? renderProviderItem : renderServiceItem;

	return (
		<Section
			key={section.id}
			title={section.title}
			subtitle={section.subtitle}
			containerStyle={containerStyle}
			headerAction
			headerActionLabel="See All"
		>
			{loading ? (
				<ActivityIndicator size="small" color={COLORS.primary} />
			) : config.layout === 'grid' ? (
				// LAYOUT: Grid layout for provider/service cards
				<FlatList
					data={dataToRender}
					numColumns={config.numColumns || 2}
					keyExtractor={(item) => item._id}
					contentContainerStyle={{
						paddingBottom: 8,
						paddingHorizontal: 16,
						marginTop: 12,
						gap: 12,
					}}
					renderItem={renderItem}
					scrollEnabled={false}
				/>
			) : (
				// LAYOUT: Horizontal scroll layout for provider/service cards
				<FlatList
					data={dataToRender}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item._id}
					contentContainerStyle={{
						gap: 12,
						paddingHorizontal: 16,
						alignItems: 'flex-start',
					}}
					renderItem={renderItem}
				/>
			)}
		</Section>
	);
};
