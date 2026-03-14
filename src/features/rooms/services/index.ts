import { Room } from '../../../types';
import { useAppStore } from '../../../store';

// Mocking the room service
const mockRooms: Room[] = [
  {
    id: 'r1',
    name: 'Our Anniversary 2026',
    code: 'ANNI26',
    ownerId: 'u1',
    partnerId: 'u2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r2',
    name: 'Home Renovation',
    code: 'HOME99',
    ownerId: 'u2',
    partnerId: 'u1',
    createdAt: new Date().toISOString(),
  }
];

export const roomService = {
  getRooms: async (): Promise<Room[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRooms);
      }, 500);
    });
  },

  createRoom: async (name: string): Promise<Room> => {
    return new Promise((resolve) => {
      const user = useAppStore.getState().user;
      setTimeout(() => {
        const newRoom: Room = {
          id: `r${Math.random().toString(36).substr(2, 9)}`,
          name,
          code: Math.random().toString(36).substr(2, 6).toUpperCase(),
          ownerId: user?.id || 'unknown',
          createdAt: new Date().toISOString(),
        };
        mockRooms.push(newRoom);
        resolve(newRoom);
      }, 500);
    });
  },

  joinRoom: async (code: string): Promise<Room> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const room = mockRooms.find(r => r.code === code);
        if (room) {
          const user = useAppStore.getState().user;
          room.partnerId = user?.id;
          resolve(room);
        } else {
          reject(new Error('Room not found or invalid code'));
        }
      }, 500);
    });
  },

  getRoomById: async (id: string): Promise<Room> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const room = mockRooms.find(r => r.id === id);
        if (room) {
          resolve(room);
        } else {
          reject(new Error('Room not found'));
        }
      }, 500);
    });
  }
};
