'use client';

import { BookMark } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function RequestBookmarkList() {
  const { id: userId } = useParams();

  const getRequestBookmark = async () => {
    const response = await fetch('/api/bookmark').then((res) => res.json());
    if (response.errorMsg) {
      console.log(response.errorMsg);
      return [];
    }
    const data: BookMark[] = response.data;

    return data.filter((bookmark) => bookmark.user_id === userId);
  };

  const { data, isPending, error } = useQuery<BookMark[]>({
    queryKey: ['bookmark', userId],
    queryFn: getRequestBookmark,
    enabled: !!userId
  });

  if (isPending) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>;
  }

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
        <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24  mx-auto mb-4" />
        <div className="text-lg font-semibold mb-2">아직 찜을 한 전문가 의뢰 게시글이 없어요</div>
        <div className="text-sm text-gray-600 mb-4">코듀를 둘러보면서 마음에 드는 게시글을 찾아보세요!</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      찜한 전문가 의뢰 목록(전문가 의뢰 게시판에 북마크 기능을 만들어야 함)
    </section>
  );
}
