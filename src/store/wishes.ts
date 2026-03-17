import { create } from 'zustand';
import { Wish, WishStatus, WishType } from '../types';

interface WishesState {
  roomWishes: Record<string, Wish[]>;
  roomHistory: Record<string, Wish[]>;
  setRoomWishes: (roomId: string, wishes: Wish[]) => void;
  setRoomHistory: (roomId: string, wishes: Wish[]) => void;
  upsertWish: (roomId: string, wish: Wish) => void;
  updateWishContent: (roomId: string, wishId: string, type: WishType, content: string) => void;
  updateWishStatus: (roomId: string, wishId: string, status: WishStatus) => void;
  removeWish: (roomId: string, wishId: string) => void;
  addHistoryWish: (roomId: string, wish: Wish) => void;
}

const upsert = (list: Wish[], wish: Wish) => {
  const idx = list.findIndex((item) => item.id === wish.id);
  if (idx === -1) {
    return [wish, ...list];
  }
  const next = [...list];
  next[idx] = wish;
  return next;
};

const updateById = (list: Wish[], wishId: string, updater: (wish: Wish) => Wish) => {
  return list.map((wish) => (wish.id === wishId ? updater(wish) : wish));
};

export const useWishesStore = create<WishesState>((set, get) => ({
  roomWishes: {},
  roomHistory: {},
  setRoomWishes: (roomId, wishes) =>
    set((state) => ({
      roomWishes: {
        ...state.roomWishes,
        [roomId]: wishes,
      },
    })),
  setRoomHistory: (roomId, wishes) =>
    set((state) => ({
      roomHistory: {
        ...state.roomHistory,
        [roomId]: wishes,
      },
    })),
  upsertWish: (roomId, wish) =>
    set((state) => ({
      roomWishes: {
        ...state.roomWishes,
        [roomId]: upsert(state.roomWishes[roomId] ?? [], wish),
      },
    })),
  updateWishContent: (roomId, wishId, type, content) =>
    set((state) => ({
      roomWishes: {
        ...state.roomWishes,
        [roomId]: updateById(state.roomWishes[roomId] ?? [], wishId, (wish) => ({
          ...wish,
          type,
          content,
          updatedAt: new Date().toISOString(),
        })),
      },
    })),
  updateWishStatus: (roomId, wishId, status) =>
    set((state) => ({
      roomWishes: {
        ...state.roomWishes,
        [roomId]: updateById(state.roomWishes[roomId] ?? [], wishId, (wish) => ({
          ...wish,
          status,
          updatedAt: new Date().toISOString(),
        })),
      },
    })),
  removeWish: (roomId, wishId) =>
    set((state) => ({
      roomWishes: {
        ...state.roomWishes,
        [roomId]: (state.roomWishes[roomId] ?? []).filter((wish) => wish.id !== wishId),
      },
    })),
  addHistoryWish: (roomId, wish) => {
    const existing = get().roomHistory[roomId] ?? [];
    set((state) => ({
      roomHistory: {
        ...state.roomHistory,
        [roomId]: upsert(existing, wish),
      },
    }));
  },
}));
