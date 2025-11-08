import { COLORS } from '@/constants/colors';
import { getBanners } from '@/services/banner.services';
import { IBanner } from '@/types/banner.types';
import { formatShortDate } from '@/utils/formatDate';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useEffect, useRef, useState } from 'react';
import {
	Dimensions,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';

interface BannerSwiperProps {
	autoplayDelay?: number;
	type: 'product' | 'service';
	onBannerPress?: (banner: IBanner) => void;
}

const { width } = Dimensions.get('window');

// Animated banner item using Moti
const BannerItem: React.FC<{ banner: IBanner; onPress?: () => void }> = ({
	banner,
	onPress,
}) => {
	// console.log(banner.startDate);

	return (
		<TouchableOpacity
			style={{ width }}
			onPress={onPress}
			activeOpacity={onPress ? 0.8 : 1}
		>
			<MotiView
				from={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ type: 'timing', duration: 600 }}
				style={{ width, height: 180 }}
			>
				<ImageBackground
					source={{ uri: banner.image.url }}
					style={{ width: '100%', height: '100%', borderRadius: 16 }}
					resizeMode="cover"
				/>
				{/* Text container */}
				<View className="absolute top-4 left-4 right-4">
					<Text className="text-light-pallete-700 font-nexa-heavy text-xl">
						{banner.title}
					</Text>
					{banner.subtitle && (
						<Text className="text-red-500 font-nexa-bold text-body mt-2">
							{banner.subtitle}
						</Text>
					)}
				</View>
				{banner.type === 'product' && banner.link && (
					<View className="absolute bottom-4 left-4 right-4  flex-row items-center justify-between me-8">
						<View className="flex-row justify-between items-center bg-light-surface px-2 w-max h-[40px]  rounded-full">
							<Text className="font-nexa-extrabold px-2">
								{banner.actionButtonLabel}
							</Text>
							<View className="size-[30px] bg-light-pallete-400 rounded-full justify-center items-center">
								<Ionicons name="chevron-forward-outline" size={20} />
							</View>
						</View>

						{/* Validateity */}
						<Text className="text-body-xs font-nexa-bold text-red-500">
							*{formatShortDate(banner.startDate!)} - *
							{formatShortDate(banner.endDate!)}
						</Text>
					</View>
				)}
			</MotiView>
		</TouchableOpacity>
	);
};

// Placeholder while loading banners
const BannerPlaceholder: React.FC = () => {
	return (
		<MotiView
			from={{ opacity: 0.3, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				type: 'timing',
				duration: 800,
				loop: true,
				repeatReverse: true,
			}}
			style={styles.placeholder}
		/>
	);
};

const PromotionalBannerSwiper: React.FC<BannerSwiperProps> = React.memo(
	({ autoplayDelay = 3, type = 'product', onBannerPress }) => {
		const [banners, setBanners] = useState<IBanner[]>([]);
		const [loading, setLoading] = useState(false);
		const bannerRef = useRef<SwiperFlatList>(null);

		useEffect(() => {
			const fetchBanners = async () => {
				try {
					setLoading(true);
					const data = await getBanners(type);
					setBanners(data);
				} catch (error) {
					console.log('❌ Error fetching banners:', error);
				} finally {
					setLoading(false);
				}
			};
			fetchBanners();
		}, [type]);

		if (loading) return <BannerPlaceholder />;

		if (!banners.length) return null;

		return (
			<SwiperFlatList
				ref={bannerRef}
				style={styles.swiper}
				data={banners}
				autoplay
				autoplayDelay={autoplayDelay}
				autoplayLoop
				showPagination
				paginationStyleItemInactive={styles.dot}
				paginationStyleItemActive={styles.activeDot}
				paginationStyle={styles.pagination}
				renderItem={({ item }) => (
					<BannerItem banner={item} onPress={() => onBannerPress?.(item)} />
				)}
			/>
		);
	}
);

const styles = StyleSheet.create({
	swiper: {
		borderRadius: 16,
		overflow: 'hidden',
		height: 180,
	},
	placeholder: {
		width: width - 32,
		height: 160,
		borderRadius: 16,
		backgroundColor: '#E1E9EE',
		alignSelf: 'center',
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 999,
		backgroundColor: 'rgba(88,95,113,0.20)',
		marginHorizontal: 4,
	},
	activeDot: {
		width: 20,
		height: 10,
		borderRadius: 999,
		backgroundColor: COLORS.light.pallete[400],
		marginHorizontal: 4,
	},
	pagination: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 14,
		borderRadius: 999,
		alignSelf: 'center',
		position: 'absolute',
		bottom: -30,
		left: 0,
		right: 0,
	},
});

PromotionalBannerSwiper.displayName = 'BannerSwiper';
export default PromotionalBannerSwiper;
