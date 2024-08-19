'use client';

import { useQuery } from '@tanstack/react-query';

interface BookmarkCountProps {
  postId: string;
}

export const BookmarkCount = ({ postId }: BookmarkCountProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookmark', 'count', postId],
    queryFn: async () => {
      const { count } = await fetch(`/api/bookmarkCount?postId=${postId}`).then((res) => res.json());
      return count;
    }
  });

  return <span className="text-grey-400 text-[12px]"> {data}</span>;
};
