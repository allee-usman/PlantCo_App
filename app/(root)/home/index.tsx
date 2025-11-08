import HomeHeader from '@/components/HomeHeader';
import { PlantsTab } from '@/components/PlantsTab';
import { ServicesTab } from '@/components/ServicesTab';
import {
	HEADER_MAX_HEIGHT,
	HEADER_MIN_HEIGHT,
	HEADER_SCROLL_DISTANCE,
} from '@/constants/constant';
import { useTabData } from '@/hooks/useTabData';
import { useColorScheme } from 'nativewind';
import React, { useRef } from 'react';
import { Animated, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
	const scrollY = useRef(new Animated.Value(0)).current;
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { activeTabId, handleTabPress } = useTabData();

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
				isDark={isDark}
				activeTabId={activeTabId}
				onTabPress={handleTabPress}
				headerHeight={headerHeight}
				headerShadowOpacity={headerShadowOpacity}
				variant="greeting"
			/>

			<View>
				{activeTabId === 'products' ? (
					<PlantsTab scrollY={scrollY} />
				) : (
					<ServicesTab scrollY={scrollY} />
				)}
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
