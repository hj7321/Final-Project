'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { Portfolio } from '@/types/type';
import { useEffect, useState } from 'react';
import EditPortfolio from './EditPortfolio';
import { CodeCategories } from '@/components/dumy';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface DetailModalfolioProps {
  clickModal: () => void;
  portfolioId: string | null;
}

const DetailModal: React.FC<DetailModalfolioProps> = ({ clickModal, portfolioId }) => {
  const params = useParams();
  const userId = params.id as string;

  const getUserData = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('Users').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  };

  const {
    data: Users,
    isLoading: userLoading,
    error: userError
  } = useQuery({
    queryKey: ['Users'],
    queryFn: getUserData
  });

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

  if (isEditing) {
    return <EditPortfolio clickModal={clickModal} portfolioId={portfolioId} />;
  }

  const categoryImage = CodeCategories.find((category) => category.name === langCategory)?.image;
  const userProfileImg = Users?.profile_img ?? '/kakao.svg';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[1200px] h-[80%] relative overflow-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={clickModal}>
          x
        </button>
        <div className="flex">
          <div className="w-[40%] pr-4 ml-7">
            <h1 className="text-xl font-bold mt-20 mb-7">
              <Image src="/kakao.svg" alt="유저 이미지" width={24} height={24} className="rounded-full mr-4" />
              {Users?.nickname}
            </h1>
            <div className="flex flex-col mx-auto space-y-4">
              <div className="text-lg">
                {categoryImage && <img src={categoryImage} alt={langCategory} className="mr-2 w-10 h-6" />}
                {langCategory}
              </div>
              <div className="mt-8 mb-5">{title}</div>
              <div className="border-t border-gray-300 my-10"></div>
              <div>
                <label className="block text-xl font-bold my-5 text-black">프로젝트 설명</label>
                <div className="text-lg font-semibold text-gray-700">{content}</div>
              </div>
              <div>
                <label className="block text-xl font-bold my-5 text-black">참여기간</label>
                <div className="text-lg font-semibold text-gray-700">
                  {startDate} ~ {endDate}
                </div>
              </div>
              <div className="flex justify-start">
                <button
                  onClick={editHandle}
                  className="bg-white text-primary-500 border text-lg font-bold border-primary-500 px-4 py-2 rounded-md shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  포트폴리오 편집
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end w-[60%] mt-10 mr-2">
            {previewUrls.length > 0 ? (
              <img src={previewUrls[0]} alt="썸네일이 등록되어 있지 않습니다." className="rounded-md" />
            ) : (
              <img src="https://via.placeholder.com/150?text=No+Image" alt="No Image" className="rounded-md" />
            )}
            {previewUrls.length > 1 &&
              previewUrls
                .slice(1)
                .map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Portfolio image ${index + 1}`}
                    className="w-96 object-cover mt-4 mb-4 rounded-md"
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
