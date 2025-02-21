// Import necessary functions and data
import {
  eventCart,
  removeFromEventCart,
  updateParticipantCount,
} from '../data/eventcart.js';

import { eventProducts } from '../data/product.js';
import { formatCurrency } from './utils/money.js';

let eventCartSummaryHTML = '';

eventCart.forEach((eventItem) => {
  const eventProductId = eventItem.eventProductId;

  let matchingEventProduct = eventProducts.find(
    (eventProduct) => eventProduct.id === eventProductId
  );

  if (matchingEventProduct) {
    eventCartSummaryHTML += `
      <div class="event-cart-item-container js-event-cart-item-container-${
        matchingEventProduct.id
      }">
        <div class="commence-date">
          Commence date: Tuesday, June 21
        </div>

        <div class="event-cart-item-details-grid">
          <img src="${
            matchingEventProduct.image
          }" alt="" class="event-product-image">
        </div>

        <div class="event-cart-item-details">
          <div class="event-product-name">
            ${matchingEventProduct.name}
          </div>

          <div class="event-product-price">
            RM ${formatCurrency(matchingEventProduct.priceCents)}
          </div>

          <div class="event-participant-quantity">
            <span>
              Participant: <span class="quantity-label">${
                eventItem.participant
              }</span>
            </span>

            <span class="update-participant-quantity-link link-primary js-update-link" data-event-product-id="${
              matchingEventProduct.id
            }">
              Update
            </span>  
            <span class="delete-participant-quantity-link link-primary js-delete-link" data-event-product-id="${
              matchingEventProduct.id
            }">
              Delete
            </span>  
          </div>
        </div>

        <div class="session-options">
          <div class="session-options-title">
            Choose your session:
          </div>
          <div class="session-option">
            <input type="radio" checked
              class="session-option-input"
              name="session-option-${matchingEventProduct.id}">
            <div>
              <div class="session-option-date">
                Tuesday, June 21
              </div>
              <div class="session-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          
          <div class="session-option">
            <input type="radio" checked
              class="session-option-input"
              name="session-option-${matchingEventProduct.id}">
            <div>
              <div class="session-option-date">
                Wednesday, June 22
              </div>
              <div class="session-option-price">
                RM 4.99 - Second Session
              </div>
            </div>
          </div>

          <div class="session-option">
            <input type="radio" checked
              class="session-option-input"
              name="session-option-${matchingEventProduct.id}">
            <div>
              <div class="session-option-date">
                Thursday, June 23
              </div>
              <div class="session-option-price">
                RM 10.00
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
});

// Insert the generated HTML into the checkout page
document.querySelector('.js-event-order-summary').innerHTML =
  eventCartSummaryHTML;

// Interactive delete button
document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const eventProductId = link.dataset.eventProductId;
    removeFromEventCart(eventProductId);

    const container = document.querySelector(
      `.js-event-cart-item-container-${eventProductId}`
    );
    if (container) container.remove();
  });
});

// Interactive update participant button
document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const eventProductId = link.dataset.eventProductId;
    updateParticipantCount(eventProductId);
  });
});
