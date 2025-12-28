import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
interface ProfileHeaderProps {
	imageSource: ImageSourcePropType;
	name: string;
	slogan: string;
	verified: boolean;
	rating: number;
	reviewCount: number;
	completedJobs: number;
	completionRate: number;
	responseTime: number;
	status: 'available' | 'busy' | 'on_leave';
}

const StatsItem: React.FC<{
	label: string;
	mainValue: string | number;
	subValue?: string | number;
	iconSrc?: ImageSourcePropType;
}> = ({ label, mainValue, subValue, iconSrc }) => (
	<View className="items-center flex-1 bg-gray-50 dark:bg-gray-800 mx-1 rounded-lg">
		{iconSrc && (
			<View className=" p-1.5 rounded-md">
				<Image
					source={iconSrc}
					className="size-6"
					tintColor={COLORS.gray[700]}
				/>
			</View>
		)}
		<Text className="text-xs text-center leading-4 font-nexa text-gray-500 dark:text-gray-400">
			{label}
		</Text>
		<View className="flex-row items-center gap-1 mb-1">
			<Text className="text-sm text-center font-nexa-extrabold text-gray-900 dark:text-gray-100">
				{mainValue}
			</Text>
			{subValue && (
				<Text className="text-xs text-center font-nexa text-gray-500 dark:text-gray-400">
					({subValue})
				</Text>
			)}
		</View>
	</View>
);

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	imageSource,
	name,
	slogan,
	verified,
	rating,
	reviewCount,
	completedJobs,
	completionRate,
	responseTime,
	status,
}) => {
	return (
		<View className="bg-white dark:bg-gray-900 px-4 py-5 mb-4 mx-4 rounded-lg">
			{/* Profile Image & Basic Info */}
			<View className="flex-col items-center justify-center mb-4">
				<View className="relative">
					<Image
						source={imageSource}
						className="size-28 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-900"
						resizeMode="cover"
					/>
					{verified && (
						<View className="absolute bottom-0 right-0 bg-white dark:bg-gray-900 rounded-full p-1">
							<Image
								source={icons.verifiedBadge}
								className="size-6"
								tintColor={COLORS.light.pallete[400]}
							/>
						</View>
					)}
				</View>

				<Text className="text-xl text-center font-nexa-extrabold text-gray-900 dark:text-gray-100 mt-3">
					{name}
				</Text>
				<Text className="text-sm font-nexa mx-2 text-center text-gray-600 dark:text-gray-400 mt-1">
					&quot;{slogan}&quot;
				</Text>
			</View>

			{/* Stats Row */}
			<View className="flex-row items-center justify-between mb-4">
				<StatsItem
					label="Average Rating"
					mainValue={rating}
					subValue={reviewCount}
					iconSrc={icons.star}
				/>

				{/* <View className="w-px h-14 bg-gray-200 dark:bg-gray-800" /> */}

				<StatsItem
					label="Completed Jobs"
					mainValue={completedJobs}
					iconSrc={icons.checklist}
				/>

				{/* <View className="w-px h-14 bg-gray-200 dark:bg-gray-800" /> */}

				<StatsItem
					label="Completion Rate"
					mainValue={`${completionRate}%`}
					iconSrc={icons.doubleTick}
				/>

				{/* <View className="w-px h-14 bg-gray-200 dark:bg-gray-800" /> */}

				<StatsItem
					label="Response Time"
					mainValue={`${responseTime}h`}
					iconSrc={icons.clock}
				/>
			</View>

			{/* Status Badge */}
			{/* <View className="items-center absolute top-3 right-3">
				<StatusBadge status={status} />
			</View> */}
		</View>
	);
};
export default ProfileHeader;
