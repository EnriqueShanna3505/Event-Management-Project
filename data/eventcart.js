export const eventCart = [
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
