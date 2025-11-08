import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const dataProtectionData = [
	{
		id: 1,
		title: 'Our Commitment to Data Protection',
		content: [
			'At SmartMart, we are committed to protecting your personal data and respecting your privacy rights. We implement comprehensive security measures and follow industry best practices to safeguard your information.',
		],
	},
	{
		id: 2,
		title: 'Data Security Measures',
		content: ['We employ multiple layers of security to protect your data:'],
		list: [
			'SSL/TLS encryption for all data transmission',
			'AES-256 encryption for data storage',
			'Regular security audits and penetration testing',
			'Multi-factor authentication for admin access',
			'Secure cloud infrastructure with AWS/Google Cloud',
		],
	},
	{
		id: 3,
		title: 'Access Controls',
		content: ['We limit access to your personal data through strict controls:'],
		list: [
			'Role-based access control for employees',
			'Need-to-know basis for data access',
			'Regular access reviews and deprovisioning',
			'Comprehensive audit logs for all data access',
		],
	},
	{
		id: 4,
		title: 'Data Minimization',
		content: ['We practice data minimization by:'],
		list: [
			'Collecting only necessary information for service delivery',
			'Regularly purging unnecessary data',
			'Anonymizing data where possible',
			'Setting retention periods for different data types',
		],
	},
	{
		id: 5,
		title: 'Data Breach Response',
		content: ['In the unlikely event of a data breach, we will:'],
		list: [
			'Detect and contain the breach immediately',
			'Notify affected users within 72 hours',
			'Report to relevant authorities as required',
			'Provide detailed information about the incident',
			'Implement additional safeguards to prevent recurrence',
		],
	},
	{
		id: 6,
		title: 'Third-Party Data Processing',
		content: ['When we work with third-party service providers, we ensure:'],
		list: [
			'Strict data processing agreements are in place',
			'Regular security assessments of vendors',
			'Data is only used for specified purposes',
			'Compliance with same security standards we maintain',
		],
	},
	{
		id: 7,
		title: 'International Data Transfers',
		content: [
			'If we transfer your data internationally, we ensure adequate protection through approved mechanisms such as standard contractual clauses, adequacy decisions, or other appropriate safeguards.',
		],
	},
	{
		id: 8,
		title: 'Your Data Protection Rights',
		content: ['Under applicable data protection laws, you have the right to:'],
		list: [
			'Access your personal data',
			'Rectify inaccurate or incomplete data',
			'Erase your data in certain circumstances',
			'Restrict processing of your data',
			'Data portability',
			'Object to processing',
		],
	},
	{
		id: 9,
		title: 'Data Retention Policies',
		content: ['We retain your data only as long as necessary:'],
		list: [
			'Account data: Until account deletion + 1 year',
			'Transaction records: 7 years for legal compliance',
			'Marketing data: Until consent withdrawal + 30 days',
			'Support tickets: 3 years after resolution',
		],
	},
	{
		id: 10,
		title: 'Contact Our Data Protection Officer',
		content: [
			'For data protection inquiries, requests, or complaints, contact our Data Protection Officer at dpo@smartmart.com or call +92-300-1234567. We will respond to your request within 30 days.',
		],
	},
];

export default function DataProtectionScreen() {
	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 pt-2 px-6">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-1">
						Data Protection
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
					{dataProtectionData.map((section) => (
						<View key={section.id}>
							<Text className="text-sm font-nexa-extrabold text-gray-900 dark:text-white mb-2">
								{section.id}. {section.title}
							</Text>

							{section.content.map((paragraph, idx) => (
								<Text
									key={idx}
									className={`text-gray-600 text-justify dark:text-gray-300 font-nexa text-sm leading-5 ${
										section.list ? 'mb-1' : 'mb-4'
									}`}
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
				<View className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-8">
					<View className="flex-row items-start">
						<Ionicons
							name="lock-closed-outline"
							size={20}
							color="#EF4444"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-red-700 text-justify dark:text-red-200 font-nexa text-sm leading-5 flex-1">
							Your data security is our top priority. We continuously update our
							security measures to protect your information against emerging
							threats.
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
