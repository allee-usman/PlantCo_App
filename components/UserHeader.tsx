import { animations } from '@/constants/animations';
import { icons } from '@/constants/icons';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import LottieLoader from './LottieLoader';

interface User {
	username?: string;
}

type HeaderVariant = 'default' | 'location' | 'greeting';

interface UserHeaderProps {
	scrollY: Animated.Value;
	HEADER_SCROLL_DISTANCE: number;
	variant?: HeaderVariant;
	onCartPress?: () => void;
	onLocationPress?: () => void;
	province?: string;
	country?: string;
	fullAddress?: string;
	isLoadingLocation?: boolean;
	showNotification?: boolean;
	showMessage?: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({
	scrollY,
	HEADER_SCROLL_DISTANCE,
	variant = 'default',
	onLocationPress,
	province = '',
	country = '',
	fullAddress = '',
	isLoadingLocation = false,
	showNotification = true,
	showMessage = true,
}) => {
	const greetingOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
		outputRange: [1, 0],
		extrapolate: 'clamp',
	});

	const greetingTranslateY = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
		outputRange: [0, -20],
		extrapolate: 'clamp',
	});

	const { user } = useAppSelector((state: RootState) => state.auth);

	const greetingMsg = useMemo(() => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good Morning!';
		if (hour < 18) return 'Good Afternoon!';
		return 'Good Evening!';
	}, []);

	const handleNotificationPress = () =>
		router.push('/(root)/home/notifications');
	const handleCartPress = () => router.push('/(root)/home/message');

	const locationText = useMemo(() => {
		if (isLoadingLocation) return 'Loading...';
		if (!province && !country) return 'Select Location';
		if (province && country) return `${province}, ${country}`;
		return province || country || 'Select Location';
	}, [province, country, isLoadingLocation]);

	const renderLeftContent = () => {
		switch (variant) {
			case 'greeting':
				return (
					<View className="flex-row items-center flex-1">
						<TouchableOpacity onPress={() => router.push('/(root)/account')}>
							<Image
								source={{ uri: user?.avatar.url }}
								className="w-[40px] h-[40px] rounded-full mr-3"
								onError={() => console.log('Failed to load avatar')}
							/>
						</TouchableOpacity>
						<View>
							<Text className="text-xs font-nexa dark:text-gray-300 text-gray-600">
								Hi, {(user as User)?.username || 'Guest'} 👋
							</Text>
							<Text className="text-sm text-gray-950 dark:text-white font-nexa-heavy mt-[1px]">
								{greetingMsg}
							</Text>
						</View>
					</View>
				);

			case 'location':
				return (
					<TouchableOpacity
						onPress={onLocationPress}
						className="flex-row items-center flex-1"
						disabled={isLoadingLocation}
					>
						<View className="rounded-full mr-1 justify-center items-center">
							{isLoadingLocation ? (
								<LottieLoader animation={animations.spinner} />
							) : (
								<Image
									source={icons.locationOutline || icons.notificationOutline}
									className="w-[25px] h-[25px]"
									resizeMode="contain"
									tintColor="black"
								/>
							)}
						</View>
						<View className="flex-1">
							<Text className="text-xs font-nexa dark:text-gray-300 text-gray-600">
								Your Location
							</Text>
							<View className="flex-row items-center">
								<Text
									className="text-sm text-gray-950 dark:text-white font-nexa-heavy mt-[1px]"
									numberOfLines={1}
								>
									{fullAddress}
								</Text>
								{!isLoadingLocation && (
									<Image
										source={icons.arrowDown || icons.notificationOutline}
										className="w-[16px] h-[16px] ml-1"
										resizeMode="contain"
										tintColor="black"
									/>
								)}
							</View>
						</View>
					</TouchableOpacity>
				);

			default:
				return (
					<View className="flex-row items-center flex-1">
						<TouchableOpacity onPress={() => router.push('/(root)/account')}>
							<Image
								source={{ uri: user?.avatar.url }}
								className="w-[40px] h-[40px] rounded-full mr-3"
								onError={() => console.log('Failed to load avatar')}
							/>
						</TouchableOpacity>
						<View>
							<Text className="text-xs font-nexa dark:text-gray-300 text-gray-600">
								Hi, {(user as User)?.username || 'Guest'} 👋
							</Text>
							<Text className="text-sm text-gray-950 dark:text-white font-nexa-heavy mt-[1px]">
								{greetingMsg}
							</Text>
						</View>
					</View>
				);
		}
	};

	return (
		<Animated.View
			style={{
				opacity: greetingOpacity,
				transform: [{ translateY: greetingTranslateY }],
			}}
			className="px-5"
		>
			<View className="flex-row items-center justify-between mb-4">
				{/* header left */}
				{renderLeftContent()}

				{/* header right */}
				<View className="flex-row items-center">
					{showNotification && (
						<TouchableOpacity
							accessibilityRole="button"
							accessibilityLabel="Notifications"
							accessibilityHint="View your notifications"
							className="w-[40px] h-[40px] justify-center items-center relative mr-3 bg-light-surface rounded-full"
							onPress={handleNotificationPress}
						>
							<Image
								source={icons.notificationOutline}
								resizeMode="contain"
								tintColor="black"
								style={{ width: 24, height: 24 }}
							/>
							{/* notification dot */}
							<View className="absolute top-[3px] right-[0px] w-[10px] h-[10px] bg-red-500 rounded-full" />
						</TouchableOpacity>
					)}
					{showMessage && (
						<TouchableOpacity
							accessibilityRole="button"
							accessibilityLabel="Cart"
							accessibilityHint="View your cart"
							className="w-[40px] h-[40px] justify-center items-center relative bg-light-surface rounded-full"
							onPress={handleCartPress}
						>
							<Image
								source={icons.messageOutline}
								resizeMode="contain"
								tintColor="black"
								style={{ width: 24, height: 24 }}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</Animated.View>
	);
};

export default UserHeader;
