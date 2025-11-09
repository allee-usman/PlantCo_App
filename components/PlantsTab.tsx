import { CONTENT_TOP_PADDING, PLANT_SECTIONS } from '@/constants/constant';
import React from 'react';
import { Animated } from 'react-native';
import { SectionRenderer } from './SectionRenderer';

export const PlantsTab = ({ scrollY }: any) => {
	return (
		<Animated.FlatList
			data={PLANT_SECTIONS}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<SectionRenderer section={item} activeTab="products" />
			)}
			contentContainerStyle={{
				paddingTop: CONTENT_TOP_PADDING,
				paddingBottom: 70,
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
