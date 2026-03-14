import { Wish, WishType } from '../../../types';
import { useAppStore } from '../../../store';

let mockWishes: Wish[] = [
  {
    id: 'w1',
    roomId: 'r1',
    creatorId: 'u1',
    type: 'gift',
    content: 'A new pair of sneakers',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'w2',
    roomId: 'r1',
    creatorId: 'u2',
    type: 'habit',
    content: 'Drink more water',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const wishService = {
  getRoomWishes: async (roomId: string, showHistory = false): Promise<Wish[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let wishes = mockWishes.filter(w => w.roomId === roomId);
        if (!showHistory) {
          wishes = wishes.filter(w => w.status === 'active');
        } else {
          wishes = wishes.filter(w => w.status !== 'active');
        }
        resolve(wishes);
      }, 500);
    });
  },

  createWish: async (roomId: string, type: WishType, content: string): Promise<Wish> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = useAppStore.getState().user;
        const newWish: Wish = {
          id: `w${Math.random().toString(36).substr(2, 9)}`,
          roomId,
          creatorId: user?.id || 'unknown',
          type,
          content,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockWishes.unshift(newWish);
        resolve(newWish);
      }, 500);
    });
  },

  updateWishStatus: async (wishId: string, status: 'confirmed' | 'deleted'): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wish = mockWishes.find(w => w.id === wishId);
        if (wish) {
          wish.status = status;
          wish.updatedAt = new Date().toISOString();
        }
        resolve();
      }, 500);
    });
  },

  updateWishContent: async (wishId: string, type: WishType, content: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wish = mockWishes.find(w => w.id === wishId);
        if (wish) {
          wish.type = type;
          wish.content = content;
          wish.updatedAt = new Date().toISOString();
        }
        resolve();
      }, 500);
    });
  },

  getWishById: async (wishId: string): Promise<Wish> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const wish = mockWishes.find(w => w.id === wishId);
        if (wish) resolve(wish);
        else reject(new Error('Wish not found'));
      }, 300);
    });
  }
};
