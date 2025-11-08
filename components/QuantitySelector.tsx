import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';

interface QuantitySelectorProps {
	quantity: number;
	onIncrease: () => void;
	onDecrease: () => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
	quantity,
	onIncrease,
	onDecrease,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<View className="mb-6">
			<Text className="text-body-sm font-nexa-bold text-gray-900 dark:text-gray-100 mb-3">
				Quantity
			</Text>
			<View className="flex-row items-center border border-gray-400 dark:border-gray-600 rounded-full px-2 py-2 w-[120px] justify-between">
				<Pressable
					onPress={onDecrease}
					hitSlop={8}
					className="border rounded-full border-gray-400 dark:border-gray-600"
				>
					<Ionicons
						name="remove"
						size={20}
						color={isDark ? '#9CA3AF' : COLORS.gray[500]}
					/>
				</Pressable>
				<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 w-8 text-center">
					{quantity}
				</Text>
				<Pressable
					onPress={onIncrease}
					hitSlop={8}
					className="border rounded-full border-gray-400 dark:border-gray-600"
				>
					<Ionicons
						name="add"
						size={20}
						color={isDark ? '#9CA3AF' : COLORS.gray[500]}
					/>
				</Pressable>
			</View>
		</View>
	);
};
