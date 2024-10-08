'use client';

import { CodeCategories } from '@/components/dumy';
import { Portfolio } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MobileEditPorifolio from './MobileEditPorifolio';
import Image from 'next/image';
import useProfile from '@/hooks/useProfile';

interface MobileDetailPortfolioProps {
  portfolioId: string | null;
  onBack: () => void;
}

export default function MobileDetailPortfolio({ portfolioId, onBack }: MobileDetailPortfolioProps) {
  const params = useParams();
  const userId = params.id as string;

  const { userData, isUserDataPending, userDataError } = useProfile(userId);

  const getsPortfolio = async () => {
    const response = await fetch('/api/portFolio');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Portfolio[] = await response.json();
    return data.filter((post) => post.user_id === userId);
  };

  const { data } = useQuery<Portfolio[]>({
    queryKey: ['posts', userId],
    queryFn: getsPortfolio,
    enabled: !!userId
  });

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [langCategory, setLangCategory] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (data && portfolioId) {
      const portfolio = data.find((p) => p.id === portfolioId);
      if (portfolio) {
        setTitle(portfolio.title || '');
        setContent(portfolio.content || '');
        setStartDate(portfolio.start_date || '');
        setEndDate(portfolio.end_date || '');
        setLangCategory(portfolio.lang_category || '');
        setPreviewUrls(portfolio.portfolio_img || []);
      }
    }
  }, [data, portfolioId]);

  const editHandle = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return <MobileEditPorifolio portfolioId={portfolioId} onBack={handleBack} />;
  }

  const categoryImage = CodeCategories.find((category) => category.name === langCategory)?.image;
  return (
    <div>
      <button onClick={onBack} className="mt-4 bg-primary-500 text-white rounded p-2">
        뒤로가기
      </button>
      <div className="flex">
        <div className="w-full pr-4 ml-7">
          <div className="flex items-center mt-20 mb-7">
            <Image
              src={userData?.profile_img || '/defaultProfileimg.svg'}
              alt="유저 이미지"
              width={36}
              height={36}
              className="rounded-[50%] mr-4overflow-hidden w-20 h-20 "
            />
            <h1 className="text-xl font-bold">{userData?.nickname}</h1>
          </div>
          <div className="flex flex-col mx-auto space-y-4">
            <div className="flex text-base text-grey-500">
              {categoryImage && (
                <Image src={categoryImage} alt={langCategory} width={24} height={24} className="mr-2" />
              )}
              {langCategory}
            </div>
            <div className="mt-8 mb-5">{title}</div>
            <div className="border-t border-grey-300 my-10"></div>
            <div className="flex flex-col md:flex-row mt-10 mr-2">
              {previewUrls.length > 0 ? (
                <Image src={previewUrls[0]} alt="썸네일 이미지" width={100} height={100} className="rounded-md" />
              ) : (
                <Image
                  src="https://via.placeholder.com/150?text=No+Image"
                  alt="No Image"
                  width={64}
                  height={64}
                  className="rounded-md"
                />
              )}
              {previewUrls.length > 1 &&
                previewUrls
                  .slice(1)
                  .map((img: string, index: number) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Portfolio image ${index + 1}`}
                      width={100}
                      height={100}
                      className="mt-4 mb-4 rounded-md"
                    />
                  ))}
            </div>
            <div>
              <label className="block text-xl font-bold my-5 text-black">프로젝트 설명</label>
              <div className="text-lg font-semibold text-grey-500">{content}</div>
            </div>
            <div>
              <label className="block text-xl font-bold my-5 text-black">참여기간</label>
              <div className="text-lg font-semibold text-grey-500">
                {startDate} ~ {endDate}
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={editHandle}
                className="bg-white text-primary-500 border text-lg  border-primary-500 px-4 md:px-20 py-2 rounded-md shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                포트폴리오 편집
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
