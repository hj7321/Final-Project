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