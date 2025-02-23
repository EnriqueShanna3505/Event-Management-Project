// Import necessary functions and data
import {
  removeFromEventCart,
  updateParticipantCount,
} from '../data/eventcart.js';
import { sessionOptions } from '../data/sessionOption.js';
import { eventProducts } from '../data/product.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const today = dayjs();

// Function to save eventCart to localStorage
function saveEventCartToStorage() {
  localStorage.setItem('eventCart', JSON.stringify(eventCart));
}

// Function to retrieve eventCart from localStorage
function loadEventCartFromStorage() {
  const storedCart = localStorage.getItem('eventCart');
  return storedCart ? JSON.parse(storedCart) : [];
}

// Load eventCart when the page loads
let eventCart = loadEventCartFromStorage();

// Function to generate session dates and labels based on session type
function generateSessionDates(commenceDate, sessionType) {
  if (sessionType === 'multipleDays') {
    return [
      { date: commenceDate, label: 'Day 1' },
      { date: commenceDate.add(1, 'day'), label: 'Day 2' },
      { date: commenceDate.add(2, 'day'), label: 'Day 3' },
    ];
  } else if (sessionType === 'multipleSessions') {
    return [
      { date: commenceDate, label: 'Morning' },
      { date: commenceDate, label: 'Evening' },
      { date: commenceDate, label: 'Night' },
    ];
  } else {
    return [{ date: commenceDate, label: 'Full Day' }];
  }
}

// Function to generate HTML for session options
function sessionOptionsHTML(
  matchingEventProduct,
  eventItem,
  commenceDate,
  sessionType
) {
  let html = '';
  const sessionDates = generateSessionDates(commenceDate, sessionType);

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
      <div class="session-option ${isExpired ? 'expired' : ''}">
        <input type="radio" ${isChecked ? 'checked' : ''} ${
      isExpired ? 'disabled' : ''
    }
          class="session-option-input"
          name="session-option-${matchingEventProduct.id}"
          value="${sessionOptions[index].id}">
        <div>
          <div class="session-option-date">
            ${dateString} ${sessionLabel ? `(${sessionLabel})` : ''} ${
      isExpired ? '(Expired)' : ''
    }
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

// Function to get or generate commence date and session type for an event
function getEventDetails(eventProductId) {
  const storedDetails = localStorage.getItem(`event_${eventProductId}`);

  if (storedDetails) {
    const parsedDetails = JSON.parse(storedDetails);
    return {
      commenceDate: dayjs(parsedDetails.commenceDate), // Convert back to dayjs object
      sessionType: parsedDetails.sessionType,
    };
  } else {
    const randomDays = Math.floor(Math.random() * 30);
    const commenceDate = today.add(randomDays, 'days');

    const sessionTypes = ['multipleDays', 'multipleSessions', 'singleSession'];
    const sessionType =
      sessionTypes[Math.floor(Math.random() * sessionTypes.length)];

    const eventDetails = {
      commenceDate: commenceDate.toISOString(),
      sessionType,
    };
    localStorage.setItem(
      `event_${eventProductId}`,
      JSON.stringify(eventDetails)
    );

    return {
      commenceDate,
      sessionType,
    };
  }
}

let eventCartSummaryHTML = '';

// Loop through each event in the cart
eventCart.forEach((eventItem) => {
  const eventProductId = eventItem.eventProductId;

  let matchingEventProduct = eventProducts.find(
    (eventProduct) => eventProduct.id === eventProductId
  );

  if (matchingEventProduct) {
    const { commenceDate, sessionType } = getEventDetails(eventProductId);
    const formattedCommenceDate = commenceDate.format('dddd, MMMM D');

    eventCartSummaryHTML += `
      <div class="event-cart-item-container js-event-cart-item-container-${
        matchingEventProduct.id
      }">
        <div class="commence-date">
          Commence date: ${formattedCommenceDate}
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
          ${sessionOptionsHTML(
            matchingEventProduct,
            eventItem,
            commenceDate,
            sessionType
          )}
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
    eventCart = eventCart.filter(
      (event) => event.eventProductId !== eventProductId
    );
    saveEventCartToStorage(); // Save after removal

    localStorage.removeItem(`event_${eventProductId}`);

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
    const eventItem = eventCart.find(
      (event) => event.eventProductId === eventProductId
    );

    if (eventItem) {
      const newCount = prompt(
        'Enter new participant count:',
        eventItem.participant
      );
      if (newCount !== null && !isNaN(newCount) && newCount > 0) {
        eventItem.participant = parseInt(newCount, 10);
        saveEventCartToStorage(); // Save after update
        location.reload();
      }
    }
  });
});
