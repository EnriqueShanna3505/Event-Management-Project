export let eventCart = [
  {
    eventProductId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    participant: 1,
  },
  {
    eventProductId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    participant: 1,
  },
];

export function addToEventCart(eventProductId, button) {
  let matchingItem;

  eventCart.forEach((eventCartItem) => {
    if (eventProductId === eventCartItem.eventProductId) {
      matchingItem = eventCartItem;
    }
  });

  if (!matchingItem) {
    eventCart.push({
      eventProductId: eventProductId,
      quantity: 1,
    });

    // Change button to indicate it's added
    button.innerHTML = 'Added to Calendar';
    button.disabled = true; // Prevent multiple clicks
  }
}

export function removeFromEventCart(eventProductId) {
  const newCart = [];

  eventCart.forEach((eventCartItem) => {
    if (eventCartItem.eventProductId !== eventProductId) {
      newCart.push(eventCartItem);
    }
  });

  eventCart = newCart;
}

export function updateParticipantCount(eventProductId) {
  const container = document.querySelector(
    `.js-event-cart-item-container-${eventProductId}`
  );

  if (!container) return;

  // Check if radio buttons already exist
  let existingOptions = container.querySelector('.participant-update-options');

  if (existingOptions) {
    existingOptions.remove(); // Remove existing options so user can reselect
  }

  // Create new radio buttons dynamically
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

  // Append the radio buttons
  container
    .querySelector('.event-participant-quantity')
    .insertAdjacentHTML('beforeend', radioHTML);

  // Add event listener for radio selection
  document
    .querySelectorAll(`input[name="participant-option-${eventProductId}"]`)
    .forEach((radio) => {
      radio.addEventListener('change', () => {
        const newCount = Number(radio.value);

        // Update eventCart
        eventCart.forEach((eventCartItem) => {
          if (eventCartItem.eventProductId === eventProductId) {
            eventCartItem.participant = newCount;
          }
        });

        // Update UI
        container.querySelector('.quantity-label').innerHTML = newCount;

        // Remove radio buttons after selection
        setTimeout(() => {
          const options = container.querySelector(
            '.participant-update-options'
          );
          if (options) options.remove();
        }, 300); // Small delay to make sure change registers
      });
    });
}
