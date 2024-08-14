import { Tables } from './supabase';

export type Users = Tables<'Users'>;

export type Accounts = Tables<'Accounts'>;

export type CommunityComments = Tables<'Community Comments'>;

export type CommunityLikes = Tables<'Community Likes'>;

export type CommunityPosts = Tables<'Community Posts'>;

export type Portfolio = Tables<'Portfolio'>;

export type RequestPosts = Tables<'Request Posts'>;

export type RequestReviews = Tables<'Request Reviews'>;

export type Chat =Tables<'Chat'>


export interface ChatRoomInfo {
    chat_room_id: string;
    post_lang_category: string[] | null;
    post_title: string | null;
    user_nickname: string | null;
    user_profile_img: string | null;
    latest_message: string | null;
    latest_message_time: string | null;
    unread_count: number;
  }
  