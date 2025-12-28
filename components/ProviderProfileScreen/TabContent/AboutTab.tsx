import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import {
	ServiceProviderProfile,
	WeekDay,
	WorkingHours,
} from '@/types/user.types';
import { formatServiceType } from '@/utils/service.utils';
import React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

interface AboutSectionProps {
	aboutData: ServiceProviderProfile;
	memberSince: string;
	isDark: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
	title,
	children,
}) => (
	<View className="mb-5">
		<Text className="text-base font-nexa-extrabold text-gray-900 dark:text-gray-100 mb-2">
			{title}
		</Text>
		{children}
	</View>
);

const Row: React.FC<{
	children: React.ReactNode;
	icon: ImageSourcePropType;
	isDark: boolean;
}> = ({ children, icon, isDark }) => (
	<View className="flex-row items-center gap-2">
		<Image
			source={icon}
			className="size-5"
			tintColor={isDark ? COLORS.gray[400] : COLORS.gray[600]}
		/>
		<Text className="text-sm font-nexa text-gray-700 dark:text-gray-300">
			{children}
		</Text>
	</View>
);
interface KeyValueProps {
	label: string;
	value?: string | WeekDay[] | WorkingHours;
}
const formatValue = (value?: string | WeekDay[] | WorkingHours) => {
	if (!value) return '—';

	// Array of days → format as "Monday - Sunday"
	if (Array.isArray(value)) {
		const first = value[0];
		const last = value[value.length - 1];

		const capitalize = (d: string) => d.charAt(0).toUpperCase() + d.slice(1);

		if (first && last) return `${capitalize(first)} - ${capitalize(last)}`;
		return '—';
	}

	// Working hours object
	if (typeof value === 'object') {
		if (value.start && value.end) {
			return `${value.start} - ${value.end}`;
		}
		return 'Not specified';
	}

	// String
	return value;
};

const KeyValue: React.FC<KeyValueProps> = ({ label, value }) => (
	<View className="flex-row items-center justify-between last:mt-2">
		<Text className="text-sm font-nexa-bold text-gray-700 dark:text-gray-300">
			{label}
		</Text>
		<Text className="text-sm font-nexa text-gray-600 dark:text-gray-400">
			{formatValue(value)}
		</Text>
	</View>
);

const AboutSection: React.FC<AboutSectionProps> = ({
	aboutData,
	memberSince,
	isDark,
}) => {
	return (
		<View className="bg-white px-4 py-4 rounded-xl">
			{/* Description */}
			<Section title="About">
				<Text className="text-sm font-nexa text-justify text-gray-700 dark:text-gray-300 leading-5">
					{aboutData.description}
				</Text>
			</Section>

			{/* Specialities */}
			<Section title="Specialities">
				<View className="flex-row flex-wrap gap-2">
					{aboutData?.experience?.specializations?.map((speciality, index) => (
						<View
							key={index}
							className="bg-light-pallete-50 dark:bg-light-pallete-900/20 px-3 py-2 rounded-lg border border-light-pallete-200 dark:border-light-pallete-800"
						>
							<Text className="text-xs font-nexa-bold text-light-pallete-700 dark:text-light-pallete-400">
								{formatServiceType(speciality)}
							</Text>
						</View>
					))}
				</View>
			</Section>

			{/* Experience */}
			<Section title="Experience">
				<Row icon={icons.briefcase} isDark={isDark}>
					{aboutData?.experience?.yearsInBusiness}+ years in the field
				</Row>
			</Section>

			{/* Location */}
			<Section title="Location">
				<Row icon={icons.locationOutline} isDark={isDark}>
					{aboutData?.businessLocation?.address?.fullAddress || 'N/A'}
				</Row>
			</Section>

			{/* Working Hours */}
			<Section title="Working Hours">
				<View className="bg-light-pallete-50 dark:bg-light-pallete-900/20 p-4 rounded-xl border border-light-pallete-200 dark:border-light-pallete-800">
					<KeyValue label="Days" value={aboutData?.availability?.workingDays} />
					<KeyValue
						label="Hours"
						value={aboutData?.availability?.workingHours}
					/>
				</View>
			</Section>

			{/* Member Since */}
			<Section title="Member Since">
				<Text className="text-sm font-nexa text-gray-700 dark:text-gray-300">
					Joined in {new Date(memberSince).getFullYear()}
				</Text>
			</Section>
		</View>
	);
};

export default AboutSection;
