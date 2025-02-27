import { eventCart } from '../../data/eventcart.js';
import { getProduct } from '../../data/product.js';
import { getSessionOption } from '../../data/sessionOption.js';
import { formatCurrency } from '../utils/money.js';
export function renderPaymentSummary() {
  let productPriceCents = 0;
  let dayPriceCents = 0;

  eventCart.forEach((eventCartItem) => {
    const eventProduct = getProduct(eventCartItem.eventProductId);
    const sessionOption = getSessionOption(eventCartItem.sessionOptionId);

    const participantCount = eventCartItem.participant; // Get participant count

    // Multiply price by participant count
    productPriceCents += eventProduct.priceCents * participantCount;
    dayPriceCents += sessionOption.priceCents * participantCount;
  });

  const totalBeforeTaxCents = productPriceCents + dayPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
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
              <div class="payment-summary-money">RM ${formatCurrency(
                taxCents
              )}</div>
            </div>
  
            <div class="payment-summary-row total-row">
              <div>Order Event total:</div>
              <div class="payment-summary-money">RM ${formatCurrency(
                totalCents
              )}</div>
            </div>
  
            <button class="place-event-button button-primary">
              Place event(s) order
            </button>`;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}
