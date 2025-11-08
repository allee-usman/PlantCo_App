import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

interface FAQItem {
	id: string;
	question: string;
	answer: string;
}

const faqData: FAQItem[] = [
	{
		id: '1',
		question: 'What is the PlantCo App?',
		answer:
			'PlantCo is an innovative e-commerce platform that uses AI-powered recommendations to help you discover products tailored to your preferences. Shop smarter with personalized suggestions and seamless checkout experience.',
	},
	{
		id: '2',
		question: 'How do I create an account?',
		answer:
			'Simply tap the "Sign Up" button on the login screen, enter your email, create a secure password, and verify your account through the email confirmation we send you. You can also sign up using your Google or Apple account for faster registration.',
	},
	{
		id: '3',
		question: 'Is the PlantCo App free to use?',
		answer:
			'Yes! The PlantCo App is completely free to download and use. There are no subscription fees or hidden charges. You only pay for the products you purchase.',
	},
	{
		id: '4',
		question: 'How do I track my order?',
		answer:
			'After placing an order, you\'ll receive a tracking number via email and SMS. You can also track your order directly in the app by going to "My Orders" in your profile section. Real-time updates will keep you informed about your delivery status.',
	},
	{
		id: '5',
		question: 'What payment methods do you accept?',
		answer:
			'We accept all major credit/debit cards (Visa, Mastercard, American Express), digital wallets (Apple Pay, Google Pay), bank transfers, and cash on delivery for selected areas.',
	},
	{
		id: '6',
		question: 'How do I return or exchange items?',
		answer:
			'You can return items within 30 days of delivery. Go to "My Orders", select the item you want to return, choose your reason, and we\'ll arrange a free pickup. Refunds are processed within 5-7 business days.',
	},
	{
		id: '7',
		question: 'How does the AI recommendation work?',
		answer:
			"Our AI analyzes your browsing history, purchase patterns, and preferences to suggest products you're most likely to love. The more you use the app, the better our recommendations become.",
	},
	{
		id: '8',
		question: 'Is my personal data secure?',
		answer:
			'Absolutely! We use industry-standard encryption to protect your data. Your personal information is never shared with third parties without your consent, and all transactions are secured with SSL encryption.',
	},
	{
		id: '9',
		question: 'How do I contact customer support?',
		answer:
			'You can reach our 24/7 customer support through the "Help & Support" section in the app, via email at support@plantCo.com, or through our live chat feature available on all screens.',
	},
	{
		id: '10',
		question: 'Do you offer international shipping?',
		answer:
			'Currently, we ship within Pakistan with plans to expand internationally soon. We offer same-day delivery in major cities and 2-3 day delivery to other areas.',
	},
];

export default function FAQScreen() {
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	const toggleExpanded = (id: string) => {
		setExpandedItems((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950 px-5 pb-5">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<ScrollView className="" showsVerticalScrollIndicator={false}>
				{/* Description */}
				<Text className="text-gray-600 dark:text-gray-300 text-sm font-nexa leading-5 mb-6 mt-2">
					An FAQ or Frequently Asked Questions section helps users find
					information quickly without needing to contact customer support.
				</Text>

				{/* FAQ Items */}
				<View className="gap-3">
					{faqData.map((item) => (
						<View
							key={item.id}
							className="bg-light-surface dark:bg-gray-800 rounded-lg overflow-hidden"
						>
							<Pressable
								onPress={() => toggleExpanded(item.id)}
								className="flex-row items-center justify-between p-4"
							>
								<Text className="flex-1 text-gray-900 dark:text-white font-nexa-bold text-base pr-3 leading-6">
									{item.question}
								</Text>
								<Ionicons
									name={
										expandedItems.includes(item.id)
											? 'caret-up-circle-outline'
											: 'caret-down-circle-outline'
									}
									size={22}
									color={
										expandedItems.includes(item.id)
											? COLORS.light.pallete[300]
											: COLORS.gray[400]
									}
								/>
							</Pressable>

							{expandedItems.includes(item.id) && (
								<View className="px-4 pb-4">
									<Text className="text-gray-600 dark:text-gray-300 font-nexa text-sm leading-5">
										{item.answer}
									</Text>
								</View>
							)}
						</View>
					))}
				</View>

				{/* Contact Support Section */}
				<View className="mt-8 p-4 bg-light-surface dark:bg-gray-800 rounded-lg mb-4">
					<Text className="text-gray-950 dark:text-gray-500 font-nexa-extrabold text-base mb-2">
						Still have questions?
					</Text>
					<Text className="font-nexa text-gray-700 dark:text-gray-400 text-sm leading-5">
						Contact our support team at{' '}
						<Text className="font-nexa-extrabold text-gray-950 dark:text-gray-200">
							support@plantco.com
						</Text>{' '}
						or{' '}
						<Link
							className="underline underline-offset-2 font-nexa-extrabold dark:text-gray-200 text-gray-950"
							href="/(root)/account/help"
						>
							Click Here
						</Link>{' '}
						to contact us for immediate assistance.
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}
