import { CreateOrderPayload, IOrder } from '@/types/order.types';
import api from '@/utils/api';

// Create a new order
export const createOrder = async (
	payload: CreateOrderPayload
): Promise<IOrder> => {
	const { data } = await api.post('customers/orders', payload);
	return data.order;
};

// Get logged-in customer orders
export const getMyOrders = async (): Promise<IOrder[]> => {
	const { data } = await api.get('customers/orders');
	return data.orders;
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<IOrder> => {
	const { data } = await api.get(`customers/orders/${orderId}`);
	return data.order;
};

// Cancel an order
export const cancelOrder = async (orderId: string): Promise<IOrder> => {
	const { data } = await api.patch(`customers/orders/${orderId}/cancel`);
	return data.order;
};

// Update order status (Admin/Vendor)
export const updateOrderStatus = async (
	orderId: string,
	newStatus: string
): Promise<IOrder> => {
	const { data } = await api.patch(`/orders/${orderId}/status`, { newStatus });
	return data.order;
};

//  Mark order as delivered (Admin/Vendor)
export const markOrderAsDelivered = async (
	orderId: string
): Promise<IOrder> => {
	const { data } = await api.patch(`/orders/${orderId}/delivered`);
	return data.order;
};

//  Refund order (Admin only)
export const refundOrder = async (orderId: string): Promise<IOrder> => {
	const { data } = await api.patch(`/orders/${orderId}/refund`);
	return data.order;
};

// Admin: get all orders
export const getAllOrders = async (): Promise<IOrder[]> => {
	const { data } = await api.get('/orders/admin/all');
	return data.orders;
};
