import { shippingOptions } from '@/constants/constant';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ShippingMethodSelector: React.FC<{
	selected: string;
	onSelect: (id: string) => void;
}> = ({ selected, onSelect }) => {
	return (
		<View className="gap-y-3">
			{shippingOptions.map((option) => {
				const isSelected = selected === option.id;

				return (
					<TouchableOpacity
						key={option.id}
						activeOpacity={0.8}
						onPress={() => onSelect(option.id)}
						className={`flex-row items-center px-2 py-3 rounded-lg border ${
							isSelected
								? 'bg-light-pallete-50 dark:bg-light-pallete-900/20 border-light-pallete-500 dark:border-light-pallete-400'
								: 'bg-light-surface dark:bg-gray-800 border-gray-200 dark:border-gray-700'
						}`}
					>
						{/* Radio button */}
						<View
							className={`w-5 h-5 rounded-full border-[1.25px] mr-3 justify-center items-center mt-1 ${
								isSelected
									? 'border-light-pallete-500 dark:border-light-pallete-400'
									: 'border-gray-400 dark:border-gray-600'
							}`}
						>
							{isSelected && (
								<View className="w-2.5 h-2.5 rounded-full bg-light-pallete-500 dark:bg-light-pallete-400" />
							)}
						</View>

						{/* Info */}
						<View className="gap-y-1 flex-1">
							<Text className="text-body-sm font-nexa-extrabold text-gray-950 dark:text-gray-50">
								{option.type}
							</Text>
							<View className="flex-row items-center justify-between pr-1">
								<Text className="text-body-xs font-nexa text-gray-500 dark:text-gray-400">
									Delivery: {option.deliveryRange}
								</Text>
								<Text
									className={`text-body-xs font-nexa-bold ${
										isSelected
											? 'text-light-pallete-500 dark:text-light-pallete-400'
											: 'text-gray-500 dark:text-gray-400'
									}`}
								>
									{option.priceLabel}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

export default ShippingMethodSelector;
