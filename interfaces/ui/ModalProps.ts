import { JSX } from 'react';
import { GestureResponderEvent } from 'react-native';

export interface ModalButton {
	label: string;
	onPress: (event: GestureResponderEvent) => void;
	className?: string; // optional Tailwind classes for button container
	textClassName?: string; // optional Tailwind classes for text
}

export interface ModalProps {
	visible?: boolean;
	title: string; // main message
	description?: string; // optional description
	icon?: JSX.Element; // optional icon
	primaryButton: ModalButton; // must have
	secondaryButton?: ModalButton; // optional
	onClose?: () => void; // optional, triggered when modal is closed
}
