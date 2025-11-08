import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AddressCardProps {
	name: string;
	address: string;
	phone: string;
	isDefault?: boolean;
	onEdit?: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
	name,
	address,
	phone,
	isDefault,
	onEdit,
}) => {
	return (
		<View className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
			<View className="flex-row justify-between items-center mb-2">
				<Text className="text-body-md font-nexa-bold text-gray-950 dark:text-gray-50">
					{name}
				</Text>
				<TouchableOpacity
					onPress={onEdit}
					className="flex-row items-center gap-x-1"
				>
					<Ionicons name="create-outline" size={16} color="#6B7280" />
					<Text className="text-body-xs text-gray-500 dark:text-gray-400">
						Edit
					</Text>
				</TouchableOpacity>
			</View>

			<Text className="text-body-sm text-gray-700 dark:text-gray-300">
				{address}
			</Text>
			<Text className="text-body-sm text-gray-700 dark:text-gray-300">
				Phone: {phone}
			</Text>

			{isDefault && (
				<View className="mt-2 self-start bg-light-pallete-100 dark:bg-light-pallete-900/20 px-2 py-1 rounded-lg">
					<Text className="text-body-xs text-light-pallete-600 dark:text-light-pallete-400 font-nexa-bold">
						Default
					</Text>
				</View>
			)}
		</View>
	);
};

export default AddressCard;
