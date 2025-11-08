import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const shippingPolicyData = [
	{
		id: 1,
		title: 'Shipping Coverage',
		content: [
			'SmartMart currently ships within Pakistan to all major cities and towns. We are working to expand our international shipping services soon.',
		],
		list: [
			'Major Cities: Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad',
			'All Provincial Capitals and District Headquarters',
			'Rural areas where courier services are available',
		],
	},
	{
		id: 2,
		title: 'Delivery Options',
		deliveryOptions: [
			{
				type: 'Same-Day Delivery',
				bgColor: 'bg-green-100 dark:bg-green-900/20',
				textColor: 'text-green-700 dark:text-green-300',
				titleColor: 'text-green-800 dark:text-green-200',
				icon: icons.sameDayDelivery,
				list: [
					'Available in: Karachi, Lahore, Islamabad',
					'Order before 2:00 PM for same-day delivery',
					'Delivery time: 4-8 hours',
					'Cost: Rs. 299',
				],
			},
			{
				type: 'Express Delivery',
				bgColor: 'bg-blue-100 dark:bg-blue-900/20',
				textColor: 'text-blue-700 dark:text-blue-300',
				titleColor: 'text-blue-800 dark:text-blue-200',
				icon: icons.expressDelivery,
				list: [
					'Available in: Major cities nationwide',
					'Delivery time: 1-2 business days',
					'Cost: Rs. 199',
				],
			},
			{
				type: 'Standard Delivery',
				bgColor: 'bg-violet-100 dark:bg-gray-00',
				textColor: 'text-violet-700 dark:text-gray-300',
				titleColor: 'text-violet-800 dark:text-gray-200',
				icon: icons.standardDelivery,
				list: [
					'Available: Nationwide',
					'Delivery time: 3-5 business days',
					'Cost: Rs. 99 (Free on orders above Rs. 2,499)',
				],
			},
		],
	},
	{
		id: 3,
		title: 'Free Shipping Eligibility',
		content: [
			'Enjoy free shipping on your orders when you meet these criteria:',
		],
		list: [
			'Orders above Rs. 2,499 qualify for free standard delivery',
			'SmartMart Premium members get free shipping on all orders',
			'Special promotions may offer free shipping on lower amounts',
		],
	},
	{
		id: 4,
		title: 'Order Processing Time',
		content: [
			'Order processing times vary based on product availability and type:',
		],
		list: [
			'In-stock items: 2-4 hours during business days',
			'Pre-order items: As per specified delivery date',
			'Custom/Made-to-order: 5-7 business days',
			'Weekend orders: Processed on next business day',
		],
	},
	{
		id: 5,
		title: 'Delivery Tracking',
		content: [
			'Stay updated on your order with our comprehensive tracking system:',
		],
		list: [
			'Real-time tracking updates in the app',
			'SMS notifications for key delivery milestones',
			'Email updates with tracking number',
			'Live location sharing on delivery day',
		],
	},
	{
		id: 6,
		title: 'Delivery Attempts',
		content: ['Our delivery process ensures you receive your order:'],
		list: [
			'We make 3 delivery attempts before returning to warehouse',
			"You'll be contacted before each delivery attempt",
			'Packages held at warehouse for 7 days after final attempt',
			'You can reschedule delivery through the app',
		],
	},
	{
		id: 7,
		title: 'Special Handling Items',
		content: [
			'Certain items require special handling and may have different delivery times:',
		],
		list: [
			'Fragile items: Extra 1-2 days for careful packaging',
			'Large appliances: 5-7 days with installation service',
			'Perishable goods: Same-day or express delivery only',
			'Hazardous materials: As per safety regulations',
		],
	},
	{
		id: 8,
		title: 'Delivery Address Requirements',
		content: ['To ensure successful delivery, please provide:'],
		list: [
			'Complete address with area/sector details',
			'Landmarks for easy location',
			'Valid phone number for delivery contact',
			'Alternative contact number if available',
		],
	},
	{
		id: 9,
		title: 'Undeliverable Packages',
		content: [
			'If we cannot deliver your package due to incorrect address, unavailability, or other issues, it will be returned to our warehouse. You can contact customer support to arrange re-delivery or pickup.',
		],
	},
	{
		id: 10,
		title: 'Contact Delivery Support',
		content: [
			'For delivery-related questions or issues, contact our delivery support at delivery@plantco.com or call +92-316-6183522. Our team is available 24/7 to assist you.',
		],
	},
];

export default function ShippingPolicyScreen() {
	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 pt-2 px-5">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-1">
						Shipping Policy
					</Text>
					<View className="flex flex-row items-center gap-1">
						<Ionicons name="time-outline" size={16} color={COLORS.gray[400]} />
						<Text className="text-gray-400 dark:text-gray-400 font-nexa text-sm">
							Last updated: January 15, 2025
						</Text>
					</View>
				</View>

				{/* Content */}
				<View className="space-y-8">
					{shippingPolicyData.map((section) => (
						<View key={section.id}>
							<Text className="text-sm font-nexa-extrabold text-gray-900 dark:text-white mb-2">
								{section.id}. {section.title}
							</Text>

							{section.content?.map((paragraph, idx) => (
								<Text
									key={idx}
									className={`text-gray-600 text-justify dark:text-gray-300 font-nexa text-sm leading-5 ${
										section.list ? 'mb-3' : 'mb-4'
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

							{/* Delivery Options Cards */}
							{section.deliveryOptions &&
								section.deliveryOptions.map((option, idx) => (
									<View
										key={idx}
										className={`mb-4 p-3 rounded-lg ${option.bgColor}`}
									>
										<View className="flex-row items-center gap-x-2">
											{/* <Image source={option.icon} className="w-7 h-7" /> */}
											<Text
												className={`text-sm font-nexa-bold ${option.titleColor} mb-2`}
											>
												{option.type}
											</Text>
										</View>
										<View className="ml-2 space-y-1">
											{option.list.map((item, idx2) => (
												<Text
													key={idx2}
													className={`font-nexa text-xs ${option.textColor}`}
												>
													● &nbsp;{item}
												</Text>
											))}
										</View>
									</View>
								))}
						</View>
					))}
				</View>

				{/* Footer Notice */}
				<View className="mt-4 p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-8">
					<View className="flex-row items-start">
						<Ionicons
							name="car-outline"
							size={20}
							color="#8B5CF6"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-purple-700 dark:text-purple-200 font-nexa text-justify text-sm leading-5 flex-1">
							We partner with reliable courier services to ensure your orders
							reach you safely and on time.
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
