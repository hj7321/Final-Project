'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSearchPosts from '@/hooks/useSearchPosts';
import Image from 'next/image';
import Link from 'next/link';
import { CodeCategories } from '@/components/dumy';
import styles from '@/css/loader.module.css';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BookmarkCount } from '../mypage/[id]/_components/BookmarkCount';

const TABS = ['전체', 'Q&A', '인사이트', '전문가 의뢰'];
const ITEMS_PER_PAGE = 10; // 페이지당 항목 수

const getCommentCount = async (postId: string) => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('Community Comments')
    .select('*', { count: 'exact' })
    .eq('community_post_id', postId);

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0;
  }
  return count;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const { results, filteredResults, setFilteredResults, counts, userMap, isLoading } = useSearchPosts(query);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  const handleFilter = (category: string) => {
    setSelectedTab(category);
    setCurrentPage(1); // 필터 변경 시 페이지를 처음으로 리셋
    if (category === '전체') {
      setFilteredResults(results);
    } else if (category === '전문가 의뢰') {
      setFilteredResults(results.filter((item) => item.category === 'Request'));
    } else if (category === 'Q&A') {
      setFilteredResults(
        results.filter((item) => item.category === 'Community' && (item as any).post_category === 'QnA')
      );
    } else if (category === '인사이트') {
      setFilteredResults(
        results.filter((item) => item.category === 'Community' && (item as any).post_category === 'Insight')
      );
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 900;
  };

  const paginatedResults = filteredResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => {
          setCurrentPage(i);
          scrollToTop();
        }}
        className={`px-4 py-2 rounded-xl ${currentPage === i ? 'bg-primary-500 text-white' : 'bg-grey-200'}`}
      >
        {i}
      </button>
    );
  }

  const { data: commentCounts, isLoading: commentsLoading } = useQuery({
    queryKey: ['commentCounts', paginatedResults],
    queryFn: async () => {
      if (!paginatedResults) return [];
      const counts = await Promise.all(paginatedResults.map((post) => getCommentCount(post.id)));
      return counts;
    },
    enabled: !!paginatedResults
  });

  if (isLoading || commentsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className={styles.icon}>
          <div className={styles.circle + ' ' + styles.circleLeft}>
            <div className={styles.innerCircle + ' ' + styles.innerCircleLeft}></div>
          </div>
          <div className={styles.circle + ' ' + styles.circleRight}>
            <div className={styles.innerCircle + ' ' + styles.innerCircleRight}></div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="w-auto flex">
          <h1>검색결과가 없습니다.</h1>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8">
            {paginatedResults.map((result, index) => (
              <Link key={result.id} href={getDetailPageLink(result.category, (result as any).post_category, result.id)}>
                <div className="flex px-8 py-4 bg-white rounded-xl border border-grey-100 cursor-pointer">
                  {result.post_img && result.post_img.length > 0 && (
                    <div className="flex-shrink-0 hidden md:block md:w-44 md:h-44 mr-4 my-auto">
                      <Image
                        src={result.post_img[0]}
                        alt={result.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-grow">
                    <div className="flex space-x-2 mb-1">
                      {result.lang_category &&
                        result.lang_category.slice(0, isMobile() ? 1 : result.lang_category.length).map((lang, id) => (
                          <div key={id} className="flex mb-1">
                            <Image src={getCategoryImage(lang)} alt={lang} width={24} height={24} className="rounded" />
                            <div>
                              <span
                                className={`rounded px-2 py-1 text-sm ${
                                  lang.toLowerCase().includes(query.toLowerCase())
                                    ? 'text-primary-400'
                                    : 'bg-white text-grey-500'
                                }`}
                              >
                                {lang}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <h2 className="text-lg font-medium mb-2">{highlightIfMatch(result.title, query)}</h2>
                    <p className="text-md text-grey-500 mb-2">
                      {highlightIfMatch(truncateText(result.content, isMobile() ? 25 : 180), query)}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400"> {highlightIfMatch(userMap[result.user_id] || '알수없음', query)}</p>
                    </div>
                    <div className="flex mt-4">
                      <div className="flex items-center">
                        <Image src="/comment.svg" alt="" width={16} height={16} className="w-[16px] h-[16px]" />
                        <p className="ml-1 text-grey-500">{commentCounts?.[index] ?? 0}</p>
                      </div>
                      <div className="flex items-center ml-4">
                        <Image src="/bookmark_dark.svg" alt="" width={16} height={16} className="w-[16px] h-[16px]" />
                        <span className="ml-1 text-grey-500">
                          {' '}
                          <BookmarkCount postId={result.id} />
                        </span>
                      </div>
                      <p className="text-sm text-grey-400 ml-auto">
                        {new Date(result.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex mt-8 gap-2">{paginationButtons}</div>
        </>
      )}
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
