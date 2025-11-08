import { COLORS } from '@/constants/colors';
import { InfoModalProps } from '@/interfaces/props';
import { ModalType } from '@/interfaces/types';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, View } from 'react-native';
import CustomButton from './CustomButton';

const typeConfig: Record<
	ModalType,
	{ icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
	success: { icon: 'checkmark-circle', color: COLORS.state.success },
	error: { icon: 'close-circle', color: COLORS.state.error },
	warning: { icon: 'warning', color: COLORS.state.warning },
	info: { icon: 'information-circle', color: COLORS.state.info },
};

const InfoModal: React.FC<InfoModalProps> = ({
	visible,
	type = 'info',
	title,
	description,
	primaryButton,
	secondaryButton,
	onClose,
	iconColor,
}) => {
	const { icon, color } = typeConfig[type];

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-center items-center bg-black/40">
				<View className="bg-white dark:bg-gray-700 p-6 pb-3 rounded-2xl w-[85%] items-center">
					<Ionicons name={icon} size={60} color={iconColor ?? color} />
					<Text className="text-xl font-nexa-heavy text-gray-900 dark:text-white  text-center mt-3 mb-2">
						{title}
					</Text>
					{description ? (
						<Text className="text-body-sm text-center leading-5 text-gray-600 dark:text-gray-300 mb-6">
							{description}
						</Text>
					) : null}

					<View className="flex-row gap-x-3">
						{secondaryButton && (
							<CustomButton
								label={secondaryButton.label}
								onPress={secondaryButton.onPress}
								textVariant={secondaryButton.variant ?? 'secondary'}
								bgVariant={secondaryButton.variant ?? 'secondary'}
								className={`${secondaryButton.className} w-[135px] h-[45px] px-3`}
							/>
						)}

						{primaryButton && (
							<CustomButton
								label={primaryButton.label}
								onPress={primaryButton.onPress}
								className={`${primaryButton.className} w-[135px] h-[45px] px-3`}
								bgVariant={primaryButton.variant ?? 'success'}
								textVariant={primaryButton.variant ?? 'success'}
							/>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default InfoModal;
