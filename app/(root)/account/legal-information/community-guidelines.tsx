import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function CommunityGuidelinesScreen() {
	return (
		<ScrollView className="flex-1 bg-white dark:bg-gray-900">
			<View className="px-4 py-4">
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-2">
						Community Guidelines
					</Text>
					<Text className="text-gray-600 dark:text-gray-400 font-nexa text-sm">
						Last updated: January 15, 2025
					</Text>
				</View>

				{/* Content */}
				<View className="space-y-6">
					{/* Section 1 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							1. Building a Positive Community
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
							SmartMart is committed to creating a safe, inclusive, and positive
							shopping environment for all users. These guidelines help ensure
							that our community remains welcoming and supportive for everyone.
						</Text>
					</View>

					{/* Section 2 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							2. Respectful Communication
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							When interacting with other users, sellers, or support staff:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Use polite and respectful language
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Avoid offensive, discriminatory, or hate speech
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Respect different opinions and perspectives
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Be constructive in feedback and criticism
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Report inappropriate behavior instead of engaging in conflicts
							</Text>
						</View>
					</View>

					{/* Section 3 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							3. Honest Reviews and Ratings
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							Reviews help other customers make informed decisions. Please
							ensure:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Reviews are based on your genuine experience
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Provide specific, helpful details about products
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Avoid fake or incentivized reviews
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Don&apos;t review products you haven&apos;t purchased
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Focus on the product, not personal attacks on sellers
							</Text>
						</View>
					</View>

					{/* Section 4 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							4. Prohibited Content and Behavior
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							The following are strictly prohibited on SmartMart:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Harassment, bullying, or threatening behavior
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Spam, promotional content, or unsolicited messaging
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• False or misleading information about products
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Inappropriate sexual content or nudity
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Violence, self-harm, or dangerous activities
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Copyright infringement or intellectual property violations
							</Text>
						</View>
					</View>

					{/* Section 5 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							5. Privacy and Personal Information
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							Protect your privacy and respect others&apos;:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Don&apos;t share personal contact information publicly
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Respect others&apos; privacy and don&apos;t share their
								information
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Use Plantco&apos;s messaging system for communication
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Report any privacy violations to our support team
							</Text>
						</View>
					</View>

					{/* Section 6 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							6. Account Security and Integrity
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							Maintain the security and authenticity of your account:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Use only one account per person
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Provide accurate and truthful information
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Don&apos;t share your account credentials
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Report suspicious activity immediately
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Don&apos;t impersonate others or create fake accounts
							</Text>
						</View>
					</View>

					{/* Section 7 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							7. Seller Community Standards
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							Sellers on SmartMart must adhere to additional standards:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Provide accurate product descriptions and images
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Respond promptly to customer inquiries
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Honor return and refund policies
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Maintain professional communication with buyers
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Comply with all applicable laws and regulations
							</Text>
						</View>
					</View>

					{/* Section 8 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							8. Reporting Violations
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							Help us maintain community standards by reporting:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Use the &qt;Report&qt; button on posts, reviews, or messages
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Contact support for serious violations
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Provide specific details about the violation
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Don&apos;t make false reports or abuse the reporting system
							</Text>
						</View>
					</View>

					{/* Section 9 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							9. Consequences for Violations
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6 mb-3">
							Depending on the severity and frequency of violations:
						</Text>
						<View className="ml-4 space-y-2">
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• First offense: Warning and content removal
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Repeated violations: Temporary account suspension
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Serious violations: Permanent account termination
							</Text>
							<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
								• Legal violations: Cooperation with law enforcement
							</Text>
						</View>
					</View>

					{/* Section 10 */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							10. Appeals Process
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
							If you believe a moderation action was taken in error, you can
							appeal by contacting community@smartmart.com within 30 days.
							Include your account details and explanation of why you believe
							the action was incorrect.
						</Text>
					</View>

					{/* Section 11 - Additional content */}
					<View>
						<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white mb-3">
							11. Updates to Guidelines
						</Text>
						<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-6">
							We may update these Community Guidelines from time to time. When
							we make changes, we will notify users through the app and update
							the &qt;Last updated&qt; date at the top of this document.
							Continued use of SmartMart after changes constitutes acceptance of
							the updated guidelines.
						</Text>
					</View>
				</View>

				{/* Footer Notice */}
				<View className="mt-8 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
					<View className="flex-row items-start">
						<Ionicons
							name="people-outline"
							size={20}
							color="#14B8A6"
							style={{ marginTop: 2, marginRight: 8 }}
						/>
						<Text className="text-teal-700 dark:text-teal-200 font-nexa text-sm leading-5 flex-1">
							Together, we can build a thriving community where everyone feels
							welcome to shop, sell, and connect. Thank you for helping us
							maintain these standards.
						</Text>
					</View>
				</View>

				{/* Contact Information */}
				<View className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
					<Text className="text-gray-900 dark:text-white font-nexa-bold text-sm mb-2">
						Questions or Concerns?
					</Text>
					<Text className="text-gray-700 dark:text-gray-300 font-nexa text-sm leading-5">
						If you have questions about these guidelines or need to report a
						violation, contact us at community@smartmart.com or use the in-app
						support feature.
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
