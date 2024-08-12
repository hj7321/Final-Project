'use client';

import useAuthStore from '@/zustand/authStore';
import { useCallback, useEffect, useMemo} from 'react';
import DesktopButton from './_components/DesktopButton';
import MobileButton from './_components/MobileButton';
import Categories from './_components/Categories';
import PostSkeleton from './_components/PostSkeleton';
import ProPosts from './_components/ProPosts';
import { useInfiniteQuery, QueryFunctionContext, QueryKey } from '@tanstack/react-query';
import '@/css/proMain.css'
import useProMain from '@/hooks/useProMain';

interface Posts {
  id: string;
  user_id: string;
  title: string;
  content: string;
  lang_category: string[];
  post_img: string[];
  price: number;
}

export default function ProMainPage() {
  const { 
    selectedLanguages,
    handleLanguageFilter,
    handleNavigation,
    getCategoryImage
  } = useProMain()
  const { isPro } = useAuthStore();

  const fetchPosts = useCallback(
    async ({ queryKey, pageParam = 0 }: QueryFunctionContext<QueryKey>) => {
      const [, selectedLanguages] = queryKey as readonly [string, string[]];
      const langQuery = selectedLanguages.length > 0 ? `&languages=${encodeURIComponent(JSON.stringify(selectedLanguages))}` : '';
      const response = await fetch(`/api/proMain?page=${pageParam}${langQuery}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    []
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<Posts[], Error>({
    queryKey: ['posts', selectedLanguages] as const,
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const filteredPosts = useMemo(() => data?.pages.flat() || [], [data]);

  return (
    <div className="mx-auto flex-col justify-center items-center">
      <div className="hidden md:block flex flex-row justify-end mt-[15px] md:w-auto items-end mx-auto w-full 2xl:w-[85%]">
        {/* 게시글 등록버튼 - 데스크탑 사이즈 */}
        {!isPro === true ? (
          <div className="w-full mt-mt-3 h-[48px]"></div>
        ) : (
          <DesktopButton handleNavigation={handleNavigation} />
        )}
      </div>
      {/* 언어별 카테고리 영역 */}
      <Categories handleLanguageFilter={handleLanguageFilter} selectedLanguages={selectedLanguages} />

      {/* 게시글 등록 버튼 - 모바일 사이즈 */}
      <div className="md:hidden flex flex-row justify-end mt-[15px] md:w-[85%] w-[330px] mx-auto items-center">
        {!isPro === true ? (
          <></>
        ) : (
          <MobileButton handleNavigation={handleNavigation} />
        )}
      </div>

      {/* 의뢰 서비스 리스트 */}
      <div className="lg:max-w-[1440px] md:mx-auto flex flex-row flex-wrap mb-[70px] mt-[10px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center lg:justify-start">
        {isFetching && !isFetchingNextPage ? (
          <PostSkeleton />
        ) : (
          <ProPosts filteredPosts={filteredPosts} getCategoryImage={getCategoryImage} />
        )}
      </div>
    </div>
  );
}