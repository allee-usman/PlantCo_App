import { formatDuration } from '@/utils/formatDate';
import React from 'react';
import { Text, View } from 'react-native';

interface BookingPaymentSummaryCardProps {
	ratePerHour: number;
	duration: number; // in hours (fractional allowed)
	tip?: number;
	discount?: number;
	taxes?: number;
	paymentMethod: 'cash' | 'card' | 'wallet' | string;
	status: 'paid' | 'unpaid' | 'pending' | 'failed' | string;
	currency?: string; // 👈 optional: allow different currency codes
}

const BookingPaymentSummaryCard: React.FC<BookingPaymentSummaryCardProps> = ({
	ratePerHour,
	duration,
	tip = 0,
	discount = 0,
	taxes = 0,
	paymentMethod,
	status,
	currency = 'PKR',
}) => {
	// Format currency nicely
	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency,
		}).format(amount);
	};

	// Dynamic colors
	const statusColors: Record<string, string> = {
		paid: 'text-green-600 dark:text-green-500',
		unpaid: 'text-red-600 dark:text-red-500',
		pending: 'text-yellow-500 dark:text-yellow-400',
		failed: 'text-red-500 dark:text-red-400',
	};

	const paymentMethodColors: Record<string, string> = {
		cash: 'text-blue-600 dark:text-blue-400',
		card: 'text-purple-600 dark:text-purple-400',
		wallet: 'text-teal-600 dark:text-teal-400',
	};

	// Calculations
	const serviceAmount = ratePerHour * duration;
	const subtotal = Math.max(serviceAmount - discount, 0); // prevent negative
	const totalAmount = subtotal + tip + taxes;

	return (
		<View>
			<Text className="text-body-sm font-nexa-extrabold ps-4 mb-2 text-gray-900 dark:text-white">
				Payment Summary
			</Text>

			<View className="bg-light-surface dark:bg-gray-800 rounded-2xl p-5 mx-4 mb-4 shadow-sm">
				{/* Service Amount */}
				<View className="py-3 flex-row justify-between">
					<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
						Service Amount ({formatDuration(duration)})
					</Text>
					<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
						{formatCurrency(serviceAmount)}
					</Text>
				</View>

				{/* Discount */}
				{discount > 0 && (
					<View className="py-3 flex-row justify-between">
						<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
							Discount
						</Text>
						<Text className="font-nexa-bold text-body-xs text-red-600">
							-{formatCurrency(discount)}
						</Text>
					</View>
				)}

				{/* Tip */}
				{tip > 0 && (
					<View className="py-3 flex-row justify-between">
						<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
							Tip
						</Text>
						<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
							{formatCurrency(tip)}
						</Text>
					</View>
				)}

				{/* Taxes */}
				{taxes > 0 && (
					<View className="py-3 flex-row justify-between">
						<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
							Taxes
						</Text>
						<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
							{formatCurrency(taxes)}
						</Text>
					</View>
				)}

				{/* Total */}
				<View className="pb-3 flex-row justify-between border-t border-dashed border-gray-200 dark:border-gray-700 mt-2 pt-4">
					<Text className="font-nexa text-body-sm text-gray-950 dark:text-white">
						Total Amount
					</Text>
					<Text className="font-nexa-extrabold text-body-sm text-gray-950 dark:text-white">
						{formatCurrency(totalAmount)}
					</Text>
				</View>

				{/* Payment Method */}
				<View className="py-3 flex-row justify-between">
					<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
						Payment Method
					</Text>
					<Text
						className={`font-nexa-extrabold text-body-xs capitalize ${
							paymentMethodColors[paymentMethod] ??
							'text-gray-700 dark:text-gray-300'
						}`}
					>
						{paymentMethod.replace('_', ' ')}
					</Text>
				</View>

				{/* Status */}
				<View className="py-3 flex-row justify-between">
					<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
						Status
					</Text>
					<Text
						className={`font-nexa-bold text-body-xs capitalize ${
							statusColors[status] ?? 'text-gray-700 dark:text-gray-300'
						}`}
					>
						{status}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default BookingPaymentSummaryCard;
