'use client';

import { CodeCategories } from '@/components/dumy';
import Link from 'next/link';
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
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number, languages: string[] = []) => {
    try {
      const langQuery = languages.length > 0 ? `&languages=${encodeURIComponent(JSON.stringify(languages))}` : '';
      const url = `/api/proMain?page=${page}${langQuery}`;
      console.log(`Fetching data for page: ${page}, languages: ${languages}`);
      console.log(`URL: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Fetched data:', data);

      if (data && Array.isArray(data)) {
        if (page === 0) {
          setPosts(data);
          setFilteredPosts(data);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data]);
          setFilteredPosts(prevPosts => [...prevPosts, ...data]);
        }
      } else {
        console.error('No data fetched or data is not an array');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(page, selectedLanguages);
  }, [page, selectedLanguages]);

  useEffect(() => {
    if (selectedLanguages.length > 0 && Array.isArray(posts)) {
      const filtered = posts.filter(post =>
        selectedLanguages.some(lang =>
          post.lang_category?.some(category =>
            category.replace(/\s+/g, '').toLowerCase() === lang.replace(/\s+/g, '').toLowerCase()
          )
        )
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
    console.log('Filtered posts updated:', filteredPosts);
  }, [selectedLanguages, posts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        setLoading(true);
        setPage(prevPage => prevPage + 1);
        setLoading(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const handleLanguageFilter = (lang: string) => {
    const newSelectedLanguages = selectedLanguages.includes(lang)
      ? selectedLanguages.filter(l => l !== lang)
      : [...selectedLanguages, lang];

    setSelectedLanguages(newSelectedLanguages);
    setPage(0);
    fetchData(0, newSelectedLanguages); 
  };

  return (
    <div className="max-w-[1440px] mx-auto flex-col justify-center items-center">
      {/* 언어별 카테고리 영역 */}
      <div className="my-[70px] mx-auto ">
        <ul className="flex flex-row justify-between items-center mt-[50px] max-w-7xl mx-auto">
          {CodeCategories.map((lang) => (
            <li
              className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer"
              key={lang.id}
              onClick={() => handleLanguageFilter(lang.name)}
            >
              <img className="w-[80px] h-[80px] bg-slate-400 rounded-full mb-[10px] mx-auto" src={lang.image} />
              <p
                className={`text-center ${selectedLanguages.includes(lang.name) ? 'text-blue-500' : 'text-black-500'}`}
              >
                {lang.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {/* 경력 버튼 필터링 영역 */}
      <div className="max-w-4xl mx-auto flex justify-between px-[20px] ">
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">2년 ~ 4년</button>
        <button className="border-2 p-3 rounded-full">4년 ~ 5년</button>
        <button className="border-2 p-3 rounded-full">5년 ~ 6년</button>
        <button className="border-2 p-3 rounded-full">6년 ~ 8년</button>
        <button className="border-2 p-3 rounded-full">8년 이상</button>
      </div>
      {/* 의뢰 서비스 리스트 */}
      <div className="max-w-[1440px] mx-auto flex flex-row flex-wrap my-[70px] justify-start">
      {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link href={`pro/proDetail/${post.id}`} key={post.id}>
              <div className="w-[300px] h-[400px] border-2 border-black rounded-lg m-[30px]">
                {post.post_img && post.post_img.length > 0 && (
                  <img
                    className="w-full h-[200px] rounded-lg object-cover"
                    src={post.post_img[0]}
                  />
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
