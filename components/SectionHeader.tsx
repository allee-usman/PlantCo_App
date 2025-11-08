import { Text, TouchableOpacity, View } from 'react-native';
interface SectionHeaderProps {
	label: string;
	rightButton?: boolean;
	rightBtnLabel?: string;
}
const SectionHeader = ({
	label,
	rightButton,
	rightBtnLabel,
}: SectionHeaderProps) => {
	return (
		<View className="flex-row items-center justify-between">
			<View className="flex flex-row items-center justify-center">
				<View className="w-[3px] h-[18px] rounded-full mr-[6px] bg-light-pallete-300 dark:bg-light-pallete-400"></View>
				<Text className="text-body font-nexa-extrabold text-gray-900 dark:text-white">
					{label}
				</Text>
			</View>
			{rightButton && (
				<TouchableOpacity
					onPress={() => {}}
					activeOpacity={0.7}
					className="py-[6px] items-center flex-row"
					// className="border-[1.125px] border-gray-300 dark:border-gray-600 rounded-full px-[10px] py-[6px]"
				>
					<Text className="text-sm font-nexa-bold text-light-pallete-500 dark:text-light-pallete-400 text-center">
						{rightBtnLabel}
					</Text>
					{/* <Ionicons
						name="chevron-forward"
						size={14}
						color="#a1a1aa"
						className="ml-[2px]"
					/> */}
				</TouchableOpacity>
			)}
		</View>
	);
};
export default SectionHeader;
