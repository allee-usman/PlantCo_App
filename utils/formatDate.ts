import dayjs from 'dayjs'; // lightweight date lib

export const formatDate = (iso: string) => {
	return new Date(iso).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};
export const formatTime = (iso: string) => {
	const date = new Date(iso);
	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	if (hours === 0) hours = 12; // convert 0 to 12 for 12 AM/PM
	const hoursStr = hours.toString().padStart(2, '0');
	return `${hoursStr}:${minutes} ${ampm}`;
};

export const formatDateTime = (iso: string) => {
	if (iso === 'pending') return 'Pending'; // handle placeholder
	const date = new Date(iso);
	if (isNaN(date.getTime())) return ''; // fallback for invalid date
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const getFinishTime = (startTimestamp: string, duration: number) => {
	// Parse MongoDB timestamp
	const start = dayjs(startTimestamp);

	// Convert duration (hours, fractional) → minutes
	const minutes = duration * 60;

	// Add duration to start
	const finish = start.add(minutes, 'minute');

	// Return formatted time
	return formatDateTime(finish.toISOString());
};

// Format duration (e.g. 1 hr 30 min
export const formatDuration = (hours: number): string => {
	const wholeHours = Math.floor(hours);
	const minutes = Math.round((hours - wholeHours) * 60);

	if (wholeHours === 0) return `${minutes} min`;
	if (minutes === 0) return `${wholeHours} hr`;
	return `${wholeHours} hr ${minutes} min`;
};

export const formatShortDate = (iso: string) => {
	const date = new Date(iso);
	return date.toLocaleDateString('en-US', {
		month: 'short', // Oct, Aug
		day: 'numeric', // 11, 25
	});
};

export const formatCompactDate = (iso: string) => {
	return new Date(iso).toLocaleDateString('en-US', {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
	});
};
