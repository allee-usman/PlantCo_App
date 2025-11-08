import { CONTENT_TOP_PADDING, SERVICE_SECTIONS } from '@/constants/constant';
import React from 'react';
import { Animated } from 'react-native';
import { ServiceSectionRenderer } from './ServiceSectionRenderer';

export const ServicesTab = ({ scrollY }: any) => {
	return (
		<Animated.FlatList
			data={SERVICE_SECTIONS}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<ServiceSectionRenderer section={item} activeTab="services" />
			)}
			contentContainerStyle={{
				paddingTop: CONTENT_TOP_PADDING,
				paddingBottom: 100,
			}}
			showsVerticalScrollIndicator={false}
			scrollEventThrottle={16}
			onScroll={Animated.event(
				[{ nativeEvent: { contentOffset: { y: scrollY } } }],
				{ useNativeDriver: false }
			)}
		/>
	);
};
