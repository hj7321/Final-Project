'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { CommunityPosts, RequestPosts } from '@/types/type';

const TABS = ['전체', 'Q&A', '인사이트', '전문가 의뢰'];

type CombinedPost = (CommunityPosts & { category: 'Community' }) | (RequestPosts & { category: 'Request' });

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<CombinedPost[]>([]);
  const [filteredResults, setFilteredResults] = useState<CombinedPost[]>([]);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const [communityPostsResponse, requestPostsResponse] = await Promise.all([
        supabase.from('Community Posts').select('*'),
        supabase.from('Request Posts').select('*')
      ]);

      const communityPosts = communityPostsResponse.data as CommunityPosts[];
      const requestPosts = requestPostsResponse.data as RequestPosts[];

      if (communityPostsResponse.error) {
        console.error('Community Posts error:', communityPostsResponse.error.message);
      }
      if (requestPostsResponse.error) {
        console.error('Request Posts error:', requestPostsResponse.error.message);
      }

      if (communityPosts && requestPosts) {
        const combinedPosts: CombinedPost[] = [
          ...communityPosts.map((post) => ({ ...post, category: 'Community' } as CombinedPost)),
          ...requestPosts.map((post) => ({ ...post, category: 'Request' } as CombinedPost))
        ];

        if (query) {
          const lowerQuery = query.toLowerCase();
          const filteredResults = combinedPosts.filter(
            (item) =>
              item.title.toLowerCase().includes(lowerQuery) ||
              item.content.toLowerCase().includes(lowerQuery) ||
              (item.lang_category && item.lang_category.some((lang) => lang.toLowerCase().includes(lowerQuery)))
          );
          setResults(filteredResults);
          setFilteredResults(filteredResults);
        } else {
          setResults(combinedPosts);
          setFilteredResults(combinedPosts);
        }
      }
    };

    fetchPosts();
  }, [query]);

  const handleFilter = (category: string) => {
    setSelectedTab(category);
    if (category === '전체') {
      setFilteredResults(results);
    } else if (category === '전문가 의뢰') {
      setFilteredResults(results.filter((item) => item.category === 'Request'));
    } else if (category === 'Q&A') {
      setFilteredResults(results.filter((item) => item.category === 'Community' && item.post_category === 'QnA'));
    } else if (category === '인사이트') {
      setFilteredResults(results.filter((item) => item.category === 'Community' && item.post_category === 'Insight'));
    }
  };

  const highlightIfMatch = (text: string, highlight: string) => {
    if (!text.toLowerCase().includes(highlight.toLowerCase())) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{query} 검색 결과</h1>
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleFilter(tab)}
            className={`px-4 py-2 ${selectedTab === tab ? 'border-b-2 border-black text-black' : 'text-black'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      {filteredResults.length === 0 ? (
        <div className="w-auto h-screen flex ">
          <h1>검색결과가 없습니다.</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredResults.map((result) => (
            <div key={result.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-bold">{highlightIfMatch(result.title, query)}</h2>
              <p>{highlightIfMatch(result.content, query)}</p>
              <p className="text-gray-500">{result.user_id}</p>
              <div className="flex space-x-2 mt-2">
                {result.lang_category &&
                  result.lang_category.map((lang, index) => (
                    <span
                      key={index}
                      className={`rounded px-2 py-1 text-sm ${
                        lang.toLowerCase().includes(query.toLowerCase()) ? 'bg-yellow-200' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {lang}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
