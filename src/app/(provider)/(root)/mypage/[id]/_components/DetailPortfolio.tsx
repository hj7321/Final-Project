'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { Portfolio } from '@/types/type';
import { useEffect, useState } from 'react';
import EditPortfolio from './EditPortfolio';
import { CodeCategories } from '@/components/dumy';
import { createClient } from '@/utils/supabase/client';

interface DetailModalfolioProps {
  clickModal: () => void;
  portfolioId: string | null;
}

const DetailModal: React.FC<DetailModalfolioProps> = ({ clickModal, portfolioId }) => {
  const params = useParams();
  const userId = params.id as string;
  const { id } = useParams();

  // const getUserData = async (id: string) => {
  //   const response = await fetch(`/api/user/${id}`);
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   return response.json();
  // };

  // const {
  //   data: userData,
  //   isLoading: userLoading,
  //   error: userError
  // } = useQuery(['user', userId], () => getUserData(userId));

  const getUserData = async () => {
    const supabase = createClient();
    const data = await supabase.from('Users').select('*').eq('id', id).maybeSingle();
    return data;
  };
  const {
    data: Users,
    isLoading,
    error
  } = useQuery({
    queryKey: ['Users'],
    queryFn: getUserData
  });

  const getPortfolio = async () => {
    if (!portfolioId) {
      throw new Error('포트폴리오 ID가 지정되지 않았습니다.');
    }

    const response = await fetch(`/api/portFolio/${portfolioId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const {
    data: portfolioData,
    isLoading: portfolioLoading,
    error: portfolioError
  } = useQuery<Portfolio>({
    queryKey: ['portfolio', portfolioId],
    queryFn: getPortfolio,
    enabled: !!portfolioId
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
  const [langCategoty, setLangCategoty] = useState<string>('');

  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (data && portfolioId) {
      const portfolio = data.find((p) => p.id === portfolioId);
      if (portfolio) {
        setTitle(portfolio.title || '');
        setContent(portfolio.content || '');
        setStartDate(portfolio.start_date || '');
        setEndDate(portfolio.end_date || '');
        setLangCategoty(portfolio.lang_category || '');
      }
    }
  }, [data, portfolioId]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const editHandle = async () => {
    setIsEditing(true);
  };

  // if (userLoading || portfolioLoading) {
  //   return <div className="h-screen flex items-center justify-center">Loading...</div>;
  // }

  if (isEditing) {
    return <EditPortfolio clickModal={clickModal} portfolioId={portfolioId} />;
  }

  // if (userError || portfolioError) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       Error: {userError?.message || portfolioError?.message}
  //     </div>
  //   );
  // }

  const categoryImage = CodeCategories.find((category) => category.name === langCategoty)?.image;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[1200px] h-[80%] relative overflow-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={clickModal}>
          x
        </button>

        <div className="flex">
          <div className="w-[40%] pr-4 ml-7">
            <h1 className="text-xl font-bold mt-20 mb-7">{Users?.data?.nickname}</h1>
            {portfolioData && (
              <div className="flex flex-col mx-auto space-y-4">
                <div className="text-lg">
                  {categoryImage && <img src={categoryImage} alt={langCategoty} className="mr-2 w-10 h-6" />}
                  {langCategoty}
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
            )}
          </div>
          <div className="flex flex-col items-end w-[60%] mt-10 mr-2">
            {portfolioData && (
              <img
                src={
                  portfolioData.portfolio_img && portfolioData.portfolio_img.length > 0
                    ? portfolioData.portfolio_img[0]
                    : ''
                }
                alt="썸네일이 등록되어 있지 않습니다."
                className="rounded-md"
              />
            )}

            {portfolioData && portfolioData.portfolio_img && portfolioData.portfolio_img.length > 1 ? (
              portfolioData.portfolio_img
                .slice(1)
                .map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Portfolio image ${index + 1}`}
                    className="w-96 object-cover mt-4 mb-4 rounded-md"
                  />
                ))
            ) : (
              <img src="" alt="이미지가 등록되어 있지 않습니다" className="mt-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
