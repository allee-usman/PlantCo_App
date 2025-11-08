import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface CategoryCardProps {
	name: string;
	icon?: string;
	iconName?: keyof typeof Ionicons.glyphMap;
	iconType?: 'image' | 'ionicon';
	bgColor?: string;
	iconColor?: string;
	onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
	name,
	icon,
	iconName,
	iconType = 'ionicon',
	bgColor = COLORS.light.pallete[100],
	iconColor = '#FF6B6B',
	onPress,
}) => {
	return (
		<Pressable
			onPress={onPress}
			android_ripple={{ color: 'rgba(0, 0, 0, 0.05)' }}
			style={({ pressed }) => [
				{
					opacity: pressed ? 0.8 : 1,
				},
				{ backgroundColor: bgColor },
			]}
			className="rounded-2xl items-center justify-center"
		>
			{/* Icon Container */}
			<View className="w-14 h-14 items-center justify-center mb-2 rounded-full">
				{iconType === 'image' && icon ? (
					<Image
						source={{ uri: icon }}
						style={{ width: 48, height: 48, borderRadius: 999 }}
						resizeMode="cover"
					/>
				) : iconName ? (
					<Ionicons name={iconName} size={48} color={iconColor} />
				) : null}
			</View>

			{/* Category Name */}
			<Text
				numberOfLines={2}
				className="text-center text-xs font-nexa-bold text-gray-800"
			>
				{name}
			</Text>
		</Pressable>
	);
};

export default CategoryCard;
