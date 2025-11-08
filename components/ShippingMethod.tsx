import React from 'react';
import { Text, View } from 'react-native';

interface ShippingMethodProps {
	isSelected?: boolean;
	type: string;
	deliveryRange?: string;
	priceLabel?: string;
}

const ShippingMethod: React.FC<ShippingMethodProps> = ({
	isSelected,
	type,
	deliveryRange,
	priceLabel,
}) => {
	return (
		<View
			className={`flex-row items-center px-2 py-3  rounded-lg border ${
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
					{type}
				</Text>
				<View className="flex-row  items-center justify-between pr-1">
					<Text className="text-body-xs font-nexa text-gray-500 dark:text-gray-400">
						Delivery: {deliveryRange}
					</Text>
					<Text
						className={`1text-body-xs font-nexa-bold ${
							isSelected
								? 'text-light-pallete-500 dark:text-light-pallete-400'
								: 'text-gray-500 dark:text-gray-400'
						}`}
					>
						{priceLabel}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default ShippingMethod;
