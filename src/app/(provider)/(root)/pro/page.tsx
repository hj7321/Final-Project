'use client';

import { CodeCategories } from '@/components/dumy';
import useAuthStore from '@/zustand/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import DesktopButton from './_components/DesktopButton';
import MobileButton from './_components/MobileButton';
import Categories from './_components/Categories';
import PostSkeleton from './_components/PostSkeleton';
import ProPosts from './_components/ProPosts';


export interface Posts {
  id: string;
  user_id: string;
  title: string;
  content: string;
  lang_category: string[];
  post_img: string[];
  price: number;
}

export default function ProMainPage() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Posts[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();
  const { isPro } = useAuthStore();
  const [skeletonLoading, setSkeletonLoading] = useState<boolean>(true)
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (page: number, languages: string[] = []) => {
    setLoading(true);
    setSkeletonLoading(true)
    try {
      const langQuery = languages.length > 0 ? `&languages=${encodeURIComponent(JSON.stringify(languages))}` : '';
      const url = `/api/proMain?page=${page}${langQuery}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        if (page === 0) {
          setPosts(data);
          setFilteredPosts(data);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data]);
          setFilteredPosts((prevPosts) => [...prevPosts, ...data]);
        }
        setHasMore(data.length === 10);
      } else {
        console.error('Data fetch error');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setSkeletonLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchData(page, selectedLanguages);
  }, [page, selectedLanguages]);

  useEffect(() => {
    if (selectedLanguages.length > 0 && Array.isArray(posts)) {
      const filtered = posts.filter((post) =>
        selectedLanguages.some((lang) =>
          post.lang_category?.some(
            (category) => category.replace(/\s+/g, '').toLowerCase() === lang.replace(/\s+/g, '').toLowerCase()
          )
        )
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedLanguages, posts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        setLoading(true);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, setHasMore]);

  const handleLanguageFilter = (lang: string) => {
    const newSelectedLanguages = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];

    setSelectedLanguages(newSelectedLanguages);
    setPage(0);
    fetchData(0, newSelectedLanguages);
  };
  const handleNavigation = () => {
    route.push('/pro/createCard');
  };
  const getCategoryImage = (categoryName: string) => {
    const category = CodeCategories.find((cat) => cat.name === categoryName);
    return category ? category.image : '/default_image.svg'; // 기본 이미지는 필요시 변경
  };

  return (
    <div className="mx-auto flex-col justify-center items-center">
      <div className="hidden md:block flex flex-row justify-end mt-[15px] md:w-auto items-end mx-auto w-full 2xl:w-[85%]">
        {/* 게시글 등록버튼 - 데스크탑 사이즈 */}
        {!isPro === true ? (
          <div className="w-full mt-mt-3 h-[48px]"></div>
        ) : (
          <DesktopButton handleNavigation={handleNavigation}/>
        )}
      </div>
      {/* 언어별 카테고리 영역 */}
      <Categories handleLanguageFilter={handleLanguageFilter} selectedLanguages={selectedLanguages}/>

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
        {skeletonLoading ? (
            <PostSkeleton />
        ) : (
          <ProPosts filteredPosts={filteredPosts} getCategoryImage={getCategoryImage} />
        )}
      </div>
    </div>
  );
}

