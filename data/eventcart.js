export const eventCart = [];

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
