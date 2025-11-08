import React, { useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';

interface ContactModalProps {
	visible: boolean;
	onClose: () => void;
}

export default function ContactModal({ visible, onClose }: ContactModalProps) {
	const [contactData, setContactData] = useState<{
		email: string;
		msg: string;
	}>({
		email: '',
		msg: '',
	});

	const handleEmailChange = (text: string) => {
		setContactData((prev) => ({ ...prev, email: text }));
	};

	const handleMessageChange = (text: string) => {
		setContactData((prev) => ({ ...prev, msg: text }));
	};

	const handleSubmit = () => {
		// Basic validation
		if (!contactData.email.trim() || !contactData.msg.trim()) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(contactData.email)) {
			Alert.alert('Error', 'Please enter a valid email address');
			return;
		}
		// Submit logic here
		console.log('Contact Data:', contactData);
		Alert.alert('Success', 'Your complaint has been submitted successfully!', [
			{
				text: 'OK',
				onPress: () => {
					setContactData({ email: '', msg: '' }); // Reset form
					onClose();
				},
			},
		]);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable className="flex-1 justify-center items-center bg-black/50">
				<Pressable onPress={() => {}}>
					<View className="bg-light-surface dark:bg-gray-800 w-[90%] rounded-2xl p-6 shadow-lg">
						{/* Title */}
						<Text className="text-center text-body-lg font-nexa-extrabold leading-6 text-gray-900 dark:text-white mb-2">
							Submit Complaint
						</Text>
						{/* Description */}
						<Text className="text-center text-gray-600 dark:text-gray-300 mb-6 font-nexa max-w-[95%] self-center leading-5">
							Please provide your email and describe your complaint below.
						</Text>
						{/* Input Fields */}
						<View className="mb-6 space-y-4">
							<TextInput
								placeholder="Enter your email"
								value={contactData.email}
								onChangeText={handleEmailChange}
								keyboardType="email-address"
								autoCapitalize="none"
								className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-nexa mb-3 min-h-[45px]"
								placeholderTextColor="#9CA3AF"
							/>
							<TextInput
								placeholder="Write your complain here..."
								value={contactData.msg}
								onChangeText={handleMessageChange}
								multiline={true}
								numberOfLines={4}
								textAlignVertical="top"
								className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-nexa min-h-[100px]"
								placeholderTextColor="#9CA3AF"
							/>
						</View>
						{/* Buttons */}
						<View className="space-y-3">
							{/* Submit Button */}
							<Pressable //TODO: Replace it with button component
								onPress={handleSubmit}
								className="w-full rounded-lg py-3 items-center mt-3 dark:bg-light-pallete-500 bg-light-pallete-300 mb-1"
							>
								<Text className="font-nexa-bold text-base text-gray-900 dark:text-gray-100">
									Submit
								</Text>
							</Pressable>
							{/* Cancel Button */}
							<Pressable
								onPress={onClose}
								className="w-full rounded-lg py-3 items-center mt-2 bg-transparent border border-gray-500 dark:border-gray-600"
							>
								<Text className="font-nexa-bold text-base text-gray-500 dark:text-gray-400">
									Cancel
								</Text>
							</Pressable>
						</View>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}
