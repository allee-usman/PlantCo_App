// components/ServicesTab.tsx - Optimized version with better performance

import { CONTENT_TOP_PADDING, SERVICE_SECTIONS } from '@/constants/constant';
import React, { useCallback } from 'react';
import { Animated, RefreshControl } from 'react-native';
import { ServiceSectionRenderer } from './ServiceSectionRenderer';

interface ServicesTabProps {
	scrollY: Animated.Value;
	onRefresh?: () => void;
	refreshing?: boolean;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
	scrollY,
	onRefresh,
	refreshing = false,
}) => {
	// Memoize the key extractor
	const keyExtractor = useCallback((item: any) => item.id.toString(), []);

	// Memoize the render item
	const renderItem = useCallback(
		({ item }: any) => (
			<ServiceSectionRenderer section={item} activeTab="services" />
		),
		[]
	);

	// Memoize the content container style
	const contentContainerStyle = React.useMemo(
		() => ({
			paddingTop: CONTENT_TOP_PADDING,
			paddingBottom: 100,
		}),
		[]
	);

	// Memoize the scroll event handler
	const handleScroll = React.useMemo(
		() =>
			Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
				useNativeDriver: false,
			}),
		[scrollY]
	);

	return (
		<Animated.FlatList
			data={SERVICE_SECTIONS}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			contentContainerStyle={contentContainerStyle}
			showsVerticalScrollIndicator={false}
			scrollEventThrottle={16}
			onScroll={handleScroll}
			removeClippedSubviews={true}
			maxToRenderPerBatch={3}
			updateCellsBatchingPeriod={100}
			initialNumToRender={2}
			windowSize={5}
			refreshControl={
				onRefresh ? (
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#059669"
					/>
				) : undefined
			}
		/>
	);
};
