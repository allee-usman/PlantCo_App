import { BannerProps } from '@/interfaces/interface';
import { ImageBackground, Text, View } from 'react-native';
import CustomButton from './CustomButton';

const Props = (props: BannerProps) => {
	return (
		<View className="h-[220px] mb-4">
			<View>
				<ImageBackground
					source={props.img}
					className="rounded-[20px] overflow-hidden h-[100%]"
					resizeMode="cover"
				>
					<View className="p-6">
						<Text className="text-heading-4 text-white mb-1">
							{props.title}
						</Text>
						{props.subtitle && (
							<Text className="text-title-variant text-orange-400 mb-4">
								{props.subtitle}
							</Text>
						)}
						<View className="flex-row items-center justify-between">
							<CustomButton
								label={props.ctaLabel}
								bgVariant="primary"
								onPress={() => {}}
							/>
							{props.date && (
								<Text className="text-white text-body-sm">{props.date}</Text>
							)}
						</View>
					</View>
				</ImageBackground>
			</View>
		</View>
	);
};
export default Props;
