import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import { ExpandableSection } from '@/components/ExpandableSection';
import LottieLoader from '@/components/LottieLoader';
import PillBadge from '@/components/PillBadge';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import {
	serviceProviderService,
	ServiceWithPartialProvider,
} from '@/services/sm.services';
import { formatServiceType } from '@/utils/service.utils';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// IMPROVED: Enhanced type definitions for state management
interface ServiceDetailsState {
	isScrolled: boolean;
	isSaved: boolean;
	expandedSections: {
		description: boolean;
		what_is_included: boolean;
	};
}

const initialState: ServiceDetailsState = {
	isScrolled: false,
	isSaved: false,
	expandedSections: {
		description: true,
		what_is_included: false,
	},
};

type ServiceDetailsAction =
	| {
			type: 'TOGGLE_SECTION';
			section: keyof ServiceDetailsState['expandedSections'];
	  }
	| { type: 'SET_SCROLLED'; payload: boolean }
	| { type: 'TOGGLE_WISHLIST' };

function reducer(
	state: ServiceDetailsState,
	action: ServiceDetailsAction
): ServiceDetailsState {
	switch (action.type) {
		case 'TOGGLE_SECTION':
			return {
				...state,
				expandedSections: {
					...state.expandedSections,
					[action.section]: !state.expandedSections[action.section],
				},
			};

		case 'SET_SCROLLED':
			return { ...state, isScrolled: action.payload };

		case 'TOGGLE_WISHLIST':
			return { ...state, isSaved: !state.isSaved };

		default:
			return state;
	}
}

const ServiceDetails = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

	// IMPROVED: Better state management with proper typing
	const [service, setService] = useState<ServiceWithPartialProvider | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch service data with better error handling
	useEffect(() => {
		if (!serviceId) {
			setError('Service ID is required');
			setLoading(false);
			return;
		}

		const fetchService = async () => {
			setLoading(true);
			setError(null);

			try {
				const resp = await serviceProviderService.getServiceByIdOrSlug(
					serviceId
				);
				setService(resp);
			} catch (err) {
				console.error('Failed to fetch service:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Unable to load service details. Please try again.'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchService();
	}, [serviceId]);

	// Local state with useReducer
	const [state, localDispatch] = useReducer(reducer, {
		...initialState,
		isSaved: false, // TODO: Fetch from wishlist store
	});

	const handleScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const scrollY = event.nativeEvent.contentOffset.y;
			localDispatch({ type: 'SET_SCROLLED', payload: scrollY >= 50 });
		},
		[]
	);

	const handleBooking = useCallback(() => {
		if (!service || !service.active) return;
		router.push({
			pathname: '/(root)/plant-care/booking/[serviceId]',
			params: { serviceId: service?._id! },
		});
	}, [service]);

	const handleSaveForLater = useCallback(() => {
		if (!service) return;
		// TODO: Implement wishlist toggle functionality
		localDispatch({ type: 'TOGGLE_WISHLIST' });
		console.log('Toggle wishlist for service:', service._id);
	}, [service]);

	const handleProviderPress = useCallback(() => {
		if (!service?.provider?._id) return;
		router.push({
			pathname: '/(root)/plant-care/profile/[providerId]',
			params: { providerId: service.provider._id },
		});
	}, [service]);

	const handleRetry = useCallback(() => {
		if (!serviceId) return;
		setLoading(true);
		setError(null);

		serviceProviderService
			.getServiceByIdOrSlug(serviceId)
			.then(setService)
			.catch((err) => {
				console.error('Retry failed:', err);
				setError('Unable to load service details. Please try again.');
			})
			.finally(() => setLoading(false));
	}, [serviceId]);

	// Loading state UI
	if (loading) {
		return (
			<SafeAreaView
				className="flex-1 bg-light-screen dark:bg-gray-950"
				edges={['bottom', 'left', 'right']}
			>
				<CustomHeader
					title="Details"
					iconLeft={
						<Ionicons
							name="chevron-back-outline"
							size={24}
							color={isDark ? 'white' : 'black'}
						/>
					}
					onIconLeftPress={() => router.back()}
				/>
				<View className="flex-1 items-center justify-center">
					<LottieLoader
						animation={animations.spinner}
						size={80}
						color={COLORS.light.pallete[400]}
					/>
					<Text className="text-gray-600 dark:text-gray-400 mt-4 font-nexa">
						Loading service details...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	// Error state UI with retry option
	if (error || !service) {
		return (
			<SafeAreaView
				className="flex-1 bg-light-screen dark:bg-gray-950"
				edges={['top', 'bottom', 'left', 'right']}
			>
				<CustomHeader
					title="Details"
					iconLeft={
						<Ionicons
							name="chevron-back-outline"
							size={24}
							color={isDark ? 'white' : 'black'}
						/>
					}
					onIconLeftPress={() => router.back()}
				/>
				<View className="flex-1 items-center justify-center px-6">
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color={COLORS.gray[400]}
					/>
					<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 mt-4 text-center">
						{error || 'Service not found'}
					</Text>
					<Text className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center font-nexa">
						We couldn&qout;t load the service details. Please check your
						connection and try again.
					</Text>
					<CustomButton
						label="Retry"
						onPress={handleRetry}
						className="mt-6 w-40"
					/>
					<TouchableOpacity onPress={() => router.back()} className="mt-4">
						<Text className="text-primary font-nexa-bold">Go Back</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}

	// Main content with better null checks
	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['bottom', 'left', 'right']}
		>
			{/* Header with proper state management */}
			<View
				className="absolute top-0 left-0 right-0 z-10"
				style={{
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 6,
					elevation: 5,
				}}
			>
				<CustomHeader
					title="Details"
					iconLeft={
						<Ionicons
							name="chevron-back-outline"
							size={24}
							color={isDark ? 'white' : 'black'}
						/>
					}
					iconRight={
						<Ionicons
							name={state.isSaved ? 'bookmark' : 'bookmark-outline'}
							size={24}
							color={state.isSaved ? COLORS.primary : COLORS.gray[400]}
						/>
					}
					onIconLeftPress={() => router.back()}
					onIconRightPress={handleSaveForLater}
					style={{
						backgroundColor: state.isScrolled
							? isDark
								? '#030712'
								: COLORS.light.screen
							: 'transparent',
						paddingBottom: 10,
					}}
				/>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{/* NEW: Image section with fallback */}
				<View className="relative mb-3">
					<StatusBar
						barStyle="dark-content"
						backgroundColor="transparent"
						translucent
					/>

					{service.image?.url ? (
						<Image
							source={{ uri: service.image.url }}
							style={{ width: '100%', height: 400 }}
							resizeMode="cover"
						/>
					) : (
						<View className="w-full h-96 bg-gray-200 dark:bg-gray-800 items-center justify-center">
							<Ionicons
								name="image-outline"
								size={64}
								color={COLORS.gray[400]}
							/>
							<Text className="text-gray-500 dark:text-gray-400 mt-2 font-nexa">
								No image available
							</Text>
						</View>
					)}
				</View>

				{/* IMPROVED: Service information with better formatting */}
				<View className="px-4 mb-6 mt-2">
					<View>
						{/* Category Badge */}
						{/* TODO: Send bg and text color based on type */}
						<PillBadge label={formatServiceType(service.serviceType)} />

						{/* Title */}
						<Text
							className="text-xl font-nexa-extrabold text-gray-900 dark:text-gray-100 mt-2"
							numberOfLines={2}
						>
							{service.title}
						</Text>

						{/* Description Preview */}
						{service.description && (
							<Text
								className="text-gray-600 dark:text-gray-400 mt-2 font-nexa leading-4"
								numberOfLines={3}
							>
								{service.description}
							</Text>
						)}

						{/* Service details in a card */}
						<View className="mt-4 bg-white dark:bg-gray-900 rounded-xl p-4">
							{/* Duration */}
							<View className="flex-row justify-between items-center mb-3">
								<View className="flex-row items-center">
									<Image source={icons.clock} className="size-5" />
									<Text className="text-sm text-gray-600 dark:text-gray-400 ml-2 font-nexa">
										Duration
									</Text>
								</View>
								<Text className="text-sm text-gray-700 dark:text-gray-400 font-nexa-extrabold">
									{service.durationHours || 0} hour
									{service.durationHours !== 1 ? 's' : ''}
								</Text>
							</View>

							{/* Hourly Rate */}
							<View className="flex-row items-center justify-between">
								<View className="flex-row items-center">
									<Image source={icons.rupee} className="size-6" />
									<Text className="text-sm text-gray-600 dark:text-gray-400 ml-2 font-nexa">
										Extra Hours Rate
									</Text>
								</View>

								<Text className="text-sm font-nexa-extrabold text-gray-700">
									Rs {service.hourlyRate || 0}/hr
								</Text>
							</View>

							{/* NEW: Service status indicator */}
							{!service.active && (
								<View className="mt-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg flex-row items-center">
									<Ionicons
										name="warning-outline"
										size={18}
										color={COLORS.light.error.text}
									/>
									<Text className="text-sm text-red-600 dark:text-red-400 ml-2 font-nexa">
										This service is currently unavailable
									</Text>
								</View>
							)}
						</View>

						{/* Provider Card */}
						{service.provider && (
							<TouchableOpacity
								onPress={handleProviderPress}
								activeOpacity={0.7}
								className="mt-4"
							>
								<ServiceProviderCard
									provider={{
										id: service.provider._id,
										name:
											service.provider.serviceProviderProfile?.businessName ||
											'Service Provider',
										rating:
											service.provider.serviceProviderProfile?.stats
												?.averageRating || 0,
										ratePerHour: service.hourlyRate || 0,
										totalReviews:
											service.provider.serviceProviderProfile?.stats
												?.totalReviews || 0,
										phone: service.provider.phoneNumber || '',
										email: service.provider.email || '',
										profileImage: service.provider.avatar?.url || '',
									}}
								/>
							</TouchableOpacity>
						)}
					</View>

					{/* Action Buttons */}
					<CustomButton
						label={service.active ? 'Book Now' : 'Service Unavailable'}
						onPress={handleBooking}
						className="mt-4"
						disabled={!service.active}
					/>

					<CustomButton
						label={state.isSaved ? 'Saved for Later' : 'Schedule for Later'}
						onPress={handleSaveForLater}
						bgVariant="outline"
						textVariant="secondary"
						icon={state.isSaved ? icons.bookmarkFilled : icons.bookmark}
					/>
				</View>

				{/* IMPROVED: Expandable sections with better content */}
				<View className="px-4 mb-6">
					<ExpandableSection
						title="Full Description"
						expanded={state.expandedSections.description}
						onToggle={() =>
							localDispatch({ type: 'TOGGLE_SECTION', section: 'description' })
						}
					>
						<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6">
							{service.description ||
								'No detailed description available for this service.'}
						</Text>
					</ExpandableSection>

					<ExpandableSection
						title="What's Included"
						expanded={state.expandedSections.what_is_included}
						onToggle={() =>
							localDispatch({
								type: 'TOGGLE_SECTION',
								section: 'what_is_included',
							})
						}
					>
						{/* TODO: Replace with actual service inclusions from API */}
						<View className="space-y-2">
							<View className="flex-row items-start mb-2">
								<Ionicons
									name="checkmark-circle"
									size={20}
									color={COLORS.primary}
									style={{ marginRight: 8, marginTop: 2 }}
								/>
								<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6 flex-1">
									Professional service by verified provider
								</Text>
							</View>
							<View className="flex-row items-start mb-2">
								<Ionicons
									name="checkmark-circle"
									size={20}
									color={COLORS.primary}
									style={{ marginRight: 8, marginTop: 2 }}
								/>
								<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6 flex-1">
									All necessary equipment and materials
								</Text>
							</View>
							<View className="flex-row items-start mb-2">
								<Ionicons
									name="checkmark-circle"
									size={20}
									color={COLORS.primary}
									style={{ marginRight: 8, marginTop: 2 }}
								/>
								<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6 flex-1">
									Post-service cleanup and maintenance tips
								</Text>
							</View>
							<View className="flex-row items-start">
								<Ionicons
									name="checkmark-circle"
									size={20}
									color={COLORS.primary}
									style={{ marginRight: 8, marginTop: 2 }}
								/>
								<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6 flex-1">
									Satisfaction guarantee
								</Text>
							</View>
						</View>
					</ExpandableSection>
				</View>

				{/* TODO: Add reviews section when available */}
				{/* <ReviewsSection
					reviewStats={service.reviewStats}
					reviews={service.reviews}
				/> */}

				{/* <RecentlyViewedProducts /> */}
			</ScrollView>
		</SafeAreaView>
	);
};

export default ServiceDetails;
