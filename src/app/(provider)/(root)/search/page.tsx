'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSearchPosts from '@/hooks/useSearchPosts';
import Image from 'next/image';
import Link from 'next/link';
import { CodeCategories } from '@/components/dumy';

const TABS = ['전체', 'Q&A', '인사이트', '전문가 의뢰'];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const { results, filteredResults, setFilteredResults, counts, userMap } = useSearchPosts(query);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const handleFilter = (category: string) => {
    setSelectedTab(category);
    if (category === '전체') {
      setFilteredResults(results);
    } else if (category === '전문가 의뢰') {
      setFilteredResults(results.filter((item) => item.category === 'Request'));
    } else if (category === 'Q&A') {
      setFilteredResults(results.filter((item) => item.category === 'Community' && (item as any).post_category === 'QnA'));
    } else if (category === '인사이트') {
      setFilteredResults(results.filter((item) => item.category === 'Community' && (item as any).post_category === 'Insight'));
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

  const getCategoryImage = (category: string) => {
    const categoryData = CodeCategories.find((cat) => cat.name === category);
    return categoryData ? categoryData.image : ':/defaultProfileimg.svg';
  };

  const getDetailPageLink = (category: string, postCategory: string, id: string) => {
    if (category === 'Request') {
      return `/pro/proDetail/${id}`;
    } else if (category === 'Community' && postCategory === 'QnA') {
      return `/qna/${id}`;
    } else if (category === 'Community' && postCategory === 'Insight') {
      return `/insight/${id}`;
    }
    return '#';
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-md mb-4 text-primary-500 mb-8 flex">
        {query}
        <p className="text-grey-300 ml-1">{`의 검색 결과`}</p>
      </h1>
      <div className="flex space-x-4 mb-12 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleFilter(tab)}
            className={`whitespace-nowrap px-4 py-2 ${
              selectedTab === tab ? 'border-b-2 border-primary-500 text-primary-500' : 'text-black'
            }`}
          >
            {tab}{' '}
            {tab === '전체'
              ? counts.total
              : tab === 'Q&A'
              ? counts.qna
              : tab === '인사이트'
              ? counts.insight
              : counts.request}
          </button>
        ))}
      </div>
      {filteredResults.length === 0 ? (
        <div className="w-auto h-screen flex ">
          <h1>검색결과가 없습니다.</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredResults.map((result) => (
            <Link key={result.id} href={getDetailPageLink(result.category, (result as any).post_category, result.id)}>
              <div className="px-8 py-4 bg-white rounded-xl border border-grey-100 cursor-pointer">
                <div className="flex space-x-2 mb-3">
                  {result.lang_category && (
                    <div className="flex">
                      <Image src={getCategoryImage(result.lang_category[0])} alt={result.lang_category[0]} width={24} height={24} className="rounded" />
                      <div>
                        <span
                          className={`rounded px-2 py-1 text-sm ${
                            result.lang_category[0].toLowerCase().includes(query.toLowerCase())
                              ? 'text-primary-400'
                              : 'bg-white text-gray-500'
                          }`}
                        >
                          {result.lang_category[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-medium mb-2">{highlightIfMatch(result.title, query)}</h2>
                <p className="text-md text-grey-500 mb-2 max-h-12 truncate">{highlightIfMatch(result.content, query)}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">{userMap[result.user_id] || result.user_id}</p>
                </div>
                <div className="flex mt-4">
                  <div className="flex items-center">
                    <span className="ml-1 text-gray-500">댓글수</span>
                  </div>
                  <div className="flex items-center">
                    <span className="ml-1 text-gray-500">좋아요</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-auto">{new Date(result.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
