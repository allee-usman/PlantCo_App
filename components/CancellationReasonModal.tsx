import { ICancellationInfo } from '@/types/booking.types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface CancellationReasonModalProps {
	visible: boolean;
	cancellation: ICancellationInfo;
	onClose?: () => void;
}

const CancellationReasonModal = ({
	visible,
	onClose,
	cancellation,
}: CancellationReasonModalProps) => {
	if (!cancellation) return null;

	const cancelledBy = cancellation.cancelledBy?.replace('_', ' ') ?? 'Unknown';

	const cancelledAtFormatted = cancellation.cancelledAt
		? new Date(cancellation.cancelledAt).toLocaleString()
		: 'Not available';

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			{/* Dimmed background */}
			<View className="flex-1 bg-black/40 justify-end">
				{/* Card */}
				<View className="bg-white dark:bg-gray-900 p-5 rounded-t-3xl">
					<View className="h-1.5 w-16 bg-gray-300 dark:bg-gray-700 self-center rounded-full mb-3" />

					<Text className="text-lg font-nexa-extrabold text-gray-900 dark:text-gray-100 mb-2">
						Booking Cancelled
					</Text>

					{/* Cancelled by */}
					<View className="mb-2">
						<Text className="text-body-xs text-gray-400">Cancelled By</Text>
						<Text className="text-body-sm font-nexa-bold text-gray-800 dark:text-gray-200">
							{cancelledBy.toUpperCase()}
						</Text>
					</View>

					{/* Cancelled date */}
					<View className="mb-2">
						<Text className="text-body-xs text-gray-400">Cancelled At</Text>
						<Text className="text-body-sm font-nexa-bold text-gray-800 dark:text-gray-200">
							{cancelledAtFormatted}
						</Text>
					</View>

					{/* Reason */}
					<View className="mt-2">
						<Text className="text-body-xs text-gray-400 mb-1">Reason</Text>
						<Text className="text-body text-gray-700 dark:text-gray-300">
							{cancellation.reason || 'No reason provided.'}
						</Text>
					</View>

					{/* Close button */}
					<TouchableOpacity
						onPress={onClose}
						className="mt-5 h-[44px] rounded-full bg-light-pallete-400 justify-center items-center"
					>
						<Text className="text-gray-900 font-nexa-bold text-body-sm">
							Close
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};
export default CancellationReasonModal;
