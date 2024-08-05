'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSearchPosts from '@/hooks/useSearchPosts';
import Image from 'next/image';
import { CodeCategories } from '@/components/dumy';

const TABS = ['전체', 'Q&A', '인사이트', '전문가 의뢰'];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const { results, filteredResults, setFilteredResults, counts } = useSearchPosts(query);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

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

  const getCategoryImage = (category: string) => {
    const categoryData = CodeCategories.find((cat) => cat.name === category);
    return categoryData ? categoryData.image : 'https://via.placeholder.com/150?text=No+Image';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-primary-500 flex">{query}<p className='text-grey-400'>{ `의 검색 결과`}</p></h1>
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleFilter(tab)}
            className={`px-4 py-2 ${selectedTab === tab ? 'border-b-2 border-primary-500 text-primary-500' : 'text-black'}`}
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
        <div className="grid grid-cols-1 gap-4">
          {filteredResults.map((result) => (
            <div key={result.id} className="px-8 py-4 bg-white rounded-xl border border-grey-100">
              <div className="flex space-x-2 mb-3">
                {result.lang_category &&
                  result.lang_category.map((lang, index) => (
                    <div className='flex'>
                    <Image
                      key={index}
                      src={getCategoryImage(lang)}
                      alt={lang}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                    <div><span
                      key={index}
                      className={`rounded px-2 py-1 text-sm ${
                        lang.toLowerCase().includes(query.toLowerCase()) ? 'text-primary-400' : 'bg-white text-gray-500'
                      }`}
                    >
                      {lang}
                    </span></div></div>
                  ))}
              </div>
              <h2 className="text-lg font-medium mb-2">{highlightIfMatch(result.title, query)}</h2>
              <p className="text-md text-grey-500 mb-2">{highlightIfMatch(result.content, query)}</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-400">{result.user_id}</p>              
              </div>
              {/* <div className="flex space-x-2 mt-2">
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
              </div> */}
              <div className="flex mt-4">
                <div className="flex items-center">
                  <span className="ml-1 text-gray-500">조회수</span>
                </div>
                <div className="flex items-center">
                  <span className="ml-1 text-gray-500">댓글수</span>
                </div>
                <div className="flex items-center">
                  <span className="ml-1 text-gray-500">좋아요</span>
                </div>
                <p className="text-sm text-gray-400 ml-auto">{new Date(result.created_at).toLocaleDateString()}</p>
              </div>
            </div>
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
