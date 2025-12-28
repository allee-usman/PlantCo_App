import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Service } from '@/types/service.types';
import { formatServiceType } from '@/utils/service.utils';
import { Image, Pressable, Text, useColorScheme, View } from 'react-native';

interface ListingCardProps {
	listing: Service;
	onPress?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress }) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<Pressable
			onPress={onPress}
			className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-gray-800 active:opacity-90"
		>
			<View className="flex-row p-3">
				{/* Service Image */}
				<View
					className="rounded-lg overflow-hidden justify-center items-center bg-gray-100 dark:bg-gray-800"
					style={{ width: 90, height: 90 }}
				>
					<Image
						source={listing.image?.url ? { uri: listing.image.url } : undefined}
						style={{ width: '100%', height: '100%' }}
						className="bg-gray-100 dark:bg-gray-800"
						resizeMode="cover"
					/>
					{/* Service Type Badge */}
					<View className="bg-orange-100/95 dark:bg-orange-900/90 px-2 py-0.5 rounded-md align-self-start absolute bottom-1.5 left-1.5">
						<Text className="text-[9px] rounded-full font-nexa-bold text-orange-700 dark:text-orange-300">
							{formatServiceType(listing.serviceType)}
						</Text>
					</View>

					{/* Active Status Indicator */}
					{listing.active && (
						<View className="absolute top-1.5 right-1.5 bg-green-500 rounded-full w-2 h-2" />
					)}
				</View>

				{/* Service Info */}
				<View className="flex-1 ml-3 justify-between">
					{/* Title & Description */}
					<View className="flex-1">
						<Text
							className="text-sm font-nexa-extrabold text-gray-900 dark:text-gray-100 mb-1"
							numberOfLines={1}
						>
							{listing.title}
						</Text>

						{listing.description && (
							<Text
								className="text-xs font-nexa text-gray-600 dark:text-gray-400 mb-1 leading-4"
								numberOfLines={2}
							>
								{listing.description}
							</Text>
						)}

						{/* Rating */}
						{listing.meta?.rating > 0 && (
							<View className="flex-row items-center gap-1 mt-0.5">
								<Image
									source={icons.star}
									className="size-3"
									tintColor={COLORS.light.pallete[500]}
								/>
								<Text className="text-xs font-nexa-bold text-gray-700 dark:text-gray-300">
									{listing.meta.rating.toFixed(1)}
								</Text>
							</View>
						)}
					</View>

					{/* Pricing & Duration */}
					<View className="flex-row items-center justify-between mt-2">
						{/* Hourly Rate */}
						<View className="bg-light-pallete-50 dark:bg-light-pallete-900/30 rounded-lg px-2 py-1 border border-light-pallete-200 dark:border-light-pallete-800">
							<View className="flex-row items-center">
								<Image
									source={icons.rupee}
									className="size-5 mr-0.5"
									tintColor={
										isDark
											? COLORS.light.pallete[300]
											: COLORS.light.pallete[600]
									}
								/>
								<Text className="text-xs font-nexa-bold text-light-pallete-700 dark:text-light-pallete-300">
									{listing.hourlyRate}
								</Text>
								<Text className="text-xs font-nexa text-light-pallete-600 dark:text-light-pallete-400 ml-0.5">
									/hr
								</Text>
							</View>
						</View>

						{/* Duration Badge */}
						{listing.durationHours > 0 && (
							<View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2.5 py-1.5">
								<Image
									source={icons.clock}
									className="size-4 mr-1"
									tintColor={isDark ? COLORS.gray[400] : COLORS.gray[600]}
								/>
								<Text className="text-xs font-nexa-bold text-gray-600 dark:text-gray-400">
									{listing.durationHours}h
								</Text>
							</View>
						)}
					</View>

					{/* Tags */}
					{listing.meta?.tags && listing.meta.tags.length > 0 && (
						<View className="flex-row flex-wrap gap-1 mt-2">
							{listing.meta.tags.slice(0, 2).map((tag, index) => (
								<View
									key={index}
									className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5"
								>
									<Text className="text-[9px] font-nexa text-gray-600 dark:text-gray-400">
										{tag}
									</Text>
								</View>
							))}
						</View>
					)}
				</View>
			</View>
		</Pressable>
	);
};

export default ListingCard;
