import { BookingDetails } from '@/interfaces/interface';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { formatDate, formatTime } from './formatDate';

//TODO: Generate on Backend

// Send booking details to server. Use something like Puppeteer / wkhtmltoimage.Return a ready-made PNG/JPEG receipt to the app. This is useful if you want consistent branding/fonts that render the same across devices.

export const generateBookingReceipt = async (booking: BookingDetails) => {
	try {
		const html = `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: #f9fafb; 
              padding: 20px; 
              color: #111827;
            }
            .card {
              background: #ffffff;
              border-radius: 16px;
              padding: 20px;
              margin: 0 auto;
              max-width: 600px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            h1 {
              text-align: center;
              font-size: 22px;
              margin-bottom: 20px;
              color: #111827;
            }
            .section {
              margin-bottom: 16px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 6px 0;
            }
            .label {
              font-weight: 600;
              font-size: 14px;
              color: #374151;
            }
            .value {
              font-size: 14px;
              color: #111827;
            }
            .divider {
              border-top: 1px dashed #d1d5db;
              margin: 14px 0;
            }
            .status {
              font-weight: bold;
              text-transform: capitalize;
            }
            .status.completed { color: #16a34a; } /* green */
            .status.upcoming { color: #f59e0b; }  /* yellow */
            .status.cancelled { color: #dc2626; } /* red */
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Booking Receipt</h1>
            
            <!-- Booking Info -->
            <div class="section">
              <div class="row"><span class="label">Booking ID:</span><span class="value">${
								booking.bookingId
							}</span></div>
              <div class="row"><span class="label">Service Name:</span><span class="value">${
								booking.serviceName
							}</span></div>
              <div class="row"><span class="label">Provider:</span><span class="value">${
								booking.serviceProvider.name
							}</span></div>
              <div class="row"><span class="label">Date & Time:</span><span class="value">${formatDate(
								booking.startTime
							)} ${formatTime(booking.startTime)}</span></div>
              <div class="row"><span class="label">Duration:</span><span class="value">${
								booking.duration
							}</span></div>
              <div class="row">
                <span class="label">Status:</span>
                <span class="value status ${booking.status}">${
			booking.status
		}</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Payment Info -->
            <div class="section">
              <div class="row"><span class="label">Service Rate:</span><span class="value">Rs. ${
								booking.serviceDetails.estimatedCost
							}</span></div>
              <div class="row"><span class="label">Payment Method:</span><span class="value">${
								booking.paymentMethod.displayName
							}</span></div>
              <div class="row"><span class="label">Total:</span><span class="value">Rs. ${
								booking.serviceDetails.estimatedCost
							}</span></div>
            </div>

            <div class="divider"></div>

            <!-- Address -->
            <div class="section">
              <div class="row"><span class="label">Address:</span><span class="value">${
								booking.address
							}</span></div>
              ${
								booking.notes
									? `<div class="row"><span class="label">Notes:</span><span class="value">${booking.notes}</span></div>`
									: ''
							}
            </div>
          </div>
        </body>
      </html>
    `;

		// Generate PDF file
		const { uri } = await Print.printToFileAsync({
			html,
			base64: false,
		});

		Alert.alert('Receipt Generated!', `File saved at: ${uri}`);

		// Optional: Share the file
		if (await Sharing.isAvailableAsync()) {
			await Sharing.shareAsync(uri);
		}

		return uri;
	} catch (error) {
		console.error(error);
		Alert.alert('Error', 'Failed to generate receipt');
	}
};
