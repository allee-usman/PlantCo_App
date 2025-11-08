import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	Alert,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';

export default function ContactLegalScreen() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
		inquiryType: '',
	});

	const inquiryTypes = [
		{ id: 'copyright', label: 'Copyright Infringement' },
		{ id: 'trademark', label: 'Trademark Issues' },
		{ id: 'privacy', label: 'Privacy Concerns' },
		{ id: 'terms', label: 'Terms of Service' },
		{ id: 'compliance', label: 'Legal Compliance' },
		{ id: 'other', label: 'Other Legal Matter' },
	];

	const handleSubmit = () => {
		if (
			!formData.name.trim() ||
			!formData.email.trim() ||
			!formData.subject.trim() ||
			!formData.message.trim() ||
			!formData.inquiryType
		) {
			Alert.alert('Error', 'Please fill in all required fields');
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			Alert.alert('Error', 'Please enter a valid email address');
			return;
		}

		console.log('Legal inquiry submitted:', formData);
		Alert.alert(
			'Success',
			'Your legal inquiry has been submitted successfully. Our legal team will respond within 2-3 business days.',
			[
				{
					text: 'OK',
					onPress: () =>
						setFormData({
							name: '',
							email: '',
							subject: '',
							message: '',
							inquiryType: '',
						}),
				},
			]
		);
	};

	return (
		<ScrollView
			className="flex-1 bg-light-screen dark:bg-gray-900 px-5"
			showsVerticalScrollIndicator={false}
		>
			<View className="py-4">
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-2">
						Contact Legal Team
					</Text>
					<Text className="text-gray-600 dark:text-gray-400 font-nexa text-sm leading-6">
						For legal matters, intellectual property concerns, compliance
						issues, or other legal inquiries, please use the form below to
						contact our legal department.
					</Text>
				</View>

				{/* Contact Information Cards */}
				<View className="space-y-4 mb-6">
					{/* Email Contact */}
					<View className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-3">
						<View className="flex-row items-center mb-2">
							<Ionicons name="mail-outline" size={20} color="#3B82F6" />
							<Text className="ml-2 text-blue-900 dark:text-blue-100 font-nexa-bold text-base">
								Email Contact
							</Text>
						</View>
						<Text className="text-blue-800 dark:text-blue-200 font-nexa-bold text-sm">
							legal@smartmart.com
						</Text>
						<Text className="text-blue-700 dark:text-blue-300 font-nexa text-sm">
							Response time: 2-3 business days
						</Text>
					</View>

					{/* Phone Contact */}
					<View className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-3">
						<View className="flex-row items-center mb-2">
							<Ionicons name="call-outline" size={20} color="#10B981" />
							<Text className="ml-2 text-green-900 dark:text-green-100 font-nexa-bold text-base">
								Phone Contact
							</Text>
						</View>
						<Text className="text-green-800 dark:text-green-200 font-nexa-bold text-sm">
							+92-316-6183522
						</Text>
						<Text className="text-green-700 dark:text-green-300 font-nexa text-sm">
							Available: Monday-Friday, 9 AM - 5 PM (PKT)
						</Text>
					</View>

					{/* Mailing Address */}
					<View className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-3">
						<View className="flex-row items-start mb-2">
							<Ionicons name="location-outline" size={20} color="#8B5CF6" />
							<Text className="ml-2 text-purple-900 dark:text-purple-100 font-nexa-bold text-base">
								Mailing Address
							</Text>
						</View>
						<Text className="text-purple-700 dark:text-purple-300 font-nexa text-sm leading-5">
							SmartMart Legal Department{'\n'}
							Technology Park, Block A{'\n'}
							Lahore, Punjab 54000{'\n'}
							Pakistan
						</Text>
					</View>
				</View>

				{/* Contact Form */}
				<View className="bg-light-surface dark:bg-gray-800 rounded-lg p-4 mb-6">
					<Text className="text-lg font-nexa-extrabold text-gray-900 dark:text-white mb-4">
						Legal Inquiry Form
					</Text>

					{/* Name Field */}
					<View className="mb-4">
						<Text className="text-gray-700 dark:text-gray-300 font-nexa-bold text-sm mb-2">
							Full Name *
						</Text>
						<TextInput
							placeholder="Enter your full name"
							value={formData.name}
							onChangeText={(text) =>
								setFormData((prev) => ({ ...prev, name: text }))
							}
							className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-nexa"
							placeholderTextColor="#9CA3AF"
						/>
					</View>

					{/* Email Field */}
					<View className="mb-4">
						<Text className="text-gray-700 dark:text-gray-300 font-nexa-bold text-sm mb-2">
							Email Address *
						</Text>
						<TextInput
							placeholder="Enter your email address"
							value={formData.email}
							onChangeText={(text) =>
								setFormData((prev) => ({ ...prev, email: text }))
							}
							className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-nexa"
							placeholderTextColor="#9CA3AF"
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					</View>

					{/* Subject Field */}
					<View className="mb-4">
						<Text className="text-gray-700 dark:text-gray-300 font-nexa-bold text-sm mb-2">
							Subject *
						</Text>
						<TextInput
							placeholder="Enter the subject of your inquiry"
							value={formData.subject}
							onChangeText={(text) =>
								setFormData((prev) => ({ ...prev, subject: text }))
							}
							className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-nexa"
							placeholderTextColor="#9CA3AF"
						/>
					</View>

					{/* Inquiry Type Selector */}
					<View className="mb-4">
						<Text className="text-gray-700 dark:text-gray-300 font-nexa-bold text-sm mb-2">
							Inquiry Type *
						</Text>
						<View className="flex-wrap flex-row">
							{inquiryTypes.map((type) => (
								<Pressable
									key={type.id}
									onPress={() =>
										setFormData((prev) => ({ ...prev, inquiryType: type.id }))
									}
									className={`px-3 py-2 rounded-lg mr-2 mb-2 ${
										formData.inquiryType === type.id
											? 'bg-light-pallete-400'
											: 'bg-gray-200 dark:bg-gray-700'
									}`}
								>
									<Text
										className={`text-sm font-nexa ${
											formData.inquiryType === type.id
												? 'text-black'
												: 'text-gray-800 dark:text-gray-200'
										}`}
									>
										{type.label}
									</Text>
								</Pressable>
							))}
						</View>
					</View>

					{/* Message Field */}
					<View className="mb-4">
						<Text className="text-gray-700 dark:text-gray-300 font-nexa-bold text-sm mb-2">
							Message *
						</Text>
						<TextInput
							placeholder="Enter details of your legal inquiry"
							value={formData.message}
							onChangeText={(text) =>
								setFormData((prev) => ({ ...prev, message: text }))
							}
							className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-nexa h-32"
							placeholderTextColor="#9CA3AF"
							multiline
							textAlignVertical="top"
						/>
					</View>

					{/* Submit Button */}
					<Pressable
						onPress={handleSubmit}
						className="bg-light-pallete-400 rounded-lg py-3 items-center"
					>
						<Text className="text-black font-nexa-bold text-base">
							Submit Inquiry
						</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	);
}
