'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { CodeCategories } from '@/components/dumy';
import { CommunityPosts, RequestPosts } from '@/types/type';
import Image from 'next/image';

export default function Home() {
  const [qnaPosts, setQnaPosts] = useState<CommunityPosts[]>([]);
  const [insightPosts, setInsightPosts] = useState<CommunityPosts[]>([]);
  const [expertPosts, setExpertPosts] = useState<RequestPosts[]>([]);
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
    };

    fetchPosts();
  }, []);

  const getCategoryImage = (categoryName: string) => {
    const category = CodeCategories.find(cat => cat.name === categoryName);
    return category ? category.image : '/default_image.svg'; // 기본 이미지는 필요시 변경
  };

  return (
    <main className='snap-y scroll-smooth'>
      {/* 메인베너 */}
      <section className="w-full h-[calc(100vh-75px)] bg-cover bg-center bg-[url('/mainBanner.svg')] snap-start mb-64"></section>

      {/* <div className="w-full h-64 flex items-center mx-auto snap-end">섹션나누기</div> */}

      {/* 언어별 카테고리 및 커뮤니티 섹션 */}
      <section className="w-full flex flex-col min-h-[calc(100vh-75px)] snap-start mb-64">
        <div className="bg-white py-4 flex-shrink-0">
          <div className="container mx-auto px-4 h-full px-16">
            <h2 className="text-xl font-bold mb-4">언어별 카테고리</h2>
            <div className="flex justify-between h-full items-center">
              {CodeCategories.map((category) => (
                <div key={category.id} className="flex flex-col items-center mx-2">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="mt-2 text-black text-normal">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 flex-grow px-16">
          <h2 className="text-xl font-bold mb-4 mt-4">커뮤니티</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="bg-white p-4 border border-gray-100 rounded-xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-bold mx-auto">Q&A</h2>
                <a href="#" className="text-blue-500">
                  더보기
                </a>
              </div>
              <div>
                {qnaPosts.slice(0, 5).map((item) => (
                  <div key={item.id} className="mb-2 flex border-b border-gray-100 p-4">
                    <p className="mb-1 text-normal font-light text-normal">{item.title}</p>
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
                <a href="#" className="text-blue-500">
                  더보기
                </a>
              </div>
              <div>
                {insightPosts.slice(0, 5).map((item) => (
                  <div key={item.id} className="mb-2 flex border-b border-gray-100 p-4">
                    <p className="mb-1 text-normal font-light text-normal">{item.title}</p>
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
        <div className="w-full  px-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">전문가 의뢰</h2>
            <Link href="/pro" className="text-grey-400 text-sm">
              {`더보기 >`}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {expertPosts.slice(0, 8).map((expert) => (
              <div key={expert.id} className="bg-white py-4 px-2 flex flex-col items-start">
                <img src={expert.post_img[0]} alt={expert.title} className="w-full h-36 rounded-md object-cover mb-4" />
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
                <h3 className="font-bold text-center text-sm">{expert.title}</h3>
                <h3 className="text-center text-sm mt-1">{expert.price}원</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
