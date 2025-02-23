export let eventCart = JSON.parse(localStorage.getItem('eventCart')) || [];

if (!eventCart) {
  eventCart = [
    {
      eventProductId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      sessionOptionId: '1',
    },
    {
      eventProductId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      sessionOptionId: '2',
    },
  ];
}
// Store original commence dates to ensure they persist after removal and re-addition
export let storedCommenceDates =
  JSON.parse(localStorage.getItem('storedCommenceDates')) || {};

export function saveToStorage() {
  localStorage.setItem('eventCart', JSON.stringify(eventCart));
  localStorage.setItem(
    'storedCommenceDates',
    JSON.stringify(storedCommenceDates)
  );
}

export function addToEventCart(
  eventProductId,
  button,
  participantCount,
  hasSessions = true,
  eventType = 'multi-session' // 'multi-day', 'multi-session', or 'full-day'
) {
  let matchingItem;

  eventCart.forEach((eventCartItem) => {
    if (eventCartItem.eventProductId === eventProductId) {
      matchingItem = eventCartItem;
    }
  });

  if (!matchingItem) {
    let commenceDate;

    // Check if there's a stored commence date for this event
    if (storedCommenceDates[eventProductId]) {
      commenceDate = storedCommenceDates[eventProductId];
    } else {
      // Generate a random commence date within the next 30 days
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 30);
      const generatedCommenceDate = new Date(today);
      generatedCommenceDate.setDate(today.getDate() + randomDays);

      commenceDate = generatedCommenceDate.toISOString().split('T')[0];

      // Store the generated date so it persists even after removal
      storedCommenceDates[eventProductId] = commenceDate;
    }

    eventCart.push({
      eventProductId: eventProductId,
      sessionOptionId: hasSessions ? '1' : null, // Null if full-day event
      quantity: 1,
      participant: participantCount,
      commenceDate: commenceDate,
      hasMultipleSessions: hasSessions,
      eventType: eventType, // 'multi-day', 'multi-session', or 'full-day'
    });

    button.innerHTML = 'Added to Calendar';
    button.disabled = true;
    saveToStorage();
  }
}

export function removeFromEventCart(eventProductId) {
  eventCart = eventCart.filter(
    (eventCartItem) => eventCartItem.eventProductId !== eventProductId
  );
  saveToStorage();
}

export function updateParticipantCount(eventProductId) {
  const container = document.querySelector(
    `.js-event-cart-item-container-${eventProductId}`
  );
  if (!container) return;

  let existingOptions = container.querySelector('.participant-update-options');
  if (existingOptions) existingOptions.remove();

  let radioHTML = `<div class="participant-update-options">`;
  for (let i = 1; i <= 10; i++) {
    radioHTML += `
        <label>
          <input type="radio" name="participant-option-${eventProductId}" value="${i}">
          ${i} Participant${i > 1 ? 's' : ''}
        </label>
      `;
  }
  radioHTML += `</div>`;

  container
    .querySelector('.event-participant-quantity')
    .insertAdjacentHTML('beforeend', radioHTML);

  document
    .querySelectorAll(`input[name="participant-option-${eventProductId}"]`)
    .forEach((radio) => {
      radio.addEventListener('change', () => {
        const newCount = Number(radio.value);

        eventCart.forEach((eventCartItem) => {
          if (eventCartItem.eventProductId === eventProductId) {
            eventCartItem.participant = newCount;
          }
        });

        container.querySelector('.quantity-label').innerHTML = newCount;
        saveToStorage();

        setTimeout(() => {
          const options = container.querySelector(
            '.participant-update-options'
          );
          if (options) options.remove();
        }, 300);
      });
    });
}

export function updateSessionOption(
  eventProductId,
  sessionOptionId,
  newCommenceDate
) {
  let matchingItem;

  eventCart.forEach((event) => {
    if (event.eventProductId === eventProductId) {
      matchingItem = event;
    }
  });

  if (matchingItem && matchingItem.hasMultipleSessions) {
    matchingItem.sessionOptionId = sessionOptionId;

    if (newCommenceDate) {
      matchingItem.commenceDate = newCommenceDate;
      storedCommenceDates[eventProductId] = newCommenceDate;
    }

    saveToStorage();
  }
}
