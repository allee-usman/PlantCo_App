import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const disputeResolutionSections = [
	{
		title: '1. Our Commitment to Fair Resolution',
		description:
			'At SmartMart, we are committed to resolving disputes fairly and efficiently. We understand that disagreements may arise, and we have established clear procedures to address them promptly and impartially.',
	},
	{
		title: '2. Types of Disputes We Handle',
		description: 'We can help resolve various types of disputes:',
		points: [
			'Order and delivery issues',
			'Product quality and description discrepancies',
			'Return and refund disputes',
			'Payment and billing problems',
			'Seller performance issues',
			'Account and service-related disputes',
		],
	},
	{
		title: '3. Resolution Process Steps',
		steps: [
			{
				stepTitle: 'Step 1: Direct Communication',
				text: "First, try to resolve the issue directly with the seller through SmartMart's messaging system. Many disputes can be resolved quickly through direct communication.",
				// bg: 'bg-blue-50 dark:bg-blue-900/20',
				// textColor: 'text-blue-700 dark:text-blue-300',
				// titleColor: 'text-blue-800 dark:text-blue-200',
			},
			{
				stepTitle: 'Step 2: Contact Customer Support',
				text: "If direct communication doesn't resolve the issue within 48 hours, contact our customer support team for assistance and mediation.",
				// bg: 'bg-green-50 dark:bg-green-900/20',
				// textColor: 'text-green-700 dark:text-green-300',
				// titleColor: 'text-green-800 dark:text-green-200',
			},
			{
				stepTitle: 'Step 3: Formal Dispute Filing',
				text: 'If the issue remains unresolved after 7 days, you can file a formal dispute through the "My Orders" section or contact our dispute resolution team.',
				// bg: 'bg-orange-50 dark:bg-orange-900/20',
				// textColor: 'text-orange-700 dark:text-orange-300',
				// titleColor: 'text-orange-800 dark:text-orange-200',
			},
			{
				stepTitle: 'Step 4: Investigation and Resolution',
				text: 'Our dispute resolution team will investigate the matter, review evidence, and make a fair decision within 5-7 business days.',
				// bg: 'bg-purple-50 dark:bg-purple-900/20',
				// textColor: 'text-purple-700 dark:text-purple-300',
				// titleColor: 'text-purple-800 dark:text-purple-200',
			},
		],
	},
	{
		title: '4. Required Information for Disputes',
		description: 'When filing a dispute, please provide:',
		points: [
			'Order number and transaction details',
			'Clear description of the problem',
			'Supporting evidence (photos, screenshots, messages)',
			'Your desired resolution outcome',
			'Any previous communication attempts',
		],
	},
	{
		title: '5. Investigation Process',
		description: 'Our investigation process includes:',
		points: [
			'Review of all submitted evidence and documentation',
			'Communication with both parties involved',
			'Analysis of order history and account standing',
			'Consultation with relevant departments (logistics, payments, etc.)',
			'Application of SmartMart policies and industry standards',
		],
	},
	{
		title: '6. Possible Resolution Outcomes',
		description: 'Depending on the case, resolutions may include:',
		points: [
			'Full or partial refund to the customer',
			'Product replacement or exchange',
			'Store credit or SmartMart wallet balance',
			'Seller account actions or warnings',
			'Mediated agreement between parties',
			'No action if dispute is unfounded',
		],
	},
	{
		title: '7. Appeals Process',
		description: "If you're not satisfied with our initial decision:",
		points: [
			'Submit an appeal within 14 days of the decision',
			'Provide additional evidence or clarification',
			'Senior dispute resolution team will review the appeal',
			'Final decision will be communicated within 5 business days',
		],
	},
	{
		title: '8. Alternative Dispute Resolution',
		description:
			'For complex disputes that cannot be resolved through our internal process, we may suggest alternative dispute resolution methods such as mediation through recognized dispute resolution organizations in Pakistan.',
	},
	{
		title: '9. Prevention and Best Practices',
		description: 'To prevent disputes:',
		points: [
			'Read product descriptions and seller policies carefully',
			'Communicate clearly with sellers before purchasing',
			'Check seller ratings and reviews',
			'Document any issues immediately upon delivery',
			'Contact support promptly if problems arise',
		],
	},
	{
		title: '10. Contact Dispute Resolution Team',
		description:
			'For dispute-related inquiries or to file a formal dispute, contact our specialized team at disputes@smartmart.com or call +92-300-1234567. Our dispute resolution team is available Monday to Friday, 9 AM to 6 PM.',
	},
];

export default function DisputeResolutionScreen() {
	return (
		<ScrollView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			showsVerticalScrollIndicator={false}
		>
			<View className="px-5 py-4">
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-2">
						Dispute Resolution
					</Text>
					<View className="flex flex-row items-center gap-1">
						<Ionicons name="time-outline" size={16} color={COLORS.gray[400]} />
						<Text className="text-gray-400 dark:text-gray-400 font-nexa text-sm">
							Last updated: January 15, 2025
						</Text>
					</View>
				</View>

				{/* Content */}
				<View className="space-y-6">
					{disputeResolutionSections.map((section, index) => (
						<View key={index}>
							<Text className="text-sm font-nexa-extrabold text-gray-900 dark:text-white mb-3">
								{section.title}
							</Text>

							{section.description && (
								<Text
									className={`text-gray-700 text-justify dark:text-gray-300 font-nexa text-sm leading-6 ${
										section.points ? 'mb-1' : 'mb-3'
									}`}
								>
									{section.description}
								</Text>
							)}

							{section.points && (
								<View className="ml-4 space-y-2 mb-3">
									{section.points.map((point, idx) => (
										<Text
											key={idx}
											className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6"
										>
											● &nbsp;{point}
										</Text>
									))}
								</View>
							)}

							{section.steps && (
								<View className="space-y-4">
									{section.steps.map((step, stepIdx) => (
										<View
											key={stepIdx}
											// className={`mb-4 p-3 rounded-lg ${step.bg}`}
											className="mb-4 p-3 rounded-lg bg-light-surface dark:bg-gray-800"
										>
											<Text className="text-sm font-nexa-bold mb-2 text-light-pallete-700 dark:text-light-pallete-300">
												{step.stepTitle}
											</Text>
											<Text className="text-gray-700 dark:text-gray-300 font-nexa text-xs leading-6">
												{step.text}
											</Text>
										</View>
									))}
								</View>
							)}
						</View>
					))}
				</View>

				{/* Footer Notice */}
				<View className="mt-8 p-4 bg-light-pallete-50 dark:bg-green-900/20 rounded-lg mb-4">
					<View className="flex-row items-start">
						<Ionicons
							name="hammer-outline"
							size={20}
							color={COLORS.light.pallete[700]} //TODO: Add dark mode color
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-light-pallete-700 dark:text-green-200 font-nexa text-sm leading-5 flex-1">
							Our goal is always to find a fair resolution that satisfies all
							parties involved. We appreciate your patience during the dispute
							resolution process.
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
