'use client';

import { CodeCategories } from '@/components/dumy';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Posts {
  id: string;
  user_id: string;
  title: string;
  content: string;
  lang_category: string[];
  post_img: string[];
  price: number;
}

export default function proMainPage() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Posts[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();

  const fetchData = async (page: number, languages: string[] = []) => {
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
      } else {
        console.error('data fetch error');
      }
    } catch (error) {
      console.error(error);
    }
  };

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
  }, [loading]);

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
  return (
    <div className="max-w-[1440px] mx-auto flex-col justify-center items-center">
      <div className="flex flex-row justify-end">
        <button className="bg-primary-500 px-5 py-3 mt-5 flex flex-row items-center justify-center" onClick={handleNavigation}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <span>등록하기</span>
        </button>
      </div>
      {/* 언어별 카테고리 영역 */}
      <div className="my-[70px] mx-auto ">
        <ul className="flex flex-row justify-between items-center mt-[50px] max-w-7xl mx-auto">
          {CodeCategories.map((lang) => (
            <li
              className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer"
              key={lang.id}
              onClick={() => handleLanguageFilter(lang.name)}
            >
              <img className="w-[80px] h-[80px] rounded-full mb-[10px] mx-auto" src={lang.image} />
              <p
                className={`text-center ${selectedLanguages.includes(lang.name) ? 'text-blue-500' : 'text-black-500'}`}
              >
                {lang.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {/* 의뢰 서비스 리스트 */}
      <div className="max-w-[1440px] mx-auto flex flex-row flex-wrap my-[70px] justify-start">
        {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link href={`pro/proDetail/${post.id}`} key={post.id}>
              <div className="w-[300px] h-[400px] border-2 border-black rounded-lg m-[30px]">
                {post.post_img && post.post_img.length > 0 && (
                  <img className="w-full h-[200px] rounded-lg object-cover" src={post.post_img[0]} />
                )}
                <div className="flex-col p-2">
                  <p className="text-2xl mb-2">{post.title}</p>
                  <hr />
                  <p className="text-xl mt-2">{post.content}</p>
                  <p className="text-xl ">{post.price}</p>
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
