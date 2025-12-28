import React from 'react';
import { Text, View } from 'react-native';

interface PillBadgeProps {
	label: string;
	bgColor?: string; // tailwind bg color or custom
	textColor?: string; // tailwind text color or custom
	paddingY?: string; // tailwind padding-y, e.g., 'py-1'
	paddingX?: string; // tailwind padding-x, e.g., 'px-3'
	textSize?: string; // tailwind text size, e.g., 'text-sm'
	className?: string; // additional tailwind classes
}

const PillBadge: React.FC<PillBadgeProps> = ({
	label,
	bgColor = 'bg-teal-100',
	textColor = 'text-teal-800',
	paddingY = 'py-1',
	paddingX = 'px-2.5',
	textSize = 'text-xs',
	className = '',
}) => {
	return (
		<View
			className={`${bgColor} ${paddingY} ${paddingX} rounded-full self-start ${className}`}
		>
			<Text className={`${textColor} ${textSize} font-nexa-bold`}>{label}</Text>
		</View>
	);
};

export default PillBadge;
