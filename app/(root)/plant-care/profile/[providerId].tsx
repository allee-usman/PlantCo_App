import CustomHeader from '@/components/CustomHeader';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import ProfileHeader from '@/components/ProviderProfileScreen/ProfileHeader/ProfileHeader';
import ProfileTabs from '@/components/ProviderProfileScreen/ProfileTabs';
import AboutSection from '@/components/ProviderProfileScreen/TabContent/AboutTab';
import ListingsSection from '@/components/ProviderProfileScreen/TabContent/ListingsTab';
import ReviewCard from '@/components/ReviewCard';
import { COLORS } from '@/constants/colors';
import { getServiceProviderById } from '@/services/providers.services';
import { serviceProviderService } from '@/services/sm.services';
import { Service } from '@/types/service.types';
import { ServiceProviderProfile, User } from '@/types/user.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
	ActivityIndicator,
	ImageSourcePropType,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
	useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * ===========================
 * TYPE DEFINITIONS
 * ===========================
 */

interface ProviderProfileScreenProps {
	// Provider ID to fetch data
	providerId: string;
	// Optional navigation handler for back button
	onBack?: () => void;
	// Optional handler for booking
	onBook?: () => void;
}

interface Review {
	id: string;
	userName: string;
	userImage: string | ImageSourcePropType;
	rating: number;
	date: string;
	comment: string;
	helpful: number;
}

type TabType = 'listings' | 'reviews' | 'about';

/**
 * Fetches provider reviews
 * TODO: Replace with actual API call to your backend
 */
const fetchProviderReviews = async (providerId: string): Promise<Review[]> => {
	await new Promise((resolve) => setTimeout(resolve, 600));

	// PLACEHOLDER: Replace with actual API call
	// const response = await fetch(`${API_BASE_URL}/providers/${providerId}/reviews`);
	// return await response.json();

	// return [
	// 	{
	// 		id: '1',
	// 		userName: 'John Doe',
	// 		userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
	// 		rating: 5,
	// 		date: '2024-01-15',
	// 		comment:
	// 			'Excellent service! Very professional and completed the job on time. Highly recommended!',
	// 		helpful: 12,
	// 	},
	// 	{
	// 		id: '2',
	// 		userName: 'Sarah Smith',
	// 		userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
	// 		rating: 4.5,
	// 		date: '2024-01-10',
	// 		comment:
	// 			'Great work on my garden. Very knowledgeable about plants and landscaping.',
	// 		helpful: 8,
	// 	},
	// 	{
	// 		id: '3',
	// 		userName: 'Mike Johnson',
	// 		userImage: 'https://randomuser.me/api/portraits/men/3.jpg',
	// 		rating: 4,
	// 		date: '2024-01-05',
	// 		comment:
	// 			'Good service overall. Could improve communication but quality of work was solid.',
	// 		helpful: 5,
	// 	},
	// ];
	return [];
};

/**
 * Toggles favorite status for provider
 * TODO: Replace with actual API call to your backend
 */
// const toggleProviderFavorite = async (
// 	providerId: string,
// 	isFavorite: boolean
// ): Promise<boolean> => {
// 	await new Promise((resolve) => setTimeout(resolve, 300));

// 	// PLACEHOLDER: Replace with actual API call
// 	// const response = await fetch(`${API_BASE_URL}/providers/${providerId}/favorite`, {
// 	//   method: 'POST',
// 	//   body: JSON.stringify({ isFavorite: !isFavorite }),
// 	// });
// 	// return await response.json();

// 	return !isFavorite;
// };

const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({
	onBook,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const providerId = useLocalSearchParams().providerId as string;

	// State management
	const [activeTab, setActiveTab] = useState<TabType>('listings');
	const [providerData, setProviderData] = useState<User | null>(null);
	const [listings, setListings] = useState<Service[]>([]);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [aboutData, setAboutData] = useState<ServiceProviderProfile | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [tabLoading, setTabLoading] = useState(false);

	/**
	 * Loads provider profile data
	 */
	const loadProviderData = useCallback(async () => {
		try {
			const response = await getServiceProviderById(providerId);
			setProviderData(response);
			setAboutData(response?.serviceProviderProfile!);
		} catch (error) {
			console.error('Error fetching provider data:', error);
			// TODO: Show error toast/message
		}
	}, [providerId]);

	/**
	 * Loads tab-specific data based on active tab
	 */
	const loadTabData = useCallback(
		async (tab: TabType) => {
			setTabLoading(true);
			try {
				switch (tab) {
					case 'listings':
						const listingsData = await serviceProviderService.getActiveServices(
							providerId
						);
						setListings(listingsData.data);
						break;
					case 'reviews':
						const reviewsData = await fetchProviderReviews(providerId);
						setReviews(reviewsData);
						break;
					case 'about':
						// const aboutInfo = await fetchProviderAbout(providerId);
						// setAboutData(aboutInfo);
						break;
				}
			} catch (error) {
				console.error(`Error fetching ${tab} data:`, error);
				// TODO: Show error toast/message
			} finally {
				setTabLoading(false);
			}
		},
		[providerId]
	);

	/**
	 * Initial data load
	 */
	React.useEffect(() => {
		const initializeScreen = async () => {
			setLoading(true);
			await Promise.all([loadProviderData(), loadTabData('listings')]);
			setLoading(false);
		};

		initializeScreen();
	}, [providerId, loadProviderData, loadTabData]);

	/**
	 * Handle tab change
	 */
	const handleTabChange = useCallback(
		(tab: TabType) => {
			setActiveTab(tab);
			loadTabData(tab);
		},
		[loadTabData]
	);

	/**
	 * Handle pull-to-refresh
	 */
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await Promise.all([loadProviderData(), loadTabData(activeTab)]);
		setRefreshing(false);
	}, [loadProviderData, loadTabData, activeTab]);

	/**
	 * Handle favorite toggle
	 */
	// const handleFavoriteToggle = useCallback(async () => {
	// 	if (!providerData) return;

	// 	try {
	// 		const newFavoriteStatus = await toggleProviderFavorite(
	// 			providerId,
	// 			providerData.isFavorite
	// 		);
	// 		setProviderData((prev) =>
	// 			prev ? { ...prev, isFavorite: newFavoriteStatus } : null
	// 		);
	// 		// TODO: Show success toast
	// 	} catch (error) {
	// 		console.error('Error toggling favorite:', error);
	// 		// TODO: Show error toast
	// 	}
	// }, [providerId, providerData]);

	// Show loading state
	if (loading || !providerData) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
				<LottieLoadingIndicator />
			</SafeAreaView>
		);
	}

	const imageSource =
		typeof providerData.avatar?.url === 'string'
			? { uri: providerData.avatar?.url }
			: providerData.avatar?.url;

	return (
		<View className="flex-1 bg-gray-50 dark:bg-black">
			{/* Header */}
			<CustomHeader
				title="Profile"
				iconLeft={<Ionicons name="chevron-back" size={24} color="#000000" />}
			/>

			<ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				className="bg-light-screen dark:bg-dark-screen"
			>
				{/* Provider Profile Header */}
				<ProfileHeader
					imageSource={imageSource!}
					name={
						providerData?.serviceProviderProfile?.businessName ||
						providerData.name!
					}
					slogan={providerData?.serviceProviderProfile?.slogan || ''}
					verified={
						providerData?.serviceProviderProfile?.verificationStatus ===
						'verified'
					}
					rating={providerData?.serviceProviderProfile?.stats?.averageRating!}
					reviewCount={
						providerData?.serviceProviderProfile?.stats?.totalReviews!
					}
					completedJobs={
						providerData?.serviceProviderProfile?.stats?.completedJobs!
					}
					completionRate={
						providerData?.serviceProviderProfile?.stats?.completionRate!
					}
					responseTime={
						providerData?.serviceProviderProfile?.stats?.responseTime!
					}
					status={providerData?.serviceProviderProfile?.availability?.status!}
				/>

				{/* Tabs */}
				<ProfileTabs
					tabs={['listings', 'reviews', 'about']}
					activeTab={activeTab}
					onChange={handleTabChange}
				/>

				{/* Tab Content */}
				<View className="px-4 pb-4">
					{tabLoading ? (
						<View className="py-10 items-center">
							<ActivityIndicator
								size="large"
								color={COLORS.light.pallete[400]}
							/>
						</View>
					) : (
						<>
							{/* Listings Tab */}
							{activeTab === 'listings' && (
								<ListingsSection
									listings={listings}
									titlePrefix="All"
									onItemPress={(listing) => {
										console.log('Open listing:', listing._id);
									}}
								/>
							)}

							{/* Reviews Tab */}
							{activeTab === 'reviews' && (
								<View>
									<Text className="text-base font-nexa-extrabold text-gray-900 dark:text-gray-100 mb-3">
										Customer Reviews
									</Text>
									{reviews.length === 0 ? (
										<Text className="text-md leading-4 font-nexa text-gray-500 dark:text-gray-300 text-center ">
											No reviews yet. Be the first to review this provider!
										</Text>
									) : (
										reviews.map((review) => (
											<ReviewCard key={review.id} review={review} />
										))
									)}
								</View>
							)}

							{/* About Tab */}
							{activeTab === 'about' && aboutData && (
								<AboutSection
									aboutData={aboutData}
									memberSince={providerData.createdAt}
									isDark={isDark}
								/>
							)}
						</>
					)}
				</View>
			</ScrollView>

			{/* Fixed Bottom Action Button */}
			{providerData?.serviceProviderProfile?.availability?.status !==
				'on_leave' && (
				<View className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
					<Pressable
						onPress={onBook}
						className="bg-light-pallete-500 dark:bg-light-pallete-400 rounded-xl py-4 items-center justify-center active:opacity-80 mb-1"
						// disabled={providerData.status === 'on_leave'}
					>
						<Text className="text-base font-nexa-extrabold text-white dark:text-gray-900">
							Book Now
						</Text>
					</Pressable>
				</View>
			)}
		</View>
	);
};

export default ProviderProfileScreen;
