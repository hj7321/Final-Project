'use client';

import { CodeCategories } from '@/components/dumy';
import useAuthStore from '@/zustand/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

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
  const [posts, setPosts] = useState<Posts[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Posts[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();
  const { isPro } = useAuthStore();
  const [hasMore, setHasMore] = useState(true)

  const fetchData = useCallback(async (page: number, languages: string[] = []) => {
    setLoading(true);
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
        {!isPro === true ? (
          <div className=""></div>
        ) : (
          <button
            className="md:ml-[85%] bg-primary-500 hover:bg-primary-600 md:px-5 md:py-3 md:mt-3 md:mr-[0px] px-3 py-2 mt-1 mr-4 flex flex-row justify-center items-center rounded-full"
            onClick={handleNavigation}
          >
            <div className='md:w-[24px] md:h-[24px] w-[16px] h-[16px]'>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.2536 6.47487L9.77877 8.94975L5.17441 13.5541C4.95175 13.7768 4.81748 14.0727 4.79653 14.3869L4.5743 17.7204C4.52198 18.5052 5.1731 19.1563 5.95789 19.104L9.29139 18.8817C9.60559 18.8608 9.9015 18.7265 10.1242 18.5039L14.7285 13.8995L17.2034 11.4246M12.2536 6.47487L13.8093 4.91924C14.317 4.41156 15.1401 4.41156 15.6478 4.91924L18.759 8.03051C19.2667 8.53819 19.2667 9.3613 18.759 9.86899L17.2034 11.4246M12.2536 6.47487L17.2034 11.4246"
                  stroke="white"
                />
                <path
                  d="M18.759 8.03051L15.6478 4.91924C15.1401 4.41156 14.317 4.41156 13.8093 4.91924L13.1729 5.55563C12.6652 6.06332 12.6652 6.88643 13.1729 7.39411L16.2842 10.5054C16.7918 11.0131 17.6149 11.0131 18.1226 10.5054L18.759 9.86899C19.2667 9.3613 19.2667 8.53819 18.759 8.03051Z"
                  fill="white"
                  stroke="white"
                />
              </svg>
            </div>
            <div className="text-white mx-[2px] md:text-base text-[12px]">홍보하기</div>
          </button>
        )}
      </div>
      {/* 언어별 카테고리 영역 */}
      <div className=" md:mt-[30px] mt-[20px] mx-auto overflow-hidden">
        <ul className="flex flex-row justify-start items-center max-w-7xl mx-auto lg:justify-between lg:flex-wrap lg:overflow-visible overflow-x-auto scrollbar-hide">
          {CodeCategories.map((lang) => (
            <li
              className="md:mx-[10px] mx-[5px] flex-col justify-center items-center hover:cursor-pointer flex-shrink-0 w-[80px] sm:w-[100px] md:w-[120px] lg:w-auto"
              key={lang.id}
              onClick={() => handleLanguageFilter(lang.name)}
            >
              <Image
                className="md:w-[80px] md:h-[80px] w-[54px] h-[54px] mb-[10px] mx-auto"
                src={lang.categoryImage}
                width={80}
                height={80}
                priority
                alt={lang.name}
              />
              <p
                className={`text-center w-full ${selectedLanguages.includes(lang.name) ? 'text-blue-500' : 'text-black-500'} md:text-base text-xs`}
              >
                {lang.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
      
      
      <div className="md:hidden flex flex-row justify-end mt-[15px] md:w-[85%] w-[330px] mx-auto items-center">
        {!isPro === true ? (
          <div className=""></div>
        ) : (
          <button
            className="w-full bg-primary-500 hover:bg-primary-600 md:px-5 md:py-3 md:mt-3 md:mr-[0px] px-3 py-2 mt-1 flex flex-row justify-center items-center rounded-lg"
            onClick={handleNavigation}
          >
            <div className='w-[24px] h-[24px]'>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.2536 6.47487L9.77877 8.94975L5.17441 13.5541C4.95175 13.7768 4.81748 14.0727 4.79653 14.3869L4.5743 17.7204C4.52198 18.5052 5.1731 19.1563 5.95789 19.104L9.29139 18.8817C9.60559 18.8608 9.9015 18.7265 10.1242 18.5039L14.7285 13.8995L17.2034 11.4246M12.2536 6.47487L13.8093 4.91924C14.317 4.41156 15.1401 4.41156 15.6478 4.91924L18.759 8.03051C19.2667 8.53819 19.2667 9.3613 18.759 9.86899L17.2034 11.4246M12.2536 6.47487L17.2034 11.4246"
                  stroke="white"
                />
                <path
                  d="M18.759 8.03051L15.6478 4.91924C15.1401 4.41156 14.317 4.41156 13.8093 4.91924L13.1729 5.55563C12.6652 6.06332 12.6652 6.88643 13.1729 7.39411L16.2842 10.5054C16.7918 11.0131 17.6149 11.0131 18.1226 10.5054L18.759 9.86899C19.2667 9.3613 19.2667 8.53819 18.759 8.03051Z"
                  fill="white"
                  stroke="white"
                />
              </svg>
            </div>
            <div className="text-white mx-[2px] text-base">홍보하기</div>
          </button>
        )}
      </div>




      {/* 의뢰 서비스 리스트 */}
      <div className="lg:max-w-[1440px] md:mx-auto flex flex-row flex-wrap mb-[70px] mt-[10px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center lg:justify-start">
        {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link href={`pro/proDetail/${post.id}`} key={post.id} className="grid grid-cols-1 mx-auto">
              <div className="lg:w-[300px] lg:h-[300px] w-[160px] h-[240px] rounded-lg xl:m-[30px] border border-grey-50 m-[10px] hover:scale-105 md:hover:scale-110 transition-transform duration-200">
                {post.post_img && post.post_img.length > 0 && (
                  <Image
                    className="md:w-[280px] w-[140px] xl:h-[160px] h-[130px] rounded-lg object-cover mt-2 mx-auto"
                    src={post.post_img[0]}
                    width={300}
                    height={160}
                    priority
                    alt={post.title}
                  />
                )}
                <div className="flex flex-col p-2 h-[140px]">
                  <div>
                    <div className="flex flex-row">
                      <p className="text-sm lg:mb-2 lg:mr-3 flex">
                        <Image
                          src={getCategoryImage(post.lang_category[0])}
                          alt={post.lang_category[0]}
                          width={20}
                          height={20}
                          priority
                          className="mr-2 w-[16px] h-[16px] lg:w-[20px] lg:h-[20px]"
                        />
                        <span className='text-xs text-grey-600 lg:text-sm'>{post.lang_category[0]}</span>
                      </p>
                      {/* <p className="text-sm mb-2 mr-3">{post.lang_category[1]}</p> */}
                    </div>
                    <p className="text-xs lg:text-sm mt-2 line-clamp-2">{post.title}</p>
                  </div>
                  <p className="md:text-xl text-sm mt-1 lg:mt-2 font">{post.price}원</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      
    </div>
  );
}
