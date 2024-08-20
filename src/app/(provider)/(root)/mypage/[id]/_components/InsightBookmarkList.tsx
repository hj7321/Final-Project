'use client';

import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import DesktopPostCard from './DesktopPostCard';
import MobilePostCard from './MobilePostCard';

export default function QnaBookmarkList() {
  const { id: userId } = useParams<{ id: string }>();

  const getQnaBookmarkPosts = async () => {
    const response = await fetch(`/api/bookmark?userId=${userId}&category=insight`).then((res) => res.json());
    if (response.errorMsg) {
      return null;
    }

    const postIds = response.data.map((bookmark: { posts_id: string }) => bookmark.posts_id);
    const { data, error } = await createClient().from('Community Posts').select('*').in('id', postIds);

    if (error) {
      return null;
    }

    return data;
  };

  const { data, isPending, error } = useQuery({
    queryKey: ['bookmark', userId],
    queryFn: getQnaBookmarkPosts,
    enabled: !!userId
  });

  if (isPending) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>;
  }

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-white border border-grey-300 rounded-md p-6 text-center h-96">
        <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24  mx-auto mb-4" />
        <div className="text-lg font-semibold mb-2">아직 찜을 한 인사이트 게시글이 없어요</div>
        <div className="text-sm text-grey-600 mb-4">코듀를 둘러보면서 마음에 드는 게시글을 찾아보세요!</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <DesktopPostCard data={data!} />
      <MobilePostCard data={data!} />
    </section>
  );
}
