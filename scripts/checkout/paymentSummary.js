import { eventCart } from '../../data/eventcart.js';
import { getProduct } from '../../data/product.js';
import { getSessionOption } from '../../data/sessionOption.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
  if (!Array.isArray(eventCart) || eventCart.length === 0) {
    document.querySelector('.js-payment-summary').innerHTML =
      '<div class="payment-summary-title">No events selected.</div>';
    return;
  }

  let productPriceCents = 0;
  let dayPriceCents = 0;

  eventCart.forEach((eventCartItem) => {
    const eventProduct = getProduct(eventCartItem.eventProductId);
    if (!eventProduct) {
      console.error('Product not found for ID:', eventCartItem.eventProductId);
      return;
    }

    const sessionOption = getSessionOption(eventCartItem.sessionOptionId);
    if (!sessionOption) {
      console.error(
        'Session option not found for ID:',
        eventCartItem.sessionOptionId
      );
      return;
    }

    const participantCount = eventCartItem.participant || 1; // Ensure participant count is valid

    // Multiply price by participant count
    productPriceCents += eventProduct.priceCents * participantCount;
    dayPriceCents += sessionOption.priceCents * participantCount;
  });

  const totalBeforeTaxCents = productPriceCents + dayPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1); // Using integer math for accuracy
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Event Selection Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${eventCart.length}):</div>
      <div class="payment-summary-money">RM ${formatCurrency(
        productPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Session &amp; date price:</div>
      <div class="payment-summary-money">RM ${formatCurrency(
        dayPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">RM ${formatCurrency(
        totalBeforeTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">RM ${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order Event total:</div>
      <div class="payment-summary-money">RM ${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-event-button button-primary js-place-order">
      Place event(s) order
    </button>`;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document
    .querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        // Convert eventCart data to match backend expectations
        const eventCartItems = eventCart.map(
          ({ eventProductId, sessionOptionId, participant, commenceDate }) => ({
            productId: eventProductId,
            sessionId: sessionOptionId ? Number(sessionOptionId) : null, // Convert ID to number if needed
            quantity: 1, // Assuming quantity is always 1
            participants: participant,
            startDate: new Date(commenceDate).toISOString(), // Use full ISO format
          })
        );

        // Debug: Log the payload before sending
        console.log(
          ' Sending order data:',
          JSON.stringify({ cart: eventCartItems }, null, 2)
        );

        const response = await fetch('http://localhost:3001/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart: eventCartItems }), // Use eventCartItems
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(' Server error response:', errorData);
          throw new Error(errorData.message || 'Failed to place order');
        }

        const order = await response.json();
        addOrder(order);
        console.log(' Order placed successfully:', order);
      } catch (error) {
        console.error(' Error placing order:', error.message);
      }
    });
}
