import { Room } from '../../../types';
import { api } from '../../../core/api';

const mapBackendRoom = (backendRoom: any): Room => {
  const members = backendRoom.active_members || [];
  const partner = members.find((m: any) => m.user_id !== backendRoom.created_by);
  
  return {
    id: backendRoom.id,
    name: backendRoom.name,
    code: backendRoom.join_code,
    ownerId: backendRoom.created_by,
    partnerId: partner ? partner.user_id : undefined,
    createdAt: backendRoom.created_at,
  };
};

export const roomService = {
  getRooms: async (): Promise<Room[]> => {
    try {
      const response = await api.get('/rooms/me');
      if (!response.data) return [];
      return [mapBackendRoom(response.data)];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  createRoom: async (name: string, passRoom: string): Promise<Room> => {
    try {
      const payload = {
        name,
        pass_room: passRoom,
      };
      const response = await api.post('/rooms', payload);
      return mapBackendRoom(response.data);
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  joinRoom: async (joinCode: string, passRoom: string): Promise<Room> => {
    try {
      const payload = {
        join_code: joinCode,
        pass_room: passRoom,
      };
      const response = await api.post('/rooms/join', payload);
      return mapBackendRoom(response.data);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },

  getRoomById: async (id: string): Promise<Room> => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return mapBackendRoom(response.data);
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  },

  leaveRoom: async (id: string): Promise<void> => {
    try {
      await api.post(`/rooms/${id}/leave`);
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }
};
