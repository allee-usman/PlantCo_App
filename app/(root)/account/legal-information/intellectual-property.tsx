import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const intellectualPropertySections = [
	{
		title: '1. SmartMart Intellectual Property Rights',
		description:
			'All intellectual property rights in the SmartMart app and services belong to SmartMart or our licensors. This includes:',
		points: [
			'SmartMart name, logo, and branding',
			'App design, interface, and user experience',
			'AI recommendation algorithms and technology',
			'Software code, databases, and technical systems',
			'Content, text, graphics, and multimedia materials',
		],
	},
	{
		title: '2. User-Generated Content',
		description:
			'When you submit content to SmartMart (reviews, photos, comments), you grant us:',
		points: [
			'Non-exclusive, worldwide, royalty-free license to use your content',
			'Right to modify, adapt, and display your content',
			'Permission to use content for marketing and promotional purposes',
			'Right to sublicense to third parties as necessary',
		],
		footer:
			'You retain ownership of your original content and can request removal at any time.',
	},
	{
		title: '3. Third-Party Intellectual Property',
		description:
			'We respect third-party intellectual property rights and expect our users to do the same:',
		points: [
			'Do not upload copyrighted material without permission',
			'Respect trademark rights of brands and products',
			'Report suspected IP violations to our team',
			'Obtain necessary licenses for commercial use',
		],
	},
	{
		title: '4. DMCA Copyright Policy',
		description:
			'If you believe your copyrighted work has been infringed, please provide:',
		points: [
			'Description of the copyrighted work claimed to be infringed',
			'Location of the allegedly infringing material',
			'Your contact information and electronic signature',
			'Statement of good faith belief that use is unauthorized',
			'Statement that information is accurate under penalty of perjury',
		],
	},
	{
		title: '5. Trademark Usage',
		description:
			'SmartMart trademarks may not be used without prior written consent except:',
		points: [
			'Factual reference to SmartMart services',
			'Comparative advertising (with proper disclaimers)',
			'News reporting and editorial use',
			'Academic or educational purposes',
		],
	},
	{
		title: '6. Patent Rights',
		description:
			'SmartMart may hold patents on certain technologies and methods used in our platform. Our AI recommendation system and related algorithms are proprietary technologies that may be protected by patents and trade secrets.',
	},
	{
		title: '7. Open Source Components',
		description:
			'Our app may incorporate open source software components, which are governed by their respective licenses. We comply with all open source license requirements and make necessary attributions available upon request.',
	},
	{
		title: '8. Brand Partnership Guidelines',
		description: 'For brands and sellers using SmartMart platform:',
		points: [
			'You must own or have rights to all submitted content',
			'Product descriptions must be accurate and original',
			'Images must be owned or properly licensed',
			"Respect other brands' intellectual property",
		],
	},
	{
		title: '9. Enforcement and Violations',
		description:
			'SmartMart actively protects intellectual property rights through:',
		points: [
			'Automated content monitoring systems',
			'User reporting mechanisms for violations',
			'Legal action against serious infringers',
			'Account suspension or termination for repeat offenders',
		],
	},
	{
		title: '10. Contact IP Legal Team',
		description:
			'For intellectual property matters, copyright claims, or licensing inquiries, contact our IP legal team at ip@smartmart.com or call +92-300-1234567.',
	},
];

export default function IntellectualPropertyScreen() {
	return (
		<ScrollView className="flex-1 bg-white dark:bg-gray-900">
			<View className="px-4 py-4">
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-2">
						Intellectual Property
					</Text>
					<Text className="text-gray-600 dark:text-gray-400 font-nexa text-sm">
						Last updated: January 15, 2025
					</Text>
				</View>

				{/* Content */}
				<View className="space-y-6">
					{intellectualPropertySections.map((section, index) => (
						<View key={index}>
							<Text className="text-lg font-nexa-extrabold text-gray-900 dark:text-white mb-3">
								{section.title}
							</Text>
							{section.description && (
								<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
									{section.description}
								</Text>
							)}
							{section.points && (
								<View className="ml-4 space-y-2">
									{section.points.map((point, idx) => (
										<Text
											key={idx}
											className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6"
										>
											• {point}
										</Text>
									))}
								</View>
							)}
							{section.footer && (
								<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mt-3">
									{section.footer}
								</Text>
							)}
						</View>
					))}
				</View>

				{/* Footer Notice */}
				<View className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
					<View className="flex-row items-start">
						<Ionicons
							name="bulb-outline"
							size={20}
							color="#6366F1"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-indigo-700 dark:text-indigo-200 font-nexa text-sm leading-5 flex-1">
							We value creativity and innovation. Our intellectual property
							policies help protect both SmartMart and our community of users
							and partners.
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
