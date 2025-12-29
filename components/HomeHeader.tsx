// src/screens/Home/components/HomeHeader.tsx
import SearchBar from '@/components/SearchBar';
import UserHeader from '@/components/UserHeader';
import { COLORS } from '@/constants/colors';
import { images } from '@/constants/images';
import { useUserLocation } from '@/hooks/useUserLocation';
import React, { useCallback } from 'react';
import { Animated, ImageBackground, StyleSheet, View } from 'react-native';

interface Props {
	scrollY: Animated.Value;
	isDark: boolean;
	variant?: 'default' | 'service' | 'greeting';
	headerHeight: any;
	headerShadowOpacity: any;
}

const HEADER_SCROLL_DISTANCE = 120;

const HomeHeader = ({
	scrollY,
	isDark,
	variant = 'greeting',

	headerHeight,
	headerShadowOpacity,
}: Props) => {
	const { fullAddress, province, country, isLoading, refetch } =
		useUserLocation();

	const renderContent = useCallback(
		() => (
			<View className="flex-1 justify-end">
				{variant === 'greeting' && (
					<UserHeader
						scrollY={scrollY}
						HEADER_SCROLL_DISTANCE={HEADER_SCROLL_DISTANCE}
						onCartPress={() => console.log('Cart')}
						variant={variant}
					/>
				)}

				{variant === 'service' && (
					<UserHeader
						scrollY={scrollY}
						HEADER_SCROLL_DISTANCE={HEADER_SCROLL_DISTANCE}
						variant="location"
						province={province}
						country={country}
						fullAddress={fullAddress}
						isLoadingLocation={isLoading}
						onLocationPress={refetch} // Refetch on press
					/>
				)}
				<View className="px-5 mb-4">
					<SearchBar
						variant={variant}
						showFilterIcon={true}
						onSearch={(query) => console.log('Searching:', query)}
					/>
				</View>
			</View>
		),
		[fullAddress, country, isLoading, province, refetch, scrollY, variant]
	);

	return (
		<Animated.View
			style={[
				styles.header,
				{
					height: headerHeight,
					borderBottomColor: isDark ? COLORS.gray[600] : COLORS.gray[300],
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 3 },
					shadowOpacity: headerShadowOpacity,
					shadowRadius: 4,
					elevation: scrollY.interpolate({
						inputRange: [0, HEADER_SCROLL_DISTANCE],
						outputRange: [0, 4],
						extrapolate: 'clamp',
					}),
				},
			]}
		>
			{!isDark ? (
				<ImageBackground
					source={images.headerBgLight}
					resizeMode="cover"
					className="flex-1"
				>
					{renderContent()}
				</ImageBackground>
			) : (
				<View className="flex-1 bg-gray-950">{renderContent()}</View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
});

export default HomeHeader;
