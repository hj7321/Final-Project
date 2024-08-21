'use client';

import { CommunityPosts } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface LikeCountCountProps {
  postId: string;
}

export const LikeCount = ({ postId }: LikeCountCountProps) => {
  const getCommentCount = async (postId: string) => {
    const supabase = createClient();
    const { count, error } = await supabase
      .from('Community Comments')
      .select('*', { count: 'exact' })
      .eq('community_post_id', postId);

    if (error) {
      throw new Error('Failed to fetch comment count');
    }

    return count || 0;
  };

  const {
    data: commentCount,
    isLoading,
    error
  } = useQuery({
    queryKey: ['commentCount', postId],
    queryFn: () => getCommentCount(postId),
    enabled: !!postId
  });

  return <span>{commentCount}</span>;
};
