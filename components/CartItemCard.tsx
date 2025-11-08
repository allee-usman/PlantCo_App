import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface CartItem {
	id: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	image: any;
}

interface Props {
	item: CartItem;
	onRemove: (id: string) => void;
	onUpdateQuantity: (id: string, change: number) => void;
}

const CartItemCard: React.FC<Props> = ({
	item,
	onRemove,
	onUpdateQuantity,
}) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	// console.log(item.id);

	return (
		<View className="bg-light-surface dark:bg-gray-800 rounded-xl p-2 mb-3 border border-gray-100 dark:border-gray-800">
			<View className="flex-row items-center">
				{/* Product Image */}
				<Image
					source={{ uri: item.image }}
					className="w-[90px] h-[100px] rounded-lg mr-4"
					resizeMode="cover"
				/>

				{/* Product Info */}
				<View className="flex-1 flex-col justify-between gap-y-2 pr-2">
					<View className="flex-row justify-between items-center">
						<Text
							className="text-body-sm font-nexa-extrabold text-gray-900 dark:text-gray-100"
							numberOfLines={1}
						>
							{item.name}
						</Text>
						{/* Remove Button */}
						<TouchableOpacity
							onPress={() => onRemove(item.id)}
							accessibilityRole="button"
							accessibilityLabel={`Remove ${item.name} from cart`}
							className="bg-red-50 dark:bg-red-900/20 rounded-full w-[28px] h-[28px] justify-center items-center"
						>
							<Image
								source={icons.trash}
								className="w-5 h-5"
								tintColor={COLORS.light.error.text}
							/>
						</TouchableOpacity>
					</View>

					<Text
						numberOfLines={1}
						className="text-body-sm text-gray-600 dark:text-gray-400 mb-2"
					>
						{item.description}
					</Text>

					<View className="flex-row justify-between items-center">
						{/* Quantity Controls */}
						<View className="flex-row p-1 items-center rounded-full bg-light-screen dark:bg-gray-900">
							<TouchableOpacity
								onPress={() => onUpdateQuantity(item.id, -1)}
								className="w-6 h-6 rounded-full bg-light-surface dark:bg-gray-800 items-center justify-center"
								disabled={item.quantity <= 1}
							>
								<Ionicons
									name="remove"
									size={16}
									color={
										item.quantity <= 1
											? '#9CA3AF'
											: isDark
											? COLORS.gray[50]
											: COLORS.gray[950]
									}
								/>
							</TouchableOpacity>

							<Text className="text-body-sm font-nexa-bold text-gray-900 dark:text-gray-100 min-w-[32px] text-center">
								{item.quantity}
							</Text>

							<TouchableOpacity
								onPress={() => onUpdateQuantity(item.id, 1)}
								className="w-6 h-6 bg-light-surface dark:bg-gray-800 rounded-full items-center justify-center"
							>
								<Ionicons
									name="add"
									size={16}
									color={
										item.quantity <= 1
											? '#9CA3AF'
											: isDark
											? COLORS.gray[50]
											: COLORS.gray[950]
									}
								/>
							</TouchableOpacity>
						</View>

						<Text className="text-body-xs font-nexa-extrabold text-gray-950 dark:text-gray-50">
							Rs. {item.price}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

export default CartItemCard;
