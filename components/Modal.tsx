import { ModalProps } from '@/interfaces/interface';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

export default function DynamicModal({
	visible,
	title,
	description,
	icon,
	primaryButton,
	secondaryButton,
	onClose,
}: ModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-center items-center dark:bg-black/70 bg-black/50">
				<View className="bg-white dark:bg-gray-800 max-w-[90%] rounded-2xl p-6 shadow-lg">
					{/* Icon */}
					{icon && <View className="mb-4 items-center">{icon}</View>}

					{/* Title */}
					<Text className="text-center text-body-lg font-nexa-extrabold leading-6 text-gray-900 dark:text-white mb-2">
						{title}
					</Text>

					{/* Description */}
					{description && (
						<Text className="text-center text-gray-600 dark:text-gray-300 mb-6 font-nexa max-w-[95%] self-center leading-5">
							{description}
						</Text>
					)}

					{/* Action Buttons */}
					<View className="flex-row justify-between items-center gap-x-4">
						{/* Secondary Button */}
						{secondaryButton && (
							<Pressable
								onPress={secondaryButton.onPress}
								className={`flex-1 rounded-lg py-3 items-center border border-gray-200 dark:border-gray-500 ${
									secondaryButton.className || ''
								}`}
							>
								<Text
									className={`font-nexa-bold text-base ${
										secondaryButton.textClassName ||
										'text-gray-800 dark:text-gray-400'
									}`}
								>
									{secondaryButton.label}
								</Text>
							</Pressable>
						)}

						{/* Primary Button */}
						<Pressable
							onPress={primaryButton.onPress}
							className={`flex-1 rounded-lg py-3 justify-center items-center ${
								primaryButton.className || 'bg-green-500'
							}`}
						>
							<Text
								className={`font-nexa-bold text-base ${
									primaryButton.textClassName || 'text-white'
								}`}
							>
								{primaryButton.label}
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}
