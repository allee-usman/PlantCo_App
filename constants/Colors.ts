// colors.ts

export const COLORS = {
	gray: {
		50: '#fafafa',
		100: '#f4f4f5',
		200: '#e4e4e7',
		300: '#d4d4d8',
		400: '#a1a1aa',
		500: '#71717a',
		600: '#52525b',
		700: '#3f3f46',
		800: '#27272a',
		900: '#18181b',
		950: '#09090b',
	},

	state: {
		error: '#EF4444',
		success: '#22C55E',
		warning: '#F59E0B',
		info: '#3B82F6',
	},

	primary: '#6CC51D', // brand main color
	secondary: '#01c38d',

	light: {
		// Base Backgrounds
		screen: '#F7F7FF',
		surface: '#FFFFFF',
		accent: '#4d7111',

		// Light brand color palette
		pallete: {
			50: '#f7fee7',
			100: '#edfbcc',
			200: '#daf79f',
			300: '#b8ed55', //tabbar default
			400: '#a5e239', //light default
			500: '#86c81a', //dark default
			600: '#67a010',
			700: '#4f7a11',
			800: '#406014',
			900: '#375215',
			950: '#1b2d06',
		},

		// Text Colors
		blackDefault: '#323430', // titles, product name
		blackVariant: '#333333', // tabbar bg
		subtitle: '#1c2d06', // section title, card titles, labels
		disabled: '#9CA3AF',
		inactive: '#6B7280',

		// Alert Colors
		success: {
			bg: '#dcfce7',
			text: '#166534',
		},
		error: {
			bg: '#fee2e2',
			text: '#b91c1c',
		},
		warning: {
			bg: '#fef9c3',
			text: '#92400e',
		},
	},

	dark: {
		// Base Backgrounds
		screen: '#18181b',
		surface: '#27272a',
		accent: '#86c81a',

		// Dark brand color palette (mirrors light but darker context)
		pallete: {
			50: '#1b2d06',
			100: '#375215',
			200: '#406014',
			300: '#4f7a11',
			400: '#67a010',
			500: '#86c81a',
			600: '#a5e239',
			700: '#b8ed55',
			800: '#daf79f',
			900: '#edfbcc',
			950: '#f7fee7',
		},

		// Text Colors
		whiteDefault: '#F9FAFB',
		whiteVariant: '#E5E7EB',
		subtitle: '#D1D5DB',
		disabled: '#6B7280',
		inactive: '#9CA3AF',

		// Alert Colors
		success: {
			bg: '#14532d',
			text: '#bbf7d0',
		},
		error: {
			bg: '#450a0a',
			text: '#fecaca',
		},
		warning: {
			bg: '#78350f',
			text: '#fde68a',
		},
	},

	// Shadows
	shadow: {
		'3xl': '0 10px 40px rgba(0, 0, 0, 0.1)',
	},
};
