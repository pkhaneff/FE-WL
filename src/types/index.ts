export type WishType = 'gift' | 'habit' | 'bad_habit' | 'question';
export type WishStatus = 'pending' | 'requested' | 'rejected' | 'confirmed' | 'deleted';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  code: string; // Join code
  ownerId: string;
  partnerId?: string;
  createdAt: string;
}

export interface Wish {
  id: string;
  roomId: string;
  creatorId: string;
  type: WishType;
  content: string;
  status: WishStatus;
  createdAt: string;
  updatedAt: string;
}
