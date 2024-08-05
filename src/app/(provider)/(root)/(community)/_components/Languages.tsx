import { CodeCategories } from '@/components/dumy';
import { CommunityPosts } from '@/types/type';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';
export default function Languages() {
  const [posts, setPosts] = useState<CommunityPosts[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPosts[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const fetchData = useCallback(async (languages: string[] = []) => {
    try {
      const langQuery = languages.length > 0 ? `&languages=${encodeURIComponent(JSON.stringify(languages))}` : '';
      const url = `/api/proMain?${langQuery}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setPosts(data);
        setFilteredPosts(data);
      } else {
        console.error('data fetch error');
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleLanguageFilter = (lang: string) => {
    const newSelectedLanguages = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];

    setSelectedLanguages(newSelectedLanguages);
    fetchData(newSelectedLanguages);
  };

  useEffect(() => {
    fetchData(selectedLanguages);
  }, [selectedLanguages]);

  return (
    <div className="w-[170px] h-[575px] px-6 py-8 flex flex-col items-start gap-6 border border-black rounded-[24px] mt-1">
      <p className="font-bold text-[20px]">언어 선택</p>

      <div className="flex flex-col gap-[24px]">
        {CodeCategories.map((lang) => (
          <div
            className="flex justify-start items-center hover:cursor-pointer gap-[12px]"
            key={lang.id}
            onClick={() => handleLanguageFilter(lang.name)}
          >
            <Image
              alt={lang.name}
              src={lang.image}
              width={24}
              height={24}
              className="w-[24px] h-[24px] rounded-full "
            />
            <p className={`text-center ${selectedLanguages.includes(lang.name) ? 'text-blue-500' : 'text-black-500'}`}>
              {lang.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
