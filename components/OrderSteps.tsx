import { Text, View } from 'react-native';

interface OrderStepProps {
	number: number;
	label: string;
	isActive?: boolean;
}

const OrderStep: React.FC<OrderStepProps> = ({
	number,
	label,
	isActive = false,
}) => {
	return (
		<View className="flex-row gap-x-2 items-center">
			<View
				className={`w-5 h-5 rounded-full justify-center items-center ${
					isActive
						? 'bg-light-pallete-500 dark:bg-light-pallete-400'
						: 'bg-gray-300 dark:bg-gray-700'
				}`}
			>
				<Text
					className={`text-body-xs font-nexa-bold text-center ${
						isActive
							? 'text-white dark:text-gray-900'
							: 'text-white dark:text-gray-500'
					}`}
				>
					{number}
				</Text>
			</View>
			<Text
				className={`text-body-sm ${
					isActive
						? 'text-gray-950 dark:text-gray-50'
						: 'text-gray-400 dark:text-gray-400'
				} `}
			>
				{label}
			</Text>
		</View>
	);
};
export default OrderStep;
