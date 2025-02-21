export let eventCart = JSON.parse(localStorage.getItem('eventCart'));

if (!eventCart) {
  eventCart = [
    {
      eventProductId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      participant: 2, // No longer forcing 1
    },
    {
      eventProductId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      participant: 3,
    },
  ];
}

export function saveToStorage() {
  localStorage.setItem('eventCart', JSON.stringify(eventCart));
}

export function addToEventCart(eventProductId, button, participantCount) {
  let matchingItem = eventCart.find(
    (eventCartItem) => eventCartItem.eventProductId === eventProductId
  );

  if (!matchingItem) {
    eventCart.push({
      eventProductId: eventProductId,
      quantity: 1,
      participant: participantCount, // Using user-selected value
    });

    // Change button to indicate it's added
    button.innerHTML = 'Added to Calendar';
    button.disabled = true; // Prevent multiple clicks
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

  if (existingOptions) {
    existingOptions.remove();
  }

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
