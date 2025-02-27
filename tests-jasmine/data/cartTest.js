import {
  addToEventCart,
  eventCart,
  loadFromStorage,
} from '../../data/eventcart.js';

describe('test suite: addToEventCart', () => {
  it('adds an new event to the event cart', () => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });

    loadFromStorage();
    const mockButton = { innerHTML: '', disabled: false };
    addToEventCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', mockButton);
    expect(eventCart.length).toEqual(1);
    expect(mockButton.innerHTML).toEqual('Added to Calendar'); // Check if text changes
    expect(mockButton.disabled).toBe(true); // Check if button is disabled
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(eventCart[0].eventProductId).toEqual(
      'e43638ce-6aa0-4b85-b27f-e1d07eb678c6'
    );
    expect(eventCart[0].quantity).toEqual(1);
  });

  it('updates participant count if event already exists in the event cart', () => {
    spyOn(localStorage, 'setItem'); // Track localStorage updates

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          eventProductId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          sessionOptionId: '1',
          quantity: 1,
          participant: 2, // Initially 2 participants
          commenceDate: '2025-03-01',
          hasMultipleSessions: true,
          eventType: 'multi-session',
        },
      ]);
    });

    loadFromStorage();

    const mockButton = { innerHTML: '', disabled: false };

    // Call addToEventCart with updated participant count (e.g., 3)
    addToEventCart(
      'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      mockButton,
      3, // New participant count
      true,
      'multi-session'
    );

    // Ensure no new event was added
    expect(eventCart.length).toEqual(1);

    // Ensure participant count updated
    expect(eventCart[0].participant).toEqual(3);

    // Ensure localStorage.setItem was called twice (for eventCart and storedCommenceDates)
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);

    // Ensure eventProductId remains the same
    expect(eventCart[0].eventProductId).toEqual(
      'e43638ce-6aa0-4b85-b27f-e1d07eb678c6'
    );
  });
});
