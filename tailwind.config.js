/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: [
		'./App.tsx',
		'./app/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
	],
	presets: [require('nativewind/preset')],
	darkMode: 'class',
	theme: {
		// Custom font families - properly mapped to font weights
		fontFamily: {
			// Primary Nexa font family with proper fallbacks
			'nexa-thin': ['Nexa-100', 'system-ui', 'sans-serif'],
			'nexa-light': ['Nexa-300', 'system-ui', 'sans-serif'],
			nexa: ['Nexa-400', 'system-ui', 'sans-serif'],
			'nexa-italic': ['Nexa-400-Italic', 'system-ui', 'sans-serif'],
			'nexa-book': ['Nexa-500', 'system-ui', 'sans-serif'],
			'nexa-bold': ['Nexa-600', 'system-ui', 'sans-serif'],
			'nexa-extrabold': ['Nexa-700', 'system-ui', 'sans-serif'],
			'nexa-heavy': ['Nexa-800', 'system-ui', 'sans-serif'],
			'nexa-black': ['Nexa-900', 'system-ui', 'sans-serif'],

			// Secondary font family
			montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
		},

		// Optimized font sizes with proper line heights and letter spacing
		fontSize: {
			// Body text sizes
			xs: ['12px'],
			sm: ['14px'],
			base: ['16px'],
			lg: ['18px'],

			// Heading sizes
			xl: ['20px'],
			'2xl': ['24px'],
			'3xl': ['28px'],
			'4xl': [
				'32px',
				{
					letterSpacing: '-0.025em',
				},
			],
			'5xl': [
				'36px',
				{
					letterSpacing: '-0.025em',
				},
			],
			'6xl': [
				'42px',
				{
					letterSpacing: '-0.05em',
				},
			],
		},

		extend: {
			colors: {
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
						400: '#a5e239', // light default
						500: '#86c81a', // dark default
						600: '#67a010',
						700: '#4f7a11',
						800: '#406014',
						900: '#375215',
						950: '#1b2d06',
					},

					// Text Colors
					title: '#172505', // titles, product name
					subtitle: '#1c2d06', // section title, card titles, labels for grouped content
					disabled: '#9CA3AF', // Added missing disabled color
					inactive: '#6B7280', // Added missing inactive color
				},

				// Dark theme colors
				dark: {
					// Base Backgrounds
					screen: '#1d212d',
					surface: '#242c39',
					accent: '#00a377',

					// Dark brand color palette
					pallete: {
						50: '#eafff6',
						100: '#cdfee8',
						200: '#a0fad6',
						300: '#63f2c1',
						400: '#26e1a7',
						500: '#01c38d', // default
						600: '#00a377',
						700: '#008262',
						800: '#00674e',
						900: '#005442',
						950: '#003027',
					},

					// Text Colors
					title: '#FFFFFF', // titles, product name
					subtitle: '#9CA3AF', // section title, card titles, labels for grouped content
				},
			},
			boxShadow: {
				'3xl': '0 10px 40px rgba(0, 0, 0, 0.1)',
			},
		},
	},
	// SAFELIST: include classes that Tailwind may miss because they are generated dynamically
	// - keep this list small & explicit where possible
	safelist: [
		// status colors (text + dark variants)
		'text-green-600',
		'dark:text-green-500',
		'text-orange-400',
		'dark:text-orange-300',
		'text-orange-500',
		'dark:text-orange-400',
		'text-red-600',
		'dark:text-red-400',
		'text-red-500',
		'dark:text-red-500',

		// payment method colors
		'text-blue-600',
		'dark:text-blue-400',
		'text-purple-600',
		'dark:text-purple-400',
		'text-teal-600',
		'dark:text-teal-400',

		// palette backgrounds you use dynamically
		'bg-light-pallete-500',
		'dark:bg-dark-pallete-500', // if you reference this anywhere

		// commonly used utility classes that might be constructed dynamically
		'bg-light-screen',
		'dark:bg-gray-950',
		'bg-light-surface',
		'dark:bg-gray-800',
		'shadow-sm',
		'shadow-3xl',

		// font helpers (if you create class strings dynamically)
		'font-nexa',
		'font-nexa-bold',
		'font-nexa-extrabold',
		'font-nexa-heavy',

		// small layout utilities you might toggle dynamically
		'border-red-600',
		'rounded-full',
	],

	plugins: [],
	debug: true,
};
