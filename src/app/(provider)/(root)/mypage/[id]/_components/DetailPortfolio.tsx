'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { type Portfolio } from '@/types/type';
import { useEffect, useState } from 'react';
import EditPortfolio from './EditPortfolio';
import { CodeCategories } from '@/components/dumy';
import Image from 'next/image';
import useProfile from '@/hooks/useProfile';
import MDEditor from '@uiw/react-md-editor';

interface DetailModalfolioProps {
  clickModal: () => void;
  portfolioId: string | null;
}

const DetailModal: React.FC<DetailModalfolioProps> = ({ clickModal, portfolioId }) => {
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

  if (isEditing) {
    return <EditPortfolio clickModal={clickModal} portfolioId={portfolioId} />;
  }

  const categoryImage = CodeCategories.find((category) => category.name === langCategory)?.image;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[1200px] h-[80%] relative overflow-auto">
        <button className="absolute top-2 right-2 text-grey-500 hover:text-grey-700" onClick={clickModal}>
          x
        </button>
        <div className="flex">
          <div className="w-[40%] pr-4 ml-7">
            <div className="flex items-center mt-20 mb-7">
              <Image
                src={userData?.profile_img || '/defaultProfileimg.svg'}
                alt="유저 이미지"
                width={36}
                height={36}
                className="rounded-[50%] mr-4 overflow-hidden w-20 h-20 "
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
              <div data-color-mode="light">
                <label className="block text-xl font-bold my-5 text-black">프로젝트 설명</label>
                <MDEditor.Markdown source={content} className="font-semibold text-grey-500 line-clamp-5" />
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
          <div className="flex flex-col items-end w-[60%] mt-10 mr-2">
            {previewUrls.length > 0 ? (
              <Image src={previewUrls[0]} alt="썸네일" width={600} height={600} className="rounded-md w-full" />
            ) : (
              <Image
                src="https://via.placeholder.com/150?text=No+Image"
                alt="No Image"
                width={150}
                height={150}
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
                    width={600}
                    height={600}
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
