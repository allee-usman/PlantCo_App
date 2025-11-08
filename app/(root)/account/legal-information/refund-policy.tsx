import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const refundPolicyData = [
	{
		id: 1,
		title: 'Return Policy Overview',
		content: [
			"At SmartMart, we want you to be completely satisfied with your purchase. We offer a 30-day return policy for most items, allowing you to return products that don't meet your expectations.",
		],
	},
	{
		id: 2,
		title: 'Eligible Items for Return',
		content: [
			'Most items can be returned within 30 days of delivery, provided they meet the following conditions:',
		],
		list: [
			'Items are in original, unused condition',
			'Original packaging and tags are intact',
			'Items are not damaged due to misuse',
			'Items are not customized or personalized',
		],
	},
	{
		id: 3,
		title: 'Non-Returnable Items',
		content: [
			'The following items cannot be returned for health and safety reasons:',
		],
		list: [
			'Personal care items (cosmetics, skincare, fragrances)',
			'Perishable goods (food, flowers, plants)',
			'Intimate apparel and swimwear',
			'Digital products and gift cards',
			'Items marked as "Final Sale"',
		],
	},
	{
		id: 4,
		title: 'How to Initiate a Return',
		content: ['To return an item, follow these simple steps:'],
		list: [
			'Step 1: Request Return – Go to "My Orders" in the app, select the item you want to return, and tap "Return Item".',
			'Step 2: Select Reason – Choose the reason for your return from the provided options.',
			"Step 3: Schedule Pickup – We'll arrange a free pickup from your address within 2-3 business days.",
		],
	},
	{
		id: 5,
		title: 'Refund Processing',
		content: ['Once we receive and inspect your returned item:'],
		list: [
			'Inspection takes 1-2 business days',
			'Approved refunds are processed within 2-3 business days',
			'Refunds appear in your original payment method within 5-7 business days',
			"You'll receive email confirmation once refund is processed",
		],
	},
	{
		id: 6,
		title: 'Exchange Policy',
		content: [
			"Currently, we don't offer direct exchanges. If you need a different size, color, or model, please return the original item for a refund and place a new order for the desired item.",
		],
	},
	{
		id: 7,
		title: 'Damaged or Defective Items',
		content: ['If you receive a damaged or defective item:'],
		list: [
			'Contact us within 48 hours of delivery',
			'Provide photos of the damaged item',
			"We'll arrange immediate pickup and full refund",
			'Priority replacement will be offered if available',
		],
	},
	{
		id: 8,
		title: 'Refund Methods',
		content: ['Refunds are processed using the following methods:'],
		list: [
			'Credit/Debit Card: Refunded to original card',
			'Digital Wallet: Refunded to original wallet',
			'Cash on Delivery: Bank transfer to provided account',
			'SmartMart Wallet: Instant credit for future purchases',
		],
	},
	{
		id: 9,
		title: 'Shipping Costs',
		content: [
			'Return shipping is free for most returns. However, if you received free shipping on your original order and return all items, the original shipping cost may be deducted from your refund.',
		],
	},
	{
		id: 10,
		title: 'Contact Support',
		content: [
			'For questions about returns or refunds, contact our customer support at returns@smartmart.com or call +92-300-1234567. Our team is available 24/7 to assist you.',
		],
	},
];

export default function RefundPolicyScreen() {
	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 pt-2 px-6">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-1">
						Return & Refund Policy
					</Text>
					<View className="flex flex-row items-center gap-1">
						<Ionicons name="time-outline" size={16} color={COLORS.gray[400]} />
						<Text className="text-gray-400 dark:text-gray-400 font-nexa text-sm">
							Last updated: January 15, 2025
						</Text>
					</View>
				</View>

				{/* Dynamic Sections */}
				<View className="space-y-8">
					{refundPolicyData.map((section) => (
						<View key={section.id}>
							<Text className="text-sm font-nexa-extrabold text-gray-900 dark:text-white mb-2">
								{section.id}. {section.title}
							</Text>

							{section.content.map((paragraph, idx) => (
								<Text
									key={idx}
									className={`text-gray-600 text-justify dark:text-gray-300 font-nexa text-sm leading-5 ${
										section.list ? 'mb-1' : 'mb-4'
									} `}
								>
									{paragraph}
								</Text>
							))}

							{section.list && (
								<View className="ml-4 space-y-2 mb-4">
									{section.list.map((item, idx) => (
										<Text
											key={idx}
											className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6"
										>
											● &nbsp;{item}
										</Text>
									))}
								</View>
							)}
						</View>
					))}
				</View>

				{/* Footer Notice */}
				<View className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-8">
					<View className="flex-row items-start">
						<Ionicons
							name="return-up-back-outline"
							size={20}
							color="#3B82F6"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-blue-700 dark:text-blue-200 text-justify font-nexa text-sm leading-5 flex-1">
							We strive to make returns and refunds as simple as possible. Your
							satisfaction is our priority.
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
