import { IOrder, IOrderSummary } from '@/types/order.types';

export const mapOrderToSummary = (order: IOrder): IOrderSummary => {
	const latestTimelineEntry = order.timeline?.[order.timeline.length - 1];

	return {
		_id: order._id,
		orderNumber: order.orderNumber,
		placedDate: order.createdAt,
		totalItems:
			order.totalItems ??
			order.items.reduce((total, item) => total + item.quantity, 0),
		totalPrice: order.pricing?.total ?? 0,
		status: order.status as IOrderSummary['status'],
		statusDate: latestTimelineEntry
			? latestTimelineEntry.date
			: order.createdAt,
		expanded: false,
	};
};
