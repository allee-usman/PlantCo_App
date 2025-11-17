import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
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
import LottieLoader from './LottieLoader';

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

	// Callback props
	onPress?: () => void;
	onBookPress?: () => void;
	onFavoriteToggle?: () => void;

	// Loading state
	booking?: boolean;

	// Style props
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
	return (
		<View className="flex-row items-center gap-1">
			<View className="flex-row gap-0.5">
				{[...Array(5)].map((_, i) => {
					const difference = rating - i;

					return (
						<View key={i} className="relative">
							<AntDesign name="staro" size={size} color="#FFA500" />
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
			<Text className="text-xs font-nexa text-gray-500 dark:text-gray-400">
				{rating.toFixed(1)}
			</Text>
			{reviewCount !== undefined && reviewCount > 0 && (
				<Text className="text-xs font-nexa text-gray-500 dark:text-gray-500">
					({reviewCount})
				</Text>
			)}
		</View>
	);
};

const StatusBadge: React.FC<{ status: 'available' | 'busy' | 'on_leave' }> = ({
	status,
}) => {
	const statusConfig = {
		available: {
			bg: 'bg-transparent',
			text: 'text-light-pallete-500 dark:text-light-pallete-400',
			label: 'Available for work',
			dot: COLORS.light.pallete[400],
		},
		busy: {
			bg: 'bg-transparent',
			text: 'text-orange-700 dark:text-orange-400',
			label: 'Busy',
			dot: '#F97316',
		},
		on_leave: {
			bg: 'bg-transparent',
			text: 'text-blue-700 dark:text-blue-400',
			label: 'On Leave',
			dot: '#6B7280',
		},
	};

	const config = statusConfig[status];

	return (
		<View
			className={`flex-row items-center gap-1.5 py-1 rounded-full ${config.bg}`}
		>
			<View
				style={{
					width: 8,
					height: 8,
					borderRadius: 20,
					backgroundColor: config.dot,
				}}
			/>
			<Text className={`text-xs font-nexa-bold ${config.text}`}>
				{config.label}
			</Text>
		</View>
	);
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
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

	const handleBookPress = (e: any) => {
		e.stopPropagation();
		if (onBookPress && !booking && status !== 'on_leave') {
			onBookPress();
		}
	};

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

				{/* Discount Badge */}
				{/* {discount && discount > 0 && (
					<View className="absolute bottom-2 right-2 bg-red-500 px-2 py-1 rounded-full">
						<Text className="text-xs font-nexa-bold text-white">
							{discount}% OFF
						</Text>
					</View>
				)} */}
			</View>

			{/* Content Container */}
			<View className="flex-1 pl-3 py-1 justify-between ">
				{/* Provider Info */}
				<View className="mb-2">
					{/* Name and Verified */}
					<View className="flex-row items-center justify-between mb-2">
						<View className="flex-row items-center gap-1">
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

						<View className="ml-2 bg-gray-50 dark:bg-gray-800 rounded-md p-1.5">
							<View className="flex-row items-center">
								<Image
									source={icons.rupee}
									className="size-5 mr-0.5"
									tintColor={isDark ? COLORS.gray[100] : COLORS.gray[900]}
									resizeMode="cover"
								/>
								<Text className="text-xs font-nexa-bold text-gray-900 dark:text-gray-100">
									{price.toLocaleString()}
								</Text>
								<Text className="text-[10px] font-nexa text-gray-500 dark:text-gray-500">
									/hr
								</Text>
							</View>
						</View>
					</View>

					{/* Bio */}
					{bio && (
						<Text
							className="text-xs font-nexa text-gray-500 dark:text-gray-400 mb-2"
							numberOfLines={2}
							ellipsizeMode="tail"
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
									className="bg-light-pallete-50 dark:bg-light-pallete-900/20 px-2 py-0.5 rounded-full"
								>
									<Text
										className="text-xs font-nexa text-light-pallete-700 dark:text-light-pallete-400"
										numberOfLines={1}
									>
										{speciality}
									</Text>
								</View>
							))}
							{specialities.length > 2 && (
								<View className="bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full">
									<Text className="text-xs font-nexa text-gray-700 dark:text-gray-400">
										+{specialities.length - 2}
									</Text>
								</View>
							)}
						</View>
					)}

					{/* Status Badge */}
					<View className="">
						<StatusBadge status={status} />
					</View>
				</View>

				{/* Rating */}
				{rating > 0 && (
					<View className="mb-2">
						<StarRating rating={rating} reviewCount={reviewCount} />
					</View>
				)}

				{/* Stats Row */}
				<View className="flex-row items-center flex-wrap gap-x-3 gap-y-1 mb-2">
					{experience && (
						<View className="flex-row items-center gap-1">
							<Image
								source={icons.suitcase}
								className="size-4"
								tintColor={isDark ? '#9CA3AF' : '#6B7280'}
							/>
							<Text className="text-xs font-nexa text-gray-500 dark:text-gray-400">
								{experience}
							</Text>
						</View>
					)}
					{completedJobs !== undefined && completedJobs > 0 && (
						<View className="flex-row items-center gap-1">
							<Image
								source={icons.reputation}
								className="size-6"
								tintColor={isDark ? '#9CA3AF' : '#6B7280'}
							/>
							<Text className="text-xs font-nexa text-gray-500 dark:text-gray-400">
								{completedJobs} jobs
							</Text>
						</View>
					)}
				</View>

				{/*  Book Button & Location */}
				<View className="flex-row items-center">
					{/* Location */}
					{location && (
						<View className="mr-2 flex-row items-center gap-1 flex-1">
							<Image
								source={icons.locationOutline}
								className="size-[16px]"
								tintColor={isDark ? '#9CA3AF' : '#6B7280'}
							/>
							<Text
								className="text-xs font-nexa text-gray-500 dark:text-gray-400"
								numberOfLines={1}
							>
								{location}
							</Text>
						</View>
					)}
					{/* Book Button */}
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
				</View>
			</View>
		</Pressable>
	);
};

export default ServiceCard;
