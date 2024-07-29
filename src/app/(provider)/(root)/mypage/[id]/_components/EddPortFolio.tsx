'use client';

import { Portfolio } from '@/types/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

interface EddPortfolioProps {
  clickModal: () => void;
}

type PortfolioData = Omit<Portfolio, 'id' | 'created_at'>;

const EddPortfolio: React.FC<EddPortfolioProps> = ({ clickModal }) => {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const savePorifolio = async (data: PortfolioData) => {
    const response = await fetch('/api/portFolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { mutate: addMutation } = useMutation<Portfolio, unknown, PortfolioData>({
    mutationFn: (data: PortfolioData) => savePorifolio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
      if (contentRef.current) {
        contentRef.current.value = '';
      }
      alert('포트폴리오 등록이 완료되었습니다.');

      clickModal();
    }
  });

  const handleSubmit = () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    if (selectedLanguage === '') {
      alert('언어를 선택해주세요.');
      return;
    }

    const portfolioData: PortfolioData = {
      title,
      content,
      portfolio_img: [],
      user_id: id,
      lang_category: selectedLanguage
    };
    addMutation(portfolioData);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[800px] h-[80%] relative overflow-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={clickModal}>
          x
        </button>
        <h1 className="text-2xl font-bold mb-4">포트폴리오 등록하기</h1>
        <div className="space-y-4">
          <div className="relative border border-gray-500 rounded-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none">
              제목
            </span>{' '}
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              className="w-full pl-24 pr-4 py-2 rounded-md font-normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">썸네일 이미지를 등록해주세요.</label>
              <div className="mt-1 flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-md">
                <span className="text-gray-500">이미지 업로드</span>
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                추가 이미지를 등록해주세요. (선택, 최대 5개)
              </label>
              <div className="mt-1 flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-md">
                <span className="text-gray-500">이미지 업로드</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">언어 선택 (중복 가능)</label>
            <div className="flex flex-wrap gap-2">
              {[
                'HTML/CSS',
                'JavaScript',
                'Java',
                'Python',
                'C/C++/C#',
                'TypeScript',
                'React',
                'Android/iOS',
                'Next.js',
                'Git/GitHub'
              ].map((language) => (
                <div key={language} className="flex items-center">
                  <input
                    type="radio"
                    id={language}
                    name="language"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={selectedLanguage === language}
                    onChange={() => handleLanguageChange(language)}
                  />
                  <label htmlFor={language} className="ml-2 block text-sm text-gray-900">
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="relative  w-1/2">
              <label className="block text-sm font-medium text-gray-700">참여 기간</label>
              <input
                type="text"
                placeholder="0000.00.00"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className=" relative w-1/2">
              <label className="block text-sm font-medium text-gray-700">진행중</label>
              <div className="mt-1 flex items-center h-10 shadow-sm">
                <input type="checkbox" className="h-5 w-5 text-indigo-600 border-gray-300 rounded" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">내용</label>
            <textarea
              placeholder="내용을 입력해주세요."
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-2 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EddPortfolio;