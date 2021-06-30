export const queryKeys = {
  Auth: {
    currentUser: 'currentUser',
  },
  Room: {
    get: (roomId: number) => `room-${roomId}`,
  },
  Rooms: {
    rooms: 'rooms',
  },
};
