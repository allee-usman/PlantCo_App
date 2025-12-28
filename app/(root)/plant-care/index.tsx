// screens/ServicesScreen.tsx - Updated version with refresh capability

import HomeHeader from '@/components/HomeHeader';
import { ServicesTab } from '@/components/ServicesTab';
import {
	HEADER_MAX_HEIGHT,
	HEADER_MIN_HEIGHT,
	HEADER_SCROLL_DISTANCE,
} from '@/constants/constant';
import { useTabData } from '@/hooks/useTabData';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ServicesScreen = () => {
	const scrollY = useRef(new Animated.Value(0)).current;
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { activeTabId, handleTabPress } = useTabData();
	const [refreshing, setRefreshing] = useState(false);

	const headerHeight = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
		extrapolate: 'clamp',
	});

	const headerShadowOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE - 10, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 0, 1],
		extrapolate: 'clamp',
	});

	const handleRefresh = useCallback(async () => {
		setRefreshing(true);

		try {
			// Simulate refresh or trigger actual data refresh
			// The ServiceSectionRenderer components will refetch their data
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// You can dispatch a refresh action here if using Redux
			// or trigger a refetch in your data fetching hooks
		} catch (error) {
			console.error('Refresh failed:', error);
		} finally {
			setRefreshing(false);
		}
	}, []);

	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['bottom', 'left', 'right']}
		>
			<StatusBar
				barStyle={isDark ? 'light-content' : 'dark-content'}
				translucent
				backgroundColor="transparent"
			/>
			<HomeHeader
				scrollY={scrollY}
				variant="service"
				isDark={isDark}
				activeTabId={activeTabId}
				onTabPress={handleTabPress}
				headerHeight={headerHeight}
				headerShadowOpacity={headerShadowOpacity}
			/>
			<View className="flex-1">
				<ServicesTab
					scrollY={scrollY}
					onRefresh={handleRefresh}
					refreshing={refreshing}
				/>
			</View>
		</SafeAreaView>
	);
};

export default ServicesScreen;
