'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { CodeCategories } from '@/components/dumy';

export default function Home() {
  const [qnaPosts, setQnaPosts] = useState<any[]>([]);
  const [insightPosts, setInsightPosts] = useState<any[]>([]);
  const [expertPosts, setExpertPosts] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const [communityResponse, requestResponse] = await Promise.all([
        supabase
          .from('Community Posts')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('Request Posts')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      const { data: communityPosts, error: communityError } = communityResponse;
      const { data: requestPosts, error: requestError } = requestResponse;

      if (communityError) {
        console.error('Error fetching community posts:', communityError);
      } else {
        const qnaPosts = communityPosts.filter(post => post.post_category === 'QnA');
        const insightPosts = communityPosts.filter(post => post.post_category === 'Insight');

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

  return (
    <main className="bg-gray-100">
      {/* 메인베너 */}
      <section
        className="w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2012/08/25/22/22/saturn-54999_1280.jpg')" }}
      >
        <span className="text-white text-2xl bg-black bg-opacity-50 px-4 py-2 rounded">메인 배너</span>
      </section>

      <section className="w-full min-h-screen flex flex-col">
        {/* 카테고리 */}
        <div className="bg-white py-8 flex-shrink-0 h-1/3">
          <div className="container mx-auto px-4 h-full">
            <h2 className="text-2xl font-bold mb-4">언어별 카테고리</h2>
            <div className="flex justify-between overflow-x-auto h-full items-center">
              {CodeCategories.map((category) => (
                <div key={category.id} className="flex flex-col items-center mx-2">
                  <img src={category.image} alt={category.name} className="w-24 h-24 bg-gray-300 rounded-full" />
                  <span className="mt-2 text-black text-lg">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 커뮤니티섹션 */}
        <div className="container mx-auto px-4 py-8 flex-grow min-h-screen">
          <h2 className="text-2xl font-bold mb-4">커뮤니티</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="bg-gray-200 p-4 rounded flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">QnA</h2>
                  <a href="#" className="text-blue-500">
                    더보기
                  </a>
                </div>
                <div className="overflow-auto">
                  {qnaPosts.slice(0,20).map((item) => (
                    <p key={item.id} className="mb-5">{item.title} <span className="text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span></p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-200 p-4 rounded flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">인사이트</h2>
                  <a href="#" className="text-blue-500">
                    더보기
                  </a>
                </div>
                <div className="overflow-auto">
                  {insightPosts.slice().map((item) => (
                    <p key={item.id} className="mb-5">
                      {item.title} <span className="text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전문가 */}
      <section className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">전문가 의뢰 목록</h2>
          <Link href="/pro" className="text-blue-500">
            더보기
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {expertPosts.slice(0, 10).map((expert) => (
            <div key={expert.id} className="bg-white p-2 shadow rounded">
              <img src={expert.post_img[0]} alt={expert.title} className="w-full h-100 object-cover mb-4" />
              <h3 className="font-bold">{expert.title}</h3>
              {/* <p>{expert.price}</p> */}
              <span className="text-gray-500">{expert.lang_category.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
