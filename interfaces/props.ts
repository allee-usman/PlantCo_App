import { ModalType, User } from './types';

export interface ProfileHeaderProps {
	user: User | null;
	isDark: boolean;
}

export interface InfoModalProps {
	visible: boolean;
	type?: ModalType;
	title: string;
	description?: string;
	primaryButton?: {
		label: string;
		onPress: () => void;
		className?: string;
		textClassName?: string;
		variant?:
			| 'primary'
			| 'secondary'
			| 'danger'
			| 'outline'
			| 'success'
			| 'gradient';
	};
	secondaryButton?: {
		label: string;
		onPress: () => void;
		className?: string;
		textClassName?: string;
		variant?:
			| 'primary'
			| 'secondary'
			| 'danger'
			| 'outline'
			| 'success'
			| 'gradient';
	};
	onClose?: () => void; // fallback close
	iconColor?: string;
}
