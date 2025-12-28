export const formatServiceType = (speciality: string): string => {
	return speciality
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
