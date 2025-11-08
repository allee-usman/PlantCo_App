// src/components/CategoryItem.tsx
import { images } from '@/constants/images';
import { Category } from '@/interfaces/interface';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

interface CategoryItemProps {
	category: Category;
	onPress: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onPress }) => {
	const pillContainerStyle =
		'items-center flex-row rounded-full py-[14px] px-[16px]';
	// const iconContainerStyle = `w-12 h-12 rounded-full items-center justify-center mr-2 ${category.color}`;
	const textStyle = 'text-body-sm text-center';

	// PERFORMANCE: Memoize press handler to prevent unnecessary re-renders
	const handlePress = React.useCallback(() => {
		onPress(category.id);
	}, [category.id, onPress]);

	if (category.isActive) {
		return (
			// CONSISTENCY FIX: Wrapper View to control exact dimensions and spacing
			<View className="mr-2">
				<ImageBackground
					source={images.categoryLightBg}
					resizeMode="cover"
					className="overflow-hidden rounded-full"
				>
					<TouchableOpacity
						onPress={handlePress}
						className={`${pillContainerStyle} pr-4`}
						activeOpacity={0.7}
					>
						<Text className={`${textStyle} text-white pr-1 font-nexa-bold`}>
							{' '}
							{category.title}
						</Text>
					</TouchableOpacity>
				</ImageBackground>
			</View>
		);
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			className={`${pillContainerStyle} pr-4 mr-2 bg-light-surface dark:bg-gray-700`}
			activeOpacity={0.7}
		>
			{/* <View className={iconContainerStyle}>
				<Image
					source={{ uri: category.icon }}
					className="w-8 h-8"
					resizeMode="contain"
				/>
			</View> */}
			<Text className={`${textStyle} dark:text-white pr-1`}>
				{' '}
				{category.title}
			</Text>
		</TouchableOpacity>
	);
};

export default CategoryItem;
