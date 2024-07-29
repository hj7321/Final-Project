'use client';
import { useParams } from 'next/navigation';
import { useUserData } from '@/app/api/mypage/[id]/route';
import { useQuery } from '@tanstack/react-query';
import type { Portfolio } from '@/types/type';
import { useState, useEffect } from 'react';

interface EditPortfolioProps {
  clickModal: () => void;
  portfolioId: string | null;
}

const EditPortfolio: React.FC<EditPortfolioProps> = ({ clickModal, portfolioId }) => {
  const params = useParams();
  const userId = params.id as string;

  const { data: userData, isLoading: userLoading, error: userError } = useUserData(userId);

  const getPortfolio = async () => {
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

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (portfolioData) {
      setTitle(portfolioData.title || '');
      setContent(portfolioData.content || '');
    }
  }, [portfolioData]);

  const handleSave = async () => {
    const response = await fetch('/api/portFolio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: portfolioId,
        title,
        content
      })
    });

    if (response.ok) {
      clickModal();
    } else {
      console.error('수정에 실패했습니다.');
    }
  };

  if (userLoading || portfolioLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (userError || portfolioError) {
    return (
      <div className="h-screen flex items-center justify-center">
        Error: {userError?.message || portfolioError?.message}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[800px] h-[80%] relative overflow-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={clickModal}>
          x
        </button>
        <div className="flex">
          <div className="w-[30%] pr-4">
            <h1 className="text-2xl font-bold mb-4">{userData?.data?.nickname}</h1>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">프로젝트 이름</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">프로젝트 설명</label>
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                ></input>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
          <div className="w-[70%]">
            <label className="block text-sm font-medium text-gray-700">사진</label>
            <div className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm">
              <input
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              <div className="mt-4 flex flex-wrap space-y-4"></div>
            </div>
            썸네일
            {portfolioData && (
              <img
                src={
                  portfolioData.portfolio_img && portfolioData.portfolio_img.length > 0
                    ? portfolioData.portfolio_img[0]
                    : 'https://via.placeholder.com/150?text=No+Image'
                }
                alt="Portfolio Image"
              />
            )}
            {portfolioData && portfolioData.portfolio_img && portfolioData.portfolio_img.length > 0 ? (
              portfolioData.portfolio_img.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Portfolio image ${index}`}
                  className="w-full h-40 object-cover mt-1 mb-4 rounded-md"
                />
              ))
            ) : (
              <img
                src="https://via.placeholder.com/150?text=No+Image"
                alt="No Image"
                className="w-full h-40 object-cover mt-1 mb-4 rounded-md"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolio;
