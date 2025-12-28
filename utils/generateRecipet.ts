import { IBooking } from '@/types/booking.types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { formatDate, formatTime } from './formatDate';

//TODO: Generate on Backend

// Send booking details to server. Use something like Puppeteer / wkhtmltoimage.Return a ready-made PNG/JPEG receipt to the app. This is useful if you want consistent branding/fonts that render the same across devices.

export const generateBookingReceipt = async (booking: IBooking) => {
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
              padding: 24px;
              margin: 0 auto;
              max-width: 650px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            h1 {
              text-align: center;
              font-size: 24px;
              margin-bottom: 8px;
              color: #111827;
              font-weight: 700;
            }
            .subtitle {
              text-align: center;
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 24px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 12px;
              padding-bottom: 6px;
              border-bottom: 2px solid #e5e7eb;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 4px 0;
            }
            .label {
              font-weight: 600;
              font-size: 14px;
              color: #374151;
            }
            .value {
              font-size: 14px;
              color: #111827;
              text-align: right;
              max-width: 60%;
            }
            .divider {
              border-top: 1px dashed #d1d5db;
              margin: 20px 0;
            }
            .status {
              font-weight: bold;
              text-transform: capitalize;
              padding: 4px 12px;
              border-radius: 6px;
              display: inline-block;
            }
            .status.completed { 
              background: #dcfce7; 
              color: #16a34a; 
            }
            .status.confirmed { 
              background: #dbeafe; 
              color: #2563eb; 
            }
            .status.pending { 
              background: #fef3c7; 
              color: #f59e0b; 
            }
            .status.in_progress { 
              background: #e0e7ff; 
              color: #6366f1; 
            }
            .status.cancelled, .status.rejected { 
              background: #fee2e2; 
              color: #dc2626; 
            }
            .additional-services {
              background: #f9fafb;
              padding: 12px;
              border-radius: 8px;
              margin: 8px 0;
            }
            .service-item {
              display: flex;
              justify-content: space-between;
              margin: 6px 0;
              font-size: 13px;
            }
            .total-row {
              font-weight: 700;
              font-size: 16px;
              padding-top: 8px;
              border-top: 2px solid #111827;
              margin-top: 8px;
            }
            .promo-badge {
              background: #10b981;
              color: white;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
            }
            .description {
              font-size: 13px;
              color: #6b7280;
              line-height: 1.5;
              margin-top: 4px;
            }
            .contact-info {
              background: #f3f4f6;
              padding: 12px;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🌿 Booking Receipt</h1>
            <div class="subtitle">Booking #${booking.bookingNumber}</div>
            
            <!-- Status -->
            <div style="text-align: center; margin-bottom: 24px;">
              <span class="status ${booking.status}">${booking.status.replace(
			'_',
			' '
		)}</span>
            </div>

            <!-- Service Details -->
            <div class="section">
              <div class="section-title">📋 Service Details</div>
              <div class="row">
                <span class="label">Service:</span>
                <span class="value">${booking.service.title}</span>
              </div>
              ${
								booking.service.description
									? `
                <div class="description">${booking.service.description}</div>
              `
									: ''
							}
              <div class="row">
                <span class="label">Base Rate:</span>
                <span class="value">Rs. ${
									booking.service.hourlyRate
								}/hour</span>
              </div>
              <div class="row">
                <span class="label">Base Duration:</span>
                <span class="value">${
									booking.service.durationHours
								} hour(s)</span>
              </div>
              <div class="row">
                <span class="label">Total Duration:</span>
                <span class="value">${booking.duration} hour(s)</span>
              </div>
            </div>

            ${
							booking.additionalServices &&
							booking.additionalServices.length > 0
								? `
              <div class="section">
                <div class="section-title">➕ Additional Services</div>
                <div class="additional-services">
                  ${booking.additionalServices
										.map(
											(service) => `
                    <div class="service-item">
                      <span>${service.title} (${service.durationHours}h)</span>
                      <span>Rs. ${service.price}</span>
                    </div>
                  `
										)
										.join('')}
                </div>
              </div>
            `
								: ''
						}

            <div class="divider"></div>

            <!-- Provider Info -->
            <div class="section">
              <div class="section-title">👤 Service Provider</div>
              <div class="row">
                <span class="label">Name:</span>
                <span class="value">${booking.provider.name}</span>
              </div>
              <div class="row">
                <span class="label">Email:</span>
                <span class="value">${booking.provider.email}</span>
              </div>
              <div class="row">
                <span class="label">Phone:</span>
                <span class="value">${booking.provider.phone}</span>
              </div>
              ${
								booking.provider.serviceProviderProfile?.description
									? `
                <div class="description">${booking.provider.serviceProviderProfile.description}</div>
              `
									: ''
							}
            </div>

            <div class="divider"></div>

            <!-- Schedule Info -->
            <div class="section">
              <div class="section-title">📅 Schedule</div>
              <div class="row">
                <span class="label">Date:</span>
                <span class="value">${formatDate(
									booking.scheduledDate as string
								)}</span>
              </div>
              <div class="row">
                <span class="label">Time:</span>
                <span class="value">${formatTime(
									booking.scheduledTime as string
								)}</span>
              </div>
              <div class="row">
                <span class="label">Booked On:</span>
                <span class="value">${formatDate(
									booking.createdAt as string
								)}</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Location & Contact -->
            <div class="section">
              <div class="section-title">📍 Service Location</div>
              <div class="contact-info">
                <div class="row">
                  <span class="label">Address:</span>
                  <span class="value">${booking.address}</span>
                </div>
                <div class="row">
                  <span class="label">Contact:</span>
                  <span class="value">${booking.phone}</span>
                </div>
                ${
									booking.notes
										? `
                  <div class="row" style="margin-top: 8px;">
                    <span class="label">Special Notes:</span>
                  </div>
                  <div class="description" style="margin-top: 4px;">${booking.notes}</div>
                `
										: ''
								}
              </div>
            </div>

            <div class="divider"></div>

            <!-- Price Breakdown -->
            <div class="section">
              <div class="section-title">💰 Payment Details</div>
              <div class="row">
                <span class="label">Base Service (${
									booking.priceBreakdown.baseDuration
								}h):</span>
                <span class="value">Rs. ${
									booking.priceBreakdown.basePrice
								}</span>
              </div>
              ${
								booking.priceBreakdown.extraHours > 0
									? `
                <div class="row">
                  <span class="label">Extra Hours (${
										booking.priceBreakdown.extraHours
									}h):</span>
                  <span class="value">Rs. ${(
										booking.priceBreakdown.extraHours *
										booking.service.hourlyRate
									).toFixed(2)}</span>
                </div>
              `
									: ''
							}
              ${
								booking.priceBreakdown.additionalServicesTotal > 0
									? `
                <div class="row">
                  <span class="label">Additional Services:</span>
                  <span class="value">Rs. ${booking.priceBreakdown.additionalServicesTotal}</span>
                </div>
              `
									: ''
							}
              ${
								booking.promoCode?.code
									? `
                <div class="row">
                  <span class="label">
                    Promo Code 
                    <span class="promo-badge">${booking.promoCode.code}</span>
                  </span>
                  <span class="value" style="color: #16a34a;">
                    -Rs. ${booking.priceBreakdown.promoDiscount}
                    ${
											booking.promoCode.discountType === 'percentage'
												? ` (${booking.promoCode.discountAmount}%)`
												: ''
										}
                  </span>
                </div>
              `
									: ''
							}
              <div class="row total-row">
                <span class="label">Total Amount:</span>
                <span class="value">Rs. ${
									booking.priceBreakdown.totalAmount
								}</span>
              </div>
            </div>

            ${
							booking.cancellation?.cancelledAt
								? `
              <div class="divider"></div>
              <div class="section">
                <div class="section-title">❌ Cancellation Details</div>
                <div class="row">
                  <span class="label">Cancelled By:</span>
                  <span class="value">${booking.cancellation.cancelledBy}</span>
                </div>
                <div class="row">
                  <span class="label">Cancelled At:</span>
                  <span class="value">${formatDate(
										booking.cancellation.cancelledAt as string
									)} ${formatTime(
										booking.cancellation.cancelledAt as string
								  )}</span>
                </div>
                ${
									booking.cancellation.reason
										? `
                  <div class="row">
                    <span class="label">Reason:</span>
                  </div>
                  <div class="description">${booking.cancellation.reason}</div>
                `
										: ''
								}
              </div>
            `
								: ''
						}

            ${
							booking.customerReview?.rating
								? `
              <div class="divider"></div>
              <div class="section">
                <div class="section-title">⭐ Customer Review</div>
                <div class="row">
                  <span class="label">Rating:</span>
                  <span class="value">${'⭐'.repeat(
										booking.customerReview.rating
									)} (${booking.customerReview.rating}/5)</span>
                </div>
                ${
									booking.customerReview.comment
										? `
                  <div class="description">${booking.customerReview.comment}</div>
                `
										: ''
								}
                ${
									booking.customerReview.reviewedAt
										? `
                  <div class="row">
                    <span class="label">Reviewed On:</span>
                    <span class="value">${formatDate(
											booking.customerReview.reviewedAt as string
										)}</span>
                  </div>
                `
										: ''
								}
              </div>
            `
								: ''
						}

            <!-- Footer -->
            <div class="footer">
              Thank you for choosing PlantCo! 🌱<br/>
              For support, contact us at support@plantco.com
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
