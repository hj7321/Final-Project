import { CodeCategories } from '@/components/dumy';
import { CommunityPosts } from '@/types/type';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface LanguagesProps {
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
}

export default function Languages({ selectedLanguages, setSelectedLanguages }: LanguagesProps) {
  const [posts, setPosts] = useState<CommunityPosts[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPosts[]>([]);

  // const fetchData = useCallback(async (languages: string[] = []) => {
  //   try {
  //     const langQuery = languages.length > 0 ? `&languages=${encodeURIComponent(JSON.stringify(languages))}` : '';
  //     const url = `/api/proMain?${langQuery}`;
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (data && Array.isArray(data)) {
  //       setPosts(data);
  //       setFilteredPosts(data);
  //     } else {
  //       console.error('data fetch error');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  // const handleLanguageFilter = useCallback(
  //   (lang: string) => {
  //     const newSelectedLanguages = selectedLanguages.includes(lang)
  //       ? selectedLanguages.filter((l) => l !== lang)
  //       : [...selectedLanguages, lang];

  //     setSelectedLanguages(newSelectedLanguages);
  //   },
  //   [selectedLanguages]
  // );

  // useEffect(() => {
  //   fetchData(selectedLanguages);
  // }, [selectedLanguages, fetchData]);

  const handleLanguageFilter = useCallback(
    (lang: string) => {
      if (!selectedLanguages) return; // safeguard against undefined
      const newSelectedLanguages = selectedLanguages.includes(lang)
        ? selectedLanguages.filter((l) => l !== lang)
        : [...selectedLanguages, lang];

      setSelectedLanguages(newSelectedLanguages);
    },
    [selectedLanguages, setSelectedLanguages]
  );

  return (
    <div>
      {/* 모바일 화면 */}
      <div className="container mx-auto px-4  h-full sm:hidden">
        <div className="flex items-center gap-6 overflow-x-auto">
          {CodeCategories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center mb-4  "
              onClick={() => handleLanguageFilter(category.name)}
            >
              <div className="w-[52px] h-[52px] flex rounded-[8px] items-center justify-center overflow-hidden">
                <Image src={category.image} alt={category.name} width={64} height={64} className="min-w-16 min-h-16 " />
              </div>
              <p className="mt-2 text-black text-xs">{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 데스크탑 화면 */}
      <div className="px-[16px] py-[24px] flex-col items-start gap-[24px] border border-grey-200 rounded-[16px] mt-1 hidden sm:flex">
        <p className="font-bold text-[16px] text-grey-400 mx-auto">언어 선택</p>
        <div className="flex flex-col gap-[16px]">
          {CodeCategories.map((lang) => (
            <div
              className={`flex justify-start items-center hover:cursor-pointer gap-[6px] text-[14px] rounded-[20px] px-[8px] py-[5px] border border-solid ${
                selectedLanguages.includes(lang.name)
                  ? ' bg-primary-50 border-primary-500 '
                  : 'border-transparent bg-grey-50 '
              }`}
              key={lang.id}
              onClick={() => handleLanguageFilter(lang.name)}
            >
              <Image
                alt={lang.name}
                src={selectedLanguages.includes(lang.name) ? lang.image : lang.darkImage}
                width={24}
                height={24}
                className="w-[24px] h-[24px] "
              />
              <p
                className={`text-center ${
                  selectedLanguages.includes(lang.name) ? 'text-primary-500 font-bold' : ' text-grey-400'
                }`}
              >
                {lang.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
