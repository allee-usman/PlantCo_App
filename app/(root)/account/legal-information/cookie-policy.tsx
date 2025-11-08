import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const cookiePolicyData = [
	{
		id: 1,
		title: 'What Are Cookies?',
		content: [
			'Cookies are small text files stored on your device when you visit a website or use an app. They help us improve your browsing experience by remembering preferences and enabling certain functionalities.',
		],
	},
	{
		id: 2,
		title: 'How We Use Cookies',
		content: ['We use cookies to enhance your app experience, including:'],
		list: [
			'Remembering your login and preferences',
			'Keeping your shopping cart updated',
			'Analyzing app usage and performance',
			'Providing personalized product recommendations',
		],
	},
	{
		id: 3,
		title: 'Types of Cookies We Use',
		content: ['The types of cookies we use include:'],
		list: [
			'Essential Cookies – Required for the app to function properly',
			'Performance Cookies – Help us understand how you use the app',
			'Functional Cookies – Remember your preferences and settings',
			'Advertising Cookies – Deliver relevant ads and offers',
		],
	},
	{
		id: 4,
		title: 'Managing Cookies',
		content: [
			'You can control or disable cookies through your device settings. However, please note that disabling cookies may affect the functionality and features of the app.',
		],
	},
	{
		id: 5,
		title: 'Third-Party Cookies',
		content: [
			'We may allow trusted third-party partners (such as analytics or advertising providers) to place cookies on your device for performance tracking and personalized experiences.',
		],
	},
	{
		id: 6,
		title: 'Updates to Cookie Policy',
		content: [
			'We may update this Cookie Policy from time to time. Changes will be communicated through the app or via email. Continued use of the app after updates indicates your acceptance of the updated policy.',
		],
	},
];

export default function CookiePolicyScreen() {
	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 pt-2 px-5">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-1">
						Cookie Policy
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
					{cookiePolicyData.map((section) => (
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
				<View className="mt-4 p-4 bg-orange-50 dark:bg-yellow-900/20 rounded-lg mb-8">
					<View className="flex-row items-start">
						<Ionicons
							name="alert-circle-outline"
							size={20}
							color="#F59E0B"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-yellow-600 dark:text-yellow-200 text-justify font-nexa text-sm leading-5 flex-1">
							We use cookies responsibly to improve your browsing experience.
							You can manage your cookie preferences at any time through your
							device settings.
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
