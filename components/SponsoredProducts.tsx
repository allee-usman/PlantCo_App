// components/sections/NewArrivals.tsx
import React, { memo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

type Item = { id: number; name: string; type?: string };

const NewArrivals = ({
	data,
	onItemPress,
}: {
	data: Item[];
	onItemPress?: (item: Item) => void;
}) => {
	return (
		<View className="mb-6">
			<View className="px-5">
				<Text className="text-lg font-nexa-heavy mb-3">New Arrivals</Text>
			</View>

			<FlatList
				data={data}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
				keyExtractor={(i) => `${i.id}`}
				renderItem={({ item }) => (
					<TouchableOpacity
						className="mr-3 w-56 p-3 rounded-xl border bg-white"
						activeOpacity={0.85}
						onPress={() => onItemPress?.(item)}
					>
						<Text className="text-base font-nexa-heavy">{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};

export default memo(NewArrivals);
