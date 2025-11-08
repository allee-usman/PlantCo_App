// components/sections/BestSellers.tsx
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Item = { id: number; name: string; type?: string };

const BestSellers = ({
	data,
	onItemPress,
}: {
	data: Item[];
	onItemPress?: (item: Item) => void;
}) => {
	return (
		<View className="mb-6 px-5">
			<Text className="text-lg font-nexa-heavy mb-3">Best Sellers</Text>

			{data.map((item) => (
				<TouchableOpacity
					key={item.id}
					className="mb-3 p-4 rounded-xl border bg-white"
					onPress={() => onItemPress?.(item)}
				>
					<Text className="text-base">{item.name}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default memo(BestSellers);
