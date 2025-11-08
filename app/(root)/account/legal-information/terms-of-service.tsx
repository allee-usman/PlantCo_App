import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const termsData = [
	{
		id: 1,
		title: 'Acceptance of Terms',
		content: [
			'By accessing and using PlantCo mobile application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
		],
	},
	{
		id: 2,
		title: 'Use License',
		content: [
			'Permission is granted to temporarily download one copy of PlantCo app for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
		],
		list: [
			'Modify or copy the materials',
			'Use the materials for any commercial purpose or for any public display',
			'Attempt to reverse engineer any software contained in the app',
			'Remove any copyright or other proprietary notations',
		],
	},
	{
		id: 3,
		title: 'Account Registration',
		content: [
			'To access certain features of the app, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.',
		],
	},
	{
		id: 4,
		title: 'User Conduct',
		content: ['You agree not to use the app to:'],
		list: [
			'Violate any applicable laws or regulations',
			'Transmit any harmful, threatening, or offensive content',
			"Interfere with the app's functionality",
			'Attempt unauthorized access to our systems',
		],
	},
	{
		id: 5,
		title: 'Payment Terms',
		content: [
			'All prices are listed in Pakistani Rupees (PKR). Payment is due at the time of order placement. We accept various payment methods including credit/debit cards, digital wallets, and cash on delivery where available.',
		],
	},
	{
		id: 6,
		title: 'Order Cancellation',
		content: [
			'Orders can be cancelled within 2 hours of placement if the order has not been processed for shipping. Refunds for cancelled orders will be processed within 5-7 business days.',
		],
	},
	{
		id: 7,
		title: 'Limitation of Liability',
		content: [
			'PlantCo shall not be liable for any damages arising from the use or inability to use the app, including but not limited to direct, indirect, incidental, punitive, and consequential damages.',
		],
	},
	{
		id: 8,
		title: 'Termination',
		content: [
			'We may terminate your access to the app at any time, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account.',
		],
	},
	{
		id: 9,
		title: 'Changes to Terms',
		content: [
			'PlantCo reserves the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the app constitutes acceptance of the modified terms.',
		],
	},
	{
		id: 10,
		title: 'Contact Information',
		content: [
			'For questions about these Terms of Service, please contact us at legal@plantco.com or call +92-316-6183522',
		],
	},
];

export default function TermsOfServiceScreen() {
	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 pt-2 px-6">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-1">
						Terms & Conditions
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
					{termsData.map((section) => (
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
				<View className="mt-4 p-4 bg-orange-50 dark:bg-blue-900/20 rounded-lg mb-8">
					<View className="flex-row items-start">
						<Ionicons
							name="information-circle-outline"
							size={20}
							color="#f97316"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-orange-500 text-justify dark:text-blue-200 font-nexa text-sm leading-5 flex-1">
							These terms constitute the entire agreement between you and
							PlantCo regarding the use of our services.
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
