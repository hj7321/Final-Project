'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { CodeCategories } from '@/components/dumy';
import { CommunityPosts, RequestPosts } from '@/types/type';
import Image from 'next/image';
import SkeletonLoader from '@/components/SkeletonLoader';  // Import SkeletonLoader

export default function Home() {
  const [qnaPosts, setQnaPosts] = useState<CommunityPosts[]>([]);
  const [insightPosts, setInsightPosts] = useState<CommunityPosts[]>([]);
  const [expertPosts, setExpertPosts] = useState<RequestPosts[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state 추가
  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const [communityResponse, requestResponse] = await Promise.all([
        supabase.from('Community Posts').select('*').order('created_at', { ascending: false }),
        supabase.from('Request Posts').select('*').order('created_at', { ascending: false })
      ]);

      const { data: communityPosts, error: communityError } = communityResponse;
      const { data: requestPosts, error: requestError } = requestResponse;

      if (communityError) {
        console.error('Error fetching community posts:', communityError);
      } else {
        const qnaPosts = communityPosts.filter((post) => post.post_category === 'QnA');
        const insightPosts = communityPosts.filter((post) => post.post_category === 'Insight');

        setQnaPosts(qnaPosts);
        setInsightPosts(insightPosts);
      }

      if (requestError) {
        console.error('Error fetching request posts:', requestError);
      } else {
        setExpertPosts(requestPosts);
      }

      setIsLoading(false); // 데이터가 로드되면 로딩 상태를 false로 변경
    };

    fetchPosts();
  }, [supabase]);

  const getCategoryImage = (categoryName: string) => {
    const category = CodeCategories.find((cat) => cat.name === categoryName);
    return category ? category.image : '/default_image.svg';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 로딩 중일 때 스켈레톤 UI를 보여줍니다.
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="snap-y scroll-smooth">
      {/* 메인베너 */}
      <section className="w-full md:h-[calc(100vh-75px)] mb-2 md:mb-64">
        <div className="block md:hidden w-full h-auto bg-cover bg-center">
          <Image
            src="/mobileMainBanner.svg"
            alt="모바일 메인베너"
            width={360}
            height={360}
            className="w-full h-auto object-cover"
          />
        </div>
        <div
          className="hidden md:block w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/mainBanner.svg')" }}
        ></div>
      </section>

      {/* 언어별 카테고리 및 커뮤니티 섹션 */}
      <section className="w-full flex flex-col min-h-[calc(100vh-75px)] snap-start mb-12 md:mb-64">
        <div className="bg-white py-4 flex-shrink-0">
          <div className="container mx-auto px-4 md:px-16 h-full">
            <h2 className="text-xl font-bold mb-4">언어별 카테고리</h2>
            <div className="flex md:justify-between items-center gap-6 md:gap-4 overflow-x-auto">
              {CodeCategories.slice(0, 10).map((category) => (
                <Link
                  href={`/search?query=${category.name}`}
                  key={category.id}
                  className="flex flex-col items-center mb-4 md:w-auto items-start"
                >
                  <Image
                    src={category.categoryImage}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="min-w-16 min-h-16 md:w-20 md:h-20"
                  />
                  <span className="mt-2 text-black text-xs md:text-sm">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-16 flex-grow">
          <h2 className="text-xl font-bold mb-4 mt-4">커뮤니티</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="bg-white p-4 border border-gray-100 rounded-xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-bold mx-auto">Q&A</h2>
                <Link href="/qna" className="text-grey-400 text-sm">
                  {`더보기 >`}
                </Link>
              </div>
              <div>
                {qnaPosts.slice(0, 5).map((item) => (
                  <div key={item.id} className="mb-2 flex border-b border-gray-100 p-4">
                    <Link href={`/qna/${item.id}`} className="mb-1 text-normal font-light text-normal">
                      {item.title}
                    </Link>
                    <span className="text-sm font-extralight text-gray-400 ml-auto">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 border border-gray-100 rounded-xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-bold mx-auto">인사이트</h2>
                <Link href="/insight" className="text-grey-400 text-sm">
                  {`더보기 >`}
                </Link>
              </div>
              <div>
                {insightPosts.slice(0, 5).map((item) => (
                  <div key={item.id} className="mb-2 flex border-b border-gray-100 p-4">
                    <Link href={`/insight/${item.id}`} className="mb-1 text-normal font-light text-normal">
                      {item.title}
                    </Link>
                    <span className="text-sm font-extralight text-gray-400 ml-auto">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전문가 섹션 */}
      <section className="container mx-auto py-4 min-h-[calc(100vh-75px)] flex items-center snap-start">
        <div className="w-full px-4 md:px-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">전문가 의뢰</h2>
            <Link href="/pro" className="text-grey-400 text-sm">
              {`더보기 >`}
            </Link>
          </div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {expertPosts.slice(0, 8).map((expert) => (
              <div
                key={expert.id}
                className="bg-white py-4 px-3 flex-shrink-0 w-64 md:w-auto flex flex-col items-start border border-grey-100 rounded-xl"
              >
                <Link href={`/pro/proDetail/${expert.id}`}>
                  <Image
                    src={expert.post_img[0]}
                    alt={expert.title}
                    width={256}
                    height={192}
                    className="w-screen h-48 rounded-md object-cover mb-4"
                  />
                  <div className="flex items-center mb-2">
                    <Image
                      src={getCategoryImage(expert.lang_category[0])}
                      alt={expert.lang_category[0]}
                      width={20}
                      height={20}
                      className="mr-1"
                    />
                    <span className="text-gray-400 font-extralight text-xs">{expert.lang_category[0]}</span>
                  </div>
                  <h3 className="font-light text-sm">{truncateText(expert.title, 22)}</h3>
                  <h3 className="text-md font-bold mt-2">{expert.price}원</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
