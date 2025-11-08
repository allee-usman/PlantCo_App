import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const privacyPolicyData = [
	{
		id: 1,
		title: 'Information We Collect',
		content: [
			'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes:',
		],
		list: [
			'Personal information (name, email, phone number)',
			'Payment information (credit card details, billing address)',
			'Delivery information (shipping address, delivery preferences)',
			'Usage data (app interactions, search history, preferences)',
		],
	},
	{
		id: 2,
		title: 'How We Use Your Information',
		content: ['We use the information we collect to:'],
		list: [
			'Process orders and payments',
			'Provide personalized product recommendations',
			'Send order confirmations and shipping updates',
			'Improve our AI recommendation system',
			'Provide customer support',
		],
	},
	{
		id: 3,
		title: 'Information Sharing',
		content: [
			'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:',
		],
		list: [
			'With trusted service providers (payment processors, delivery partners)',
			'When required by law or legal process',
			'To protect our rights and safety',
			'With your explicit consent',
		],
	},
	{
		id: 4,
		title: 'Data Security',
		content: [
			'We implement industry-standard security measures to protect your personal information, including SSL encryption for data transmission, secure servers for data storage, and regular security audits. However, no method of transmission over the internet is 100% secure.',
		],
	},
	{
		id: 5,
		title: 'Your Rights and Choices',
		content: ['You have the right to:'],
		list: [
			'Access and update your personal information',
			'Delete your account and associated data',
			'Opt out of marketing communications',
			'Request a copy of your data',
			'Restrict processing of your data',
		],
	},
	{
		id: 6,
		title: 'AI and Machine Learning',
		content: [
			'Our AI recommendation system analyzes your browsing behavior, purchase history, and preferences to suggest relevant products. This data is processed securely and is used solely to enhance your shopping experience. You can opt out of personalized recommendations in your account settings.',
		],
	},
	{
		id: 7,
		title: 'Cookies and Tracking',
		content: [
			'We use cookies and similar technologies to enhance your app experience, remember your preferences, and analyze app usage. You can manage your cookie preferences through your device settings.',
		],
	},
	{
		id: 8,
		title: "Children's Privacy",
		content: [
			'SmartMart is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.',
		],
	},
	{
		id: 9,
		title: 'Changes to Privacy Policy',
		content: [
			'We may update this Privacy Policy periodically. We will notify you of any material changes via email or app notification. Your continued use of the app after changes indicates your acceptance of the updated policy.',
		],
	},
	{
		id: 10,
		title: 'Contact Us',
		content: [
			'If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@smartmart.com or call +92-300-1234567.',
		],
	},
];

export default function PrivacyPolicyScreen() {
	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 pt-2 px-6">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-1">
						Privacy Policy
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
					{privacyPolicyData.map((section) => (
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
				<View className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-8">
					<View className="flex-row items-start">
						<Ionicons
							name="shield-checkmark-outline"
							size={20}
							color="#10B981"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-green-700 dark:text-green-200 text-justify font-nexa text-sm leading-5 flex-1">
							Your privacy is important to us. We are committed to protecting
							your personal information and being transparent about our data
							practices.
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
