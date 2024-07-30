import { Tables } from './supabase';

export type Users = Tables<'Users'>;

export type Accounts = Tables<'Accounts'>;

export type CommunityComments = Tables<'Community Comments'>;

export type CommunityLikes = Tables<'Community Likes'>;

export type CommunityPosts = Tables<'Community Posts'>;

export type Portfolio = Tables<'Portfolio'>;

export type RequestPosts = Tables<'Request Posts'>;

export type RequestReviews = Tables<'Request Reviews'>;

export interface ChatMessage {
  id: string;
  consumer_id: string;
  pro_id: string;
  content: string;
  created_at: string;
  chat_room_id: string;
  is_read: boolean; // is_read 필드 추가
}