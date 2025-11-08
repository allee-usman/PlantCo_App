import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { icons } from '@/constants/icons';

interface PaymentOption {
	id: string;
	label: string;
	icon: any;
	iconSize: number;
}

const paymentOptions: PaymentOption[] = [
	{ id: 'cod', label: 'Cash on Delivery', icon: icons.cod, iconSize: 20 },
	{ id: 'card', label: 'Credit/Debit Card', icon: icons.card, iconSize: 20 },
	{ id: 'paypal', label: 'PayPal', icon: icons.stripe, iconSize: 24 },
];

const PaymentMethodSelector: React.FC<{
	selected: string;
	onSelect: (id: string) => void;
}> = ({ selected, onSelect }) => {
	return (
		<View className="gap-y-3">
			{paymentOptions.map((method) => (
				<TouchableOpacity
					key={method.id}
					onPress={() => onSelect(method.id)}
					className={`flex-row justify-between items-center border h-[50px] p-3 rounded-lg  ${
						selected === method.id
							? 'bg-light-pallete-50 dark:bg-light-pallete-900/20 border-light-pallete-500 dark:border-light-pallete-400'
							: 'bg-light-surface dark:bg-gray-800 border-gray-200 dark:border-gray-700'
					}`}
				>
					<View className="flex-row items-center gap-x-3">
						<Image
							source={method.icon}
							style={{ width: method.iconSize, height: method.iconSize }}
						/>
						<Text className="text-body-sm font-nexa-bold text-gray-950 dark:text-gray-50">
							{method.label}
						</Text>
					</View>

					{/* Radio */}
					<View
						className={`w-5 h-5 rounded-full border-[1.25px] justify-center items-center ${
							selected === method.id
								? 'border-light-pallete-500 dark:border-light-pallete-400'
								: 'border-gray-400 dark:border-gray-600'
						}`}
					>
						{selected === method.id && (
							<View className="w-2.5 h-2.5 rounded-full bg-light-pallete-500 dark:bg-light-pallete-400" />
						)}
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default PaymentMethodSelector;
