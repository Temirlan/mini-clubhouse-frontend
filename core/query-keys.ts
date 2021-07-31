export const queryKeys = {
  Auth: {
    currentUser: 'currentUser',
  },
  Room: {
    get: (roomId: number) => `room-${roomId}`,
  },
  User: {
    get: (userId: number) => `user-${userId}`,
  },
  Rooms: {
    rooms: 'rooms',
  },
};
