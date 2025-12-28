import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { formatServiceType } from '@/utils/service.utils';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
	Image,
	ImageSourcePropType,
	Pressable,
	Text,
	View,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';

interface ServiceCardProps {
	// Required props
	image: string | ImageSourcePropType;
	name: string;
	price: number;
	rating: number;
	reviewCount: number;
	specialities: string[];
	status: 'available' | 'busy' | 'on_leave';

	// Optional props
	bio?: string;
	discount?: number;
	isFavorite?: boolean;
	experience?: string; // e.g., "5 years experience"
	location?: string;
	completedJobs?: number;
	responseTime?: string; // e.g., "Within 2 hours"
	verified?: boolean;

	// Dimension props
	width?: number;
	height?: number;
	fullWidth?: boolean;

	// Event handlers
	onPress?: () => void;
	onBookPress?: () => void;
	onFavoriteToggle?: () => void;

	// Loading state
	booking?: boolean;

	// Styling customization props
	className?: string;
	imageClassName?: string;

	// Accessibility
	accessibilityLabel?: string;
}

const StarRating: React.FC<{
	rating: number;
	reviewCount?: number;
	size?: number;
}> = ({ rating, reviewCount, size = 12 }) => {
	// FIXED: Clamped rating between 0-5 to prevent UI breaks
	const clampedRating = Math.max(0, Math.min(5, rating));
	return (
		<View className="flex-row items-center gap-1">
			<View className="flex-row gap-0.5">
				{[...Array(5)].map((_, i) => {
					const difference = clampedRating - i;

					return (
						<View key={i} className="relative">
							{/* Outline star as background */}
							<AntDesign name="staro" size={size} color="#FFA500" />
							{/* Filled star overlay with dynamic width for partial fills */}
							{difference > 0 && (
								<View
									style={{
										position: 'absolute',
										width: difference >= 1 ? '100%' : `${difference * 100}%`,
										overflow: 'hidden',
									}}
								>
									<AntDesign name="star" size={size} color="#FFA500" />
								</View>
							)}
						</View>
					);
				})}
			</View>
			{/* FIXED: Added safety check for valid rating before displaying */}
			{!isNaN(clampedRating) && (
				<Text className="text-xs font-nexa text-gray-600 dark:text-gray-400">
					{clampedRating.toFixed(1)}
				</Text>
			)}
			{/* Only show review count if it's a valid positive number */}
			{reviewCount !== undefined && reviewCount > 0 && (
				<Text className="text-xs font-nexa text-gray-500 dark:text-gray-500">
					({reviewCount})
				</Text>
			)}
		</View>
	);
};

// const StatusBadge: React.FC<{ status: 'available' | 'busy' | 'on_leave' }> = ({
// 	status,
// }) => {
// 	const statusConfig = {
// 		available: {
// 			bg: 'bg-transparent',
// 			text: 'text-light-pallete-500 dark:text-light-pallete-400',
// 			label: 'Available for work',
// 			dot: COLORS.light.pallete[400],
// 		},
// 		busy: {
// 			bg: 'bg-transparent',
// 			text: 'text-orange-700 dark:text-orange-400',
// 			label: 'Busy',
// 			dot: '#F97316',
// 		},
// 		on_leave: {
// 			bg: 'bg-transparent',
// 			text: 'text-blue-700 dark:text-blue-400',
// 			label: 'On Leave',
// 			dot: '#6B7280',
// 		},
// 	};

// 	const config = statusConfig[status];

// 	return (
// 		<View
// 			className={`flex-row items-center gap-1.5 py-1 rounded-full ${config.bg}`}
// 		>
// 			<View
// 				style={{
// 					width: 8,
// 					height: 8,
// 					borderRadius: 20,
// 					backgroundColor: config.dot,
// 				}}
// 			/>
// 			<Text className={`text-xs font-nexa-bold ${config.text}`}>
// 				{config.label}
// 			</Text>
// 		</View>
// 	);
// };

/**
 * StatusBadge Component
 * Displays provider availability status with appropriate color coding and label
 *
 * @param status - Current availability status of the provider
 */
const StatusBadge: React.FC<{ status: 'available' | 'busy' | 'on_leave' }> = ({
	status,
}) => {
	// FIXED: Moved configuration outside component to prevent recreation on each render
	// Configuration for different status types
	const statusConfig = useMemo(
		() => ({
			available: {
				// bg: 'bg-green-50 dark:bg-green-900/20',
				bg: 'transparent',
				text: 'text-green-700 dark:text-green-400',
				label: 'Available',
				dot: '#10B981',
			},
			busy: {
				// bg: 'bg-orange-50 dark:bg-orange-900/20',
				bg: 'transparent',
				text: 'text-orange-700 dark:text-orange-400',
				label: 'Busy',
				dot: '#F97316',
			},
			on_leave: {
				// bg: 'bg-gray-50 dark:bg-gray-800',
				bg: 'transparent',
				text: 'text-gray-700 dark:text-gray-400',
				label: 'On Leave',
				dot: '#6B7280',
			},
		}),
		[]
	);

	const config = statusConfig[status];

	return (
		<View
			className={`flex-row items-center gap-1.5 px-0.5 py-1 rounded-full ${config.bg}`}
		>
			{/* Status indicator dot */}
			<View
				style={{
					width: 6,
					height: 6,
					borderRadius: 3,
					backgroundColor: config.dot,
				}}
			/>
			<Text className={`text-[10px] font-nexa-bold ${config.text}`}>
				{config.label}
			</Text>
		</View>
	);
};

const ServiceCard: React.FC<ServiceCardProps> = ({
	image,
	name,
	bio,
	price,
	rating = 0,
	reviewCount,
	specialities = [],
	status = 'available',
	discount,
	isFavorite = false,
	experience,
	location,
	completedJobs,
	responseTime,
	verified = false,
	width,
	height,
	fullWidth = false,
	onPress,
	onBookPress,
	onFavoriteToggle,
	booking = false,
	className,
	imageClassName,
	accessibilityLabel,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { width: screenWidth } = useWindowDimensions();

	// Calculate default dimensions
	const cardWidth = useMemo(() => {
		if (fullWidth) return screenWidth - 32;
		return width || (screenWidth - 44) / 1.6;
	}, [width, fullWidth, screenWidth]);

	const cardHeight = useMemo(() => {
		return height || cardWidth * 0.6;
	}, [height, cardWidth]);

	const imageSource = useMemo(() => {
		if (typeof image === 'string') {
			return { uri: image };
		}
		return image;
	}, [image]);
	// console.log('Rating: ', rating);
	// console.log('Review Count: ', reviewCount);

	/**
	 * Handles the book button press
	 * Prevents event bubbling to parent Pressable and validates booking conditions
	 */
	const handleBookPress = (e: any) => {
		e.stopPropagation();
		if (onBookPress && !booking && status !== 'on_leave') {
			onBookPress();
		}
	};

	/**
	 * Handles favorite toggle interaction
	 * Prevents event bubbling to parent Pressable
	 */
	const handleFavoriteToggle = (e: any) => {
		e.stopPropagation();
		if (onFavoriteToggle) {
			onFavoriteToggle();
		}
	};

	return (
		<Pressable
			onPress={onPress}
			style={{ width: cardWidth, height: cardHeight }}
			className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm p-2 flex-row ${
				className || ''
			}`}
			accessibilityLabel={accessibilityLabel || `${name} service provider card`}
			accessibilityRole="button"
			accessibilityHint="Double tap to view provider details"
		>
			{/* Profile Image Container */}
			<View className="relative rounded-xl" style={{ width: 100 }}>
				<Image
					source={imageSource}
					style={{ width: '100%', height: '100%' }}
					className={`bg-gray-100 dark:bg-gray-800  rounded-xl${
						imageClassName || ''
					}`}
					resizeMode="cover"
					accessibilityLabel={`${name}'s profile picture`}
				/>

				{/* Favorite Button */}
				{onFavoriteToggle && (
					<Pressable
						onPress={handleFavoriteToggle}
						className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full items-center justify-center shadow-md"
						hitSlop={8}
					>
						<Ionicons
							name={isFavorite ? 'heart' : 'heart-outline'}
							size={18}
							color={isFavorite ? '#EF4444' : isDark ? '#F3F4F6' : '#374151'}
						/>
					</Pressable>
				)}

				{/* discount badge with better positioning */}
				{discount && discount > 0 && (
					<View className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-full shadow-md">
						<Text className="text-[10px] font-nexa-bold text-white">
							{discount}% OFF
						</Text>
					</View>
				)}
			</View>

			{/* Content Container */}
			<View className="flex-1 pl-2 py-1">
				{/* Top Section: Provider Info */}
				<View>
					{/* Name and Verified */}
					<View className="flex-row items-center justify-between mb-1.5">
						<View className="flex-row items-center gap-1 mr-2">
							<Text
								className="text-sm font-nexa-extrabold text-gray-900 dark:text-gray-100"
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{name}
							</Text>
							{verified && (
								<Image
									source={icons.verifiedBadge}
									className="size-5"
									tintColor={COLORS.light.pallete[300]}
									resizeMode="cover"
								/>
							)}
						</View>

						{/*  price badge */}
						<View className="ml-2 bg-gray-50 dark:bg-gray-800 rounded-md p-1.5">
							<View className="flex-row items-center">
								<Image
									source={icons.rupee}
									className="size-4 mr-0.5"
									tintColor={isDark ? COLORS.gray[100] : COLORS.gray[900]}
									resizeMode="cover"
								/>
								<Text className="text-xs font-nexa-bold text-gray-900 dark:text-gray-100">
									{price}
									{/* {price.toLocaleString()} */}
								</Text>
								<Text className="text-[10px] font-nexa text-gray-500 dark:text-gray-500">
									/hr
								</Text>
							</View>
						</View>
					</View>

					{/* Rating */}
					{rating !== undefined && (
						<View className="mb-2">
							<StarRating rating={rating} reviewCount={reviewCount} />
						</View>
					)}

					{/* Bio */}
					{bio && (
						<Text
							numberOfLines={2}
							ellipsizeMode="tail"
							className="text-xs font-nexa text-gray-600 dark:text-gray-400 mb-2 leading-4"
						>
							{bio}
						</Text>
					)}

					{/* Specialities */}
					{specialities.length > 0 && (
						<View className="flex-row flex-wrap gap-1.5 mb-2">
							{specialities.slice(0, 2).map((speciality, index) => (
								<View
									key={index}
									className="bg-light-pallete-50 dark:bg-light-pallete-900/20 px-2 py-1 rounded-full border border-light-pallete-200 dark:border-light-pallete-800"
								>
									<Text
										className="text-[10px] font-nexa-bold text-light-pallete-700 dark:text-light-pallete-400"
										numberOfLines={1}
									>
										{formatServiceType(speciality)}
									</Text>
								</View>
							))}
							{specialities.length > 2 && (
								<View className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
									<Text className="text-[10px] font-nexa-bold text-gray-600 dark:text-gray-400">
										+{specialities.length - 2}
									</Text>
								</View>
							)}
						</View>
					)}
				</View>

				{/* Bottom Section: Status and Stats */}
				<View>
					{/* Status Badge */}
					<View className="mb-1">
						<StatusBadge status={status} />
					</View>

					{/* Location and Stats Row  */}
					<View className="flex-row items-center justify-between">
						{/* Location */}
						{location && (
							<View className="flex-row items-center gap-1 flex-1 mr-2">
								<Image
									source={icons.locationOutline}
									className="size-3"
									tintColor={isDark ? '#9CA3AF' : '#6B7280'}
								/>
								<Text
									className="text-[10px] font-nexa text-gray-600 dark:text-gray-400"
									numberOfLines={1}
								>
									{location}
								</Text>
							</View>
						)}
						{/* Stats */}
						<View className="flex-row items-center gap-2">
							{experience && (
								<View className="flex-row items-center gap-1.5">
									<Image
										source={icons.briefcase}
										className="size-3"
										tintColor={isDark ? '#9CA3AF' : '#6B7280'}
									/>
									<Text className="text-[10px] font-nexa text-gray-600 dark:text-gray-400">
										{experience}
									</Text>
								</View>
							)}
							{completedJobs !== undefined && completedJobs > 0 && (
								<View className="flex-row items-center gap-0.5">
									<Image
										source={icons.doubleTick}
										className="size-4"
										tintColor={isDark ? '#9CA3AF' : '#6B7280'}
									/>
									<Text className="text-[10px] font-nexa text-gray-600 dark:text-gray-400">
										{completedJobs}
									</Text>
								</View>
							)}
						</View>
						<View />
					</View>
				</View>

				{/*  Book Button & Location */}
				{/* <View className="flex-row items-center mb-1">
					{onBookPress && (
						<Pressable
							onPress={handleBookPress}
							disabled={booking || status === 'on_leave'}
							className={`px-2.5 py-2 rounded-full shadow-sm ${
								booking || status === 'on_leave'
									? 'bg-gray-300 dark:bg-gray-700'
									: 'bg-light-pallete-300 dark:bg-light-pallete-400'
							}`}
							hitSlop={8}
							accessibilityLabel="Book provider"
							accessibilityRole="button"
						>
							{booking ? (
								<LottieLoader
									animation={animations.spinner}
									color={COLORS.light.pallete[700]}
								/>
							) : (
								<Text
									className={`text-xs font-nexa-bold ${
										booking || status === 'on_leave'
											? 'text-gray-300 dark:text-gray-500'
											: 'text-gray-700'
									}`}
								>
									Book Now
								</Text>
							)}
						</Pressable>
					)}
				</View> */}
			</View>
		</Pressable>
	);
};

export default ServiceCard;
