// components/PaymentSummaryCard.tsx - Payment summary component
import { PaymentSummaryData } from '@/interfaces/interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface PaymentSummaryCardProps {
	data: PaymentSummaryData;
	title?: string;
}

const PaymentSummaryCard: React.FC<{ ratePerHour: number }> = (data) => {
	// const {
	// 	// serviceName,
	// 	ratePerHour,
	// 	duration,
	// 	tip,
	// 	paymentMethod,
	// 	// taxes = 0,
	// 	// discount = 0,
	// 	// currency = 'USD',
	// } = data;

	// Calculations
	const serviceAmount = data.ratePerHour * 2;
	const subtotal = serviceAmount;
	// const subtotal = serviceAmount - discount;
	// const totalAmount = subtotal + tip + taxes;
	const totalAmount = subtotal;

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const formatDuration = (hours: number): string => {
		const wholeHours = Math.floor(hours);
		const minutes = Math.round((hours - wholeHours) * 60);

		if (wholeHours === 0) {
			return `${minutes} min`;
		} else if (minutes === 0) {
			return `${wholeHours} hr`;
		} else {
			return `${wholeHours}hr ${minutes}min`;
		}
	};

	// const getPaymentMethodIcon = () => {
	// 	switch (data.paymentMethod.type) {
	// 		case 'card':
	// 			switch (data.paymentMethod.cardBrand) {
	// 				case 'visa':
	// 					return 'card-outline';
	// 				case 'mastercard':
	// 					return 'card-outline';
	// 				case 'amex':
	// 					return 'card-outline';
	// 				default:
	// 					return 'card-outline';
	// 			}
	// 		case 'paypal':
	// 			return 'logo-paypal';
	// 		case 'apple_pay':
	// 			return 'logo-apple';
	// 		case 'google_pay':
	// 			return 'logo-google';
	// 		case 'bank_transfer':
	// 			return 'bank-outline';
	// 		default:
	// 			return 'card-outline';
	// 	}
	// };

	// const getPaymentMethodColor = () => {
	// 	switch (data.paymentMethod.type) {
	// 		case 'paypal':
	// 			return '#003087';
	// 		case 'apple_pay':
	// 			return '#000000';
	// 		case 'google_pay':
	// 			return '#4285F4';
	// 		default:
	// 			return '#10B981';
	// 	}
	// };

	return (
		<View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mx-4 mb-4 shadow-sm">
			{/* Header */}
			<Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
				{/* {title} */}
				Payment Summary
			</Text>

			{/* Service Details */}
			{/* <View className="mb-6">
				<View className="flex-row items-center mb-2">
					<Ionicons name="leaf-outline" size={20} color="#10B981" />
					<Text className="text-gray-900 dark:text-white font-semibold ml-2 flex-1">
						{serviceName}
					</Text>
				</View>
				<View className="ml-7">
					<Text className="text-gray-600 dark:text-gray-400 text-sm">
						{formatCurrency(ratePerHour)}/hour × {formatDuration(duration)}
					</Text>
				</View>
			</View> */}

			{/* Payment Breakdown */}
			<View className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
				{/* Service Amount */}
				<View className="flex-row justify-between items-center mb-3">
					<Text className="text-gray-600 dark:text-gray-400">
						Service Amount
					</Text>
					<Text className="text-gray-900 dark:text-white font-medium">
						{formatCurrency(serviceAmount)}
					</Text>
				</View>

				{/* Discount (if any) */}
				{/* {discount > 0 && (
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-green-600">Discount</Text>
						<Text className="text-green-600 font-medium">
							-{formatCurrency(discount)}
						</Text>
					</View>
				)} */}

				{/* Tip */}
				{/* <View className="flex-row justify-between items-center mb-3">
					<View className="flex-row items-center">
						<Ionicons name="heart-outline" size={16} color="#EF4444" />
						<Text className="text-gray-600 dark:text-gray-400 ml-1">Tip</Text>
					</View>
					<Text className="text-gray-900 dark:text-white font-medium">
						{formatCurrency(tip)}
					</Text>
				</View> */}

				{/* Taxes (if any) */}
				{/* {taxes > 0 && (
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-gray-600 dark:text-gray-400">
							Taxes & Fees
						</Text>
						<Text className="text-gray-900 dark:text-white font-medium">
							{formatCurrency(taxes)}
						</Text>
					</View>
				)} */}

				{/* Subtotal Line */}
				<View className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
					<View className="flex-row justify-between items-center">
						<Text className="text-lg font-semibold text-gray-900 dark:text-white">
							Total Amount
						</Text>
						<Text className="text-xl font-bold text-teal-600">
							{formatCurrency(totalAmount)}
						</Text>
					</View>
				</View>
			</View>

			{/* Payment Method */}
			<View className="border-t border-gray-200 dark:border-gray-700 pt-4">
				<Text className="text-gray-600 dark:text-gray-400 mb-3">
					Payment Method
				</Text>
				<View className="flex-row items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
					<View
						className="w-10 h-10 rounded-lg items-center justify-center mr-3"
						style={{ backgroundColor: '#00000' + '20' }}
					>
						{/* <Ionicons
							name={getPaymentMethodIcon() as any}
							size={20}
							color={getPaymentMethodColor()}
						/> */}
					</View>
					<View className="flex-1">
						<Text className="font-semibold text-gray-900 dark:text-white">
							{data.paymentMethod.displayName}
						</Text>
						{data.paymentMethod.last4 && (
							<Text className="text-sm text-gray-600 dark:text-gray-400">
								•••• •••• •••• {data.paymentMethod.last4}
							</Text>
						)}
					</View>
					<Ionicons name="checkmark-circle" size={20} color="#10B981" />
				</View>
			</View>
		</View>
	);
};

export default PaymentSummaryCard;

// Example usage component
// ExampleUsage.tsx - How to use the PaymentSummaryCa

// const ExampleUsage: React.FC = () => {
// 	const paymentData: PaymentSummaryData = {
// 		serviceName: 'Lawn Mowing Service',
// 		ratePerHour: 45,
// 		duration: 2.5, // 2 hours 30 minutes
// 		tip: 15,
// 		taxes: 8.5,
// 		discount: 5,
// 		paymentMethod: {
// 			id: 'card_123',
// 			type: 'card',
// 			displayName: 'Visa Credit Card',
// 			last4: '4242',
// 			cardBrand: 'visa',
// 			icon: 'card-outline',
// 		},
// 		currency: 'USD',
// 	};

// 	const paymentData2: PaymentSummaryData = {
// 		duration: 4, // 4 hours

// 	};

// 	return (
// 		<SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
// 			<ScrollView showsVerticalScrollIndicator={false}>
// 				<View className="py-4">

// 					<PaymentSummaryCard
// 						data={paymentData2}
// 						title="Service Payment Details"
// 					/>
// 				</View>
// 			</ScrollView>
// 		</SafeAreaView>
// 	);
// };

// export default ExampleUsage;
