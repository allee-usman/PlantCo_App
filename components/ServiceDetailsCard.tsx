import { ServiceDetails } from '@/interfaces/interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ServiceDetailsCardProps {
	details: ServiceDetails;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ details }) => {
	const getPaymentStatusColor = () => {
		switch (details.paymentStatus) {
			case 'paid':
				return 'text-green-600';
			case 'pending':
				return 'text-orange-600';
			case 'refunded':
				return 'text-blue-600';
			default:
				return 'text-gray-600';
		}
	};

	const getPaymentStatusText = () => {
		switch (details.paymentStatus) {
			case 'paid':
				return 'Paid';
			case 'pending':
				return 'Pending';
			case 'refunded':
				return 'Refunded';
			default:
				return 'Unknown';
		}
	};

	return (
		<View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mx-4 mb-4">
			<Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
				Service Details
			</Text>

			{/* Description */}
			<View className="mb-4">
				<Text className="font-semibold text-gray-900 dark:text-white mb-2">
					Description
				</Text>
				<Text className="text-gray-600 dark:text-gray-400 leading-5">
					{details.description}
				</Text>
			</View>

			{/* Equipment */}
			<View className="mb-4">
				<Text className="font-semibold text-gray-900 dark:text-white mb-2">
					Equipment Provided
				</Text>
				{details.equipment.map((item, index) => (
					<View key={index} className="flex-row items-center mb-1">
						<Ionicons name="checkmark-circle" size={16} color="#10B981" />
						<Text className="text-gray-600 dark:text-gray-400 ml-2">
							{item}
						</Text>
					</View>
				))}
			</View>

			{/* Instructions */}
			<View className="mb-4">
				<Text className="font-semibold text-gray-900 dark:text-white mb-2">
					Special Instructions
				</Text>
				<Text className="text-gray-600 dark:text-gray-400 leading-5">
					{details.instructions}
				</Text>
			</View>

			{/* Cost and Payment */}
			<View className="flex-row justify-between items-center">
				<View>
					<Text className="font-semibold text-gray-900 dark:text-white">
						Total Cost
					</Text>
					<Text className="text-2xl font-bold text-teal-600">
						${details.estimatedCost}
					</Text>
				</View>
				<View className="items-end">
					<Text className="text-gray-600 dark:text-gray-400 mb-1">
						Payment Status
					</Text>
					<Text className={`font-semibold ${getPaymentStatusColor()}`}>
						{getPaymentStatusText()}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default ServiceDetailsCard;
