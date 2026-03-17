import { Wish, WishType, WishStatus } from '../../../types';
import { api } from '../../../core/api';

const mapBackendWish = (backendWish: any): Wish => {
  return {
    id: backendWish.id,
    roomId: backendWish.room_id,
    creatorId: backendWish.created_by,
    type: backendWish.wish_type,
    content: backendWish.title,
    status: backendWish.status || 'pending', // Might need mapping from backend
    createdAt: backendWish.created_at,
    updatedAt: backendWish.updated_at,
  };
};

export const wishService = {
  getRoomWishes: async (roomId: string): Promise<Wish[]> => {
    try {
      const response = await api.get(`/rooms/${roomId}/wishes`);
      return response.data?.items?.map(mapBackendWish) || [];
    } catch (error) {
      console.error('Error fetching wishes:', error);
      throw error;
    }
  },

  getRoomPendingWishes: async (roomId: string): Promise<Wish[]> => {
    try {
      const response = await api.get(`/rooms/${roomId}/wishes`, {
        params: { status: 'pending' }
      });
      return response.data?.items?.map(mapBackendWish) || [];
    } catch (error) {
      console.error('Error fetching pending wishes:', error);
      throw error;
    }
  },

  getRoomRequestedWishes: async (roomId: string): Promise<Wish[]> => {
    try {
      const response = await api.get(`/rooms/${roomId}/wishes`, {
        params: { status: 'requested' }
      });
      return response.data?.items?.map(mapBackendWish) || [];
    } catch (error) {
      console.error('Error fetching requested wishes:', error);
      throw error;
    }
  },

  getRoomWishesHistory: async (roomId: string): Promise<Wish[]> => {
    try {
      const response = await api.get(`/rooms/${roomId}/wishes`, {
        params: { status: 'confirmed,deleted' }
      });
      return response.data?.items?.map(mapBackendWish) || [];
    } catch (error) {
      console.error('Error fetching wish history:', error);
      throw error;
    }
  },

  createWish: async (roomId: string, type: WishType, content: string): Promise<Wish> => {
    try {
      const response = await api.post(`/rooms/${roomId}/wishes`, {
        wish_type: type,
        title: content,
        description: ''
      });
      return mapBackendWish(response.data);
    } catch (error) {
      console.error('Error creating wish:', error);
      throw error;
    }
  },

  updateWishStatus: async (roomId: string, wishId: string, status: WishStatus): Promise<void> => {
    try {
      if (status === 'requested') {
        await api.post(`/rooms/${roomId}/wishes/${wishId}/request-confirmation`);
      } else if (status === 'confirmed') {
        await api.post(`/rooms/${roomId}/wishes/${wishId}/confirm`);
      } else if (status === 'rejected') {
        await api.post(`/rooms/${roomId}/wishes/${wishId}/reject`);
      } else if (status === 'deleted') {
        await api.delete(`/rooms/${roomId}/wishes/${wishId}`);
      }
    } catch (error) {
      console.error('Error updating wish status:', error);
      throw error;
    }
  },

  updateWishContent: async (roomId: string, wishId: string, type: WishType, content: string): Promise<void> => {
    try {
      await api.put(`/rooms/${roomId}/wishes/${wishId}`, {
        wish_type: type,
        title: content,
        description: ''
      });
    } catch (error) {
      console.error('Error updating wish content:', error);
      throw error;
    }
  },

  getWishById: async (roomId: string, wishId: string): Promise<Wish> => {
    try {
      const response = await api.get(`/rooms/${roomId}/wishes/${wishId}`);
      return mapBackendWish(response.data);
    } catch (error) {
      console.error('Error fetching wish:', error);
      throw error;
    }
  }
};
