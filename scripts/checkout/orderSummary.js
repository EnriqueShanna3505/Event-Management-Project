import {
  eventCart,
  removeFromEventCart,
  updateParticipantCount,
  updateSessionOption,
} from '../../data/eventcart.js';
import { sessionOptions } from '../../data/sessionOption.js';
import { eventProducts, getProduct } from '../../data/product.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { renderPaymentSummary } from './paymentSummary.js';
const today = dayjs();

// Function to get session option
export function getSessionOption(sessionOptionId) {
  let matchingSession = sessionOptions[0]; // Default to first session option

  sessionOptions.forEach((option) => {
    if (option.id === sessionOptionId) {
      matchingSession = option;
    }
  });

  return matchingSession;
}

export function renderOrderSummary() {
  let eventCartSummaryHTML = '';

  function generateSessionDates(commenceDate, hasMultipleSessions) {
    if (hasMultipleSessions) {
      return [
        { date: commenceDate, label: 'Morning' },
        { date: commenceDate, label: 'Evening' },
        { date: commenceDate, label: 'Night' },
      ];
    } else {
      return [{ date: commenceDate, label: 'Full Day' }];
    }
  }

  function sessionOptionsHTML(matchingEventProduct, eventItem) {
    let html = '';

    const commenceDate = dayjs(eventItem.commenceDate);
    const hasMultipleSessions = sessionOptions.length > 1;
    const sessionDates = generateSessionDates(
      commenceDate,
      hasMultipleSessions
    );

    sessionDates.forEach((session, index) => {
      const dateString = session.date.format('dddd, MMMM D');
      const sessionLabel = session.label;
      const isExpired = session.date.isBefore(today, 'day');
      const priceString =
        sessionOptions[index].priceCents === 0
          ? 'FREE Admission'
          : `RM ${formatCurrency(sessionOptions[index].priceCents)}`;
      const isChecked = sessionOptions[index].id === eventItem.sessionOptionId;

      html += `
                <div class="session-option js-session-option ${
                  isExpired ? 'expired' : ''
                }"
                  data-event-product-id="${matchingEventProduct.id}"
                  data-session-option-id="${sessionOptions[index].id}"
                  data-commence-date="${session.date.format('YYYY-MM-DD')}"
                  data-session-label="${sessionLabel}">
                  <input type="radio" ${isChecked ? 'checked' : ''} ${
        isExpired ? 'disabled' : ''
      }
                    class="session-option-input"
                    name="session-option-${matchingEventProduct.id}"
                    value="${sessionOptions[index].id}">
                  <div>
                    <div class="session-option-date">
                      ${dateString} ${
        sessionLabel ? `(${sessionLabel})` : ''
      } ${isExpired ? '(Expired)' : ''}
                    </div>
                    <div class="session-option-price">
                      ${priceString}
                    </div>
                  </div>
                </div>
              `;
    });

    return html;
  }

  eventCart.forEach((eventItem) => {
    const eventProductId = eventItem.eventProductId;
    const matchingEventProduct = getProduct(eventProductId);

    if (matchingEventProduct) {
      const commenceDate = dayjs(eventItem.commenceDate);
      const sessionOption = getSessionOption(eventItem.sessionOptionId);
      const sessionLabel = sessionOption.label;

      const formattedCommenceDate =
        commenceDate.format('dddd, MMMM D') +
        (sessionLabel ? ` (${sessionLabel})` : '');

      eventCartSummaryHTML += `
                <div class="event-cart-item-container js-event-cart-item-container-${
                  matchingEventProduct.id
                }">
                  <div class="commence-date">
                    Commence date: <span class="js-commence-date" data-event-product-id="${
                      matchingEventProduct.id
                    }">
                      ${formattedCommenceDate}
                    </span>
                  </div>
          
                  <div class="event-cart-item-details-grid">
                    <img src="${
                      matchingEventProduct.image
                    }" alt="" class="event-product-image">
                  </div>
          
                  <div class="event-cart-item-details">
                    <div class="event-product-name">${
                      matchingEventProduct.name
                    }</div>
                    <div class="event-product-price">
                     ${matchingEventProduct.getPrice()}
                    </div>
                    <div class="event-participant-quantity">
                      <span>
                        Participant: <span class="quantity-label">${
                          eventItem.participant
                        }</span>
                      </span>
                      <span class="update-participant-quantity-link link-primary js-update-link" 
                        data-event-product-id="${matchingEventProduct.id}">
                        Update
                      </span>  
                      <span class="delete-participant-quantity-link link-primary js-delete-link" 
                        data-event-product-id="${matchingEventProduct.id}">
                        Delete
                      </span>  
                    </div>
                  </div>
          
                  <div class="session-options">
                    <div class="session-options-title">
                      Choose your session:
                    </div>
                    ${sessionOptionsHTML(matchingEventProduct, eventItem)}
                  </div>
                </div>
              `;
    }
  });

  const orderSummaryElement = document.querySelector('.js-event-order-summary');
  if (orderSummaryElement) {
    orderSummaryElement.innerHTML = eventCartSummaryHTML;
  }

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const eventProductId = link.dataset.eventProductId;
      removeFromEventCart(eventProductId);

      const container = document.querySelector(
        `.js-event-cart-item-container-${eventProductId}`
      );
      if (container) container.remove();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const eventProductId = link.dataset.eventProductId;

      updateParticipantCount(eventProductId);
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-session-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { eventProductId, sessionOptionId, commenceDate, sessionLabel } =
        element.dataset;

      updateSessionOption(eventProductId, sessionOptionId, commenceDate);
      renderOrderSummary();
      renderPaymentSummary();
      const commenceDateElement = document.querySelector(
        `.js-commence-date[data-event-product-id="${eventProductId}"]`
      );

      if (commenceDateElement) {
        commenceDateElement.innerHTML =
          dayjs(commenceDate).format('dddd, MMMM D') +
          (sessionLabel ? ` (${sessionLabel})` : '');
      }
    });
  });
}
