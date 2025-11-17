import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View, useColorScheme } from 'react-native';

interface CategoryCardProps {
	name: string;
	icon?: string;
	iconName?: keyof typeof Ionicons.glyphMap;
	iconType?: 'image' | 'ionicon';
	bgColor?: string;
	iconColor?: string;
	onPress?: () => void;
	variant?: 'default' | 'compact' | 'pill';
	showShadow?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
	name,
	icon,
	iconName,
	iconType = 'ionicon',
	bgColor,
	iconColor = '#FF6B6B',
	onPress,
	variant = 'default',
	showShadow = true,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	// Dynamic background color based on theme
	const backgroundColor =
		bgColor || (isDark ? '#1F2937' : COLORS.light.surface);

	// Render based on variant
	if (variant === 'compact') {
		return (
			<Pressable
				onPress={onPress}
				android_ripple={{ color: 'rgba(0, 0, 0, 0.08)' }}
				style={({ pressed }) => [
					{
						opacity: pressed ? 0.85 : 1,
						backgroundColor,
					},
				]}
				className="items-center p-3 rounded-2xl min-w-[90px]"
			>
				{/* Icon Container */}
				<View
					className="w-14 h-14 items-center justify-center mb-2 rounded-full bg-white dark:bg-gray-800"
					style={{
						shadowColor: showShadow ? '#000' : 'transparent',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.1,
						shadowRadius: 4,
						elevation: showShadow ? 3 : 0,
					}}
				>
					{iconType === 'image' && icon ? (
						<Image
							source={{ uri: icon }}
							style={{ width: 44, height: 44, borderRadius: 22 }}
							resizeMode="cover"
						/>
					) : iconName ? (
						<Ionicons name={iconName} size={28} color={iconColor} />
					) : null}
				</View>

				{/* Category Name */}
				<Text
					numberOfLines={2}
					className="text-center text-xs font-nexa-bold text-gray-800 dark:text-gray-100"
				>
					{name}
				</Text>
			</Pressable>
		);
	}

	if (variant === 'pill') {
		return (
			<Pressable
				onPress={onPress}
				android_ripple={{ color: 'rgba(0, 0, 0, 0.08)' }}
				style={({ pressed }) => [
					{
						opacity: pressed ? 0.85 : 1,
						backgroundColor,
						shadowColor: showShadow ? '#000' : 'transparent',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.08,
						shadowRadius: 8,
						elevation: showShadow ? 2 : 0,
					},
				]}
				className="items-center justify-center p-1.5 flex-row gap-x-2 rounded-full bg-light-surface pr-3"
			>
				{/* Icon Container */}
				<View className="w-[40px] h-[40px] items-center justify-center rounded-full bg-white dark:bg-gray-800">
					{iconType === 'image' && icon ? (
						<Image
							source={{ uri: icon }}
							style={{ width: 36, height: 36, borderRadius: 18 }}
							resizeMode="cover"
						/>
					) : iconName ? (
						<Ionicons name={iconName} size={20} color={iconColor} />
					) : null}
				</View>

				{/* Category Name */}
				<Text
					numberOfLines={1}
					className="text-sm font-nexa-bold text-gray-800 dark:text-gray-100"
				>
					{name}
				</Text>
			</Pressable>
		);
	}

	// Default variant - Card style
	return (
		<Pressable
			onPress={onPress}
			android_ripple={{ color: 'rgba(0, 0, 0, 0.08)' }}
			style={({ pressed }) => [
				{
					opacity: pressed ? 0.85 : 1,
					backgroundColor,
					shadowColor: showShadow ? '#000' : 'transparent',
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: showShadow ? 4 : 0,
				},
			]}
			className="items-center p-4 rounded-2xl min-w-[110px]"
		>
			{/* Icon Container with gradient-like effect */}
			<View
				className="w-16 h-16 items-center justify-center mb-3 rounded-2xl bg-white dark:bg-gray-800"
				style={{
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 3,
				}}
			>
				{iconType === 'image' && icon ? (
					<Image
						source={{ uri: icon }}
						style={{ width: 48, height: 48, borderRadius: 12 }}
						resizeMode="cover"
					/>
				) : iconName ? (
					<Ionicons name={iconName} size={32} color={iconColor} />
				) : null}
			</View>

			{/* Category Name */}
			<Text
				numberOfLines={2}
				className="text-center text-sm font-nexa-bold text-gray-800 dark:text-gray-100 leading-tight"
			>
				{name}
			</Text>
		</Pressable>
	);
};

export default CategoryCard;
