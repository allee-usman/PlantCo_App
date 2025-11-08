// components/ImageSwiper.tsx
import { COLORS } from '@/constants/colors';
import React from 'react';
import { Dimensions, Image, StatusBar, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

interface ImageSwiperProps {
	images: string[];
	alt?: string;
}

const { width } = Dimensions.get('window');

const ImageSwiper: React.FC<ImageSwiperProps> = ({ images }) => {
	return (
		<View style={{ position: 'relative' }}>
			{/* Transparent status bar */}
			<StatusBar
				barStyle="dark-content"
				backgroundColor="transparent"
				translucent
			/>

			<SwiperFlatList
				autoplay={false}
				showPagination
				paginationStyle={{
					bottom: 0,
					backgroundColor: '#fff',
					borderRadius: 999,
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					height: 16,
					alignSelf: 'center',
					// paddingHorizontal: 4,
					// paddingVertical: 8,
				}}
				paginationStyleItemActive={{
					backgroundColor: COLORS.light.pallete[400],
					width: 20,
					height: 10,
					marginHorizontal: 4,
				}}
				paginationStyleItemInactive={{
					backgroundColor: COLORS.gray[300],
					width: 10,
					height: 10,
					marginHorizontal: 4,
				}}
				data={images}
				renderItem={({ item }) => (
					<Image
						source={{ uri: item }}
						style={{ width, height: width * 1.3 }}
						resizeMode="cover"
					/>
				)}
			/>
		</View>
	);
};

export default ImageSwiper;
