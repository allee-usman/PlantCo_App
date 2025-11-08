import { useColorScheme } from 'nativewind';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import CustomButton from './CustomButton';

interface FixedBottomButtonProps {
	label: string;
	onPress: () => void;
	loading?: boolean;
	disabled?: boolean;
	bgVariant?:
		| 'primary'
		| 'secondary'
		| 'danger'
		| 'outline'
		| 'success'
		| 'gradient';
	textVariant?:
		| 'primary'
		| 'secondary'
		| 'outline'
		| 'danger'
		| 'success'
		| 'gradient';
	secondaryLabel?: string;
	onSecondaryPress?: () => void;
	showSecondary?: boolean; // new prop
}

const FixedBottomButton: React.FC<FixedBottomButtonProps> = ({
	label,
	onPress,
	loading = false,
	disabled = false,
	bgVariant = 'primary',
	textVariant = 'primary',
	secondaryLabel,
	onSecondaryPress,
	showSecondary = false, // default false
}) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<View
			style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
			}}
		>
			<SafeAreaView
				className={`p-4 ${isDark ? 'bg-gray-950' : 'bg-light-screen'}`}
			>
				{showSecondary && secondaryLabel && onSecondaryPress && (
					<CustomButton
						label={secondaryLabel}
						onPress={onSecondaryPress}
						bgVariant="outline"
						textVariant="outline"
						className="mb-2 border-0"
					/>
				)}

				<CustomButton
					label={label}
					onPress={onPress}
					loading={loading}
					disabled={disabled}
					bgVariant={bgVariant}
					textVariant={textVariant}
				/>
			</SafeAreaView>
		</View>
	);
};

export default FixedBottomButton;
