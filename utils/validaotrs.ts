import validator from 'validator';

// Pakistan phone number regex (03xx or +92 formats)
const PAKISTAN_PHONE_REGEX = /^(?:\+92|0)?3[0-9]{9}$/;

// CNIC regex (e.g., 12345-1234567-1)
const PAKISTAN_CNIC_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;

export type ValidationResult = string | null;

export const validations = {
	// Email
	email: (value: string): ValidationResult => {
		if (!value) return 'Email is required';
		if (!validator.isEmail(value)) return 'Enter a valid email address';
		return null;
	},

	// Password (min 6 chars, strong)
	password: (value: string): ValidationResult => {
		if (!value) return 'Password is required';
		if (value.length < 6) return 'Password must be at least 6 characters';
		if (!/[A-Z]/.test(value))
			return 'Password must include an uppercase letter';
		if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
		if (!/[0-9]/.test(value)) return 'Password must include a number';
		return null;
	},

	// Confirm Password
	confirmPassword: (
		value: string,
		formData?: { password?: string }
	): ValidationResult => {
		if (!value) return 'Confirm password is required';
		if (value !== formData?.password) return 'Passwords do not match';
		return null;
	},

	// Current Password
	currentPassword: (value: string): ValidationResult => {
		if (!value) return 'Current password is required';
		if (value.length < 6) return 'Password must be at least 6 characters';
		return null;
	},

	// Full Name (2+ words)
	fullName: (value: string): ValidationResult => {
		if (!value) return 'Full name is required';
		if (value.trim().split(' ').length < 2)
			return 'Please enter first and last name';
		if (!/^[a-zA-Z\s]+$/.test(value))
			return 'Full name can only contain letters and spaces';
		return null;
	},

	// Username
	username: (value: string): ValidationResult => {
		if (!value) return 'Username is required';
		if (value.length < 3) return 'Username must be at least 3 characters';
		if (!/^[a-zA-Z0-9_]+$/.test(value))
			return 'Only letters, numbers, and underscores allowed';
		return null;
	},

	// Pakistani Phone
	phone: (value: string): ValidationResult => {
		if (!value) return 'Phone number is required';
		if (!PAKISTAN_PHONE_REGEX.test(value))
			return 'Enter a valid Pakistani phone (e.g., 03001234567 or +923001234567)';
		return null;
	},

	// OTP (4–6 digits)
	otp: (value: string): ValidationResult => {
		if (!value) return 'OTP is required';
		if (!/^\d{4,6}$/.test(value)) return 'Enter a valid 4–6 digit OTP';
		return null;
	},

	// CNIC
	cnic: (value: string): ValidationResult => {
		if (!value) return 'CNIC is required';
		if (!PAKISTAN_CNIC_REGEX.test(value))
			return 'Enter a valid CNIC (e.g., 12345-1234567-1)';
		return null;
	},

	// Product Title
	productTitle: (value: string): ValidationResult => {
		if (!value) return 'Product title is required';
		if (value.length < 3) return 'Product title must be at least 3 characters';
		return null;
	},

	// Price
	price: (value: string): ValidationResult => {
		if (!value) return 'Price is required';
		if (!validator.isNumeric(value)) return 'Price must be a number';
		if (parseFloat(value) <= 0) return 'Price must be greater than 0';
		return null;
	},

	// Generic Required
	required: (value: string, fieldName = 'Field'): ValidationResult => {
		if (!value || !value.trim()) return `${fieldName} is required`;
		return null;
	},
};

// ✅ Single field validation
export const validateField = (
	field: keyof typeof validations,
	value: string,
	formData?: Record<string, string>
): ValidationResult => {
	return validations[field](value, formData);
};

// ✅ Validate multiple fields in form
export const validateForm = (
	formData: Record<string, string>,
	fields: (keyof typeof validations)[]
): Record<string, string | null> => {
	const errors: Record<string, string | null> = {};
	fields.forEach((field) => {
		errors[field] = validations[field](formData[field], formData);
	});
	return errors;
};
