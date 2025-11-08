import React from 'react';
import { View, ViewStyle } from 'react-native';
import SectionHeader from './SectionHeader';

interface SectionProps {
	title?: string;
	containerStyle?: ViewStyle;
	children: React.ReactNode;
	headerAction?: boolean;
	headerActionLabel?: string;
}

const Section: React.FC<SectionProps> = ({
	title,
	children,
	containerStyle,
	headerAction,
	headerActionLabel,
}) => {
	return (
		<View>
			{title && (
				<View style={{ paddingHorizontal: 16 }}>
					<SectionHeader
						label={title}
						rightButton={headerAction}
						rightBtnLabel={headerActionLabel}
					/>
				</View>
			)}
			<View className="mb-6 w-full h-auto rounded-xl" style={containerStyle}>
				{children}
			</View>
		</View>
	);
};

export default Section;
