export const sessionOptions = [
  {
    id: '1',
    sessionDays: 1,
    priceCents: 0,
    label: 'Morning',
  },
  {
    id: '2',
    sessionDays: 2,
    priceCents: 499,
    label: 'Evening',
  },
  {
    id: '3',
    sessionDays: 3,
    priceCents: 999,
    label: 'Night',
  },
];

export function getSessionOption(sessionOptionId) {
  let matchingSession = sessionOptions[0]; // Default to first session option

  sessionOptions.forEach((option) => {
    if (option.id === sessionOptionId) {
      matchingSession = option;
    }
  });

  return matchingSession;
}
