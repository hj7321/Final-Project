'use client';

import { Portfolio } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Notify } from 'notiflix';
import Image from 'next/image';
import useProfile from '@/hooks/useProfile';

interface MobileEditPortfolioProps {
  portfolioId: string | null;
  onBack: () => void;
}

export default function MobileEditPorifolio({ portfolioId, onBack }: MobileEditPortfolioProps) {
  const params = useParams();
  const userId = params.id as string;

  // 리팩토링 전
  // const getUserData = async () => {
  //   const supabase = createClient();

  //   const { data, error } = await supabase.from('Users').select('*').eq('id', userId).single();
  //   if (error) throw error;
  //   return data;
  // };
  // const {
  //   data: Users,
  //   isLoading,
  //   error
  // } = useQuery({
  //   queryKey: ['Users'],
  //   queryFn: getUserData,
  //   enabled: !!userId
  // });

  // 리팩토링 후
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
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (data && portfolioId) {
      const portfolio = data.find((p) => p.id === portfolioId);
      if (portfolio) {
        setTitle(portfolio.title || '');
        setContent(portfolio.content || '');
        setStartDate(portfolio.start_date || '');
        setEndDate(portfolio.end_date || '');
        setImageUrls(portfolio.portfolio_img || []);
        setPreviewUrls(portfolio.portfolio_img || []);
      }
    }
  }, [data, portfolioId]);

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const supabase = createClient();

    const { data, error } = await supabase.storage.from('portfolio_bucket_image/portfolio').upload(fileName, file);
    if (error) throw error;
    const { publicUrl } = supabase.storage.from('portfolio_bucket_image/portfolio').getPublicUrl(fileName).data;
    return publicUrl;
  };

  const handleSave = async () => {
    try {
      const uploadPromises = images.map((file) => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      const allImageUrls = [...imageUrls, ...uploadedUrls];

      const response = await fetch('/api/portFolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: portfolioId,
          title,
          content,
          start_date: startDate,
          end_date: endDate,
          portfolio_img: allImageUrls
        })
      });

      if (response.ok) {
        Notify.success('포트폴리오 등록이 완료되었습니다.');

        window.location.reload();
      } else {
        console.error('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...filesArray]);

      const previewUrlsArray = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...previewUrlsArray]);
    }
  };

  const handleImageDelete = (url: string) => {
    setImageUrls((prevUrls) => prevUrls.filter((imgUrl) => imgUrl !== url));
    setPreviewUrls((prevUrls) => prevUrls.filter((prevUrl) => prevUrl !== url));
  };

  return (
    <div>
      <div>
        <div className="flex">
          <div className=" pr-4">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">프로젝트 이름</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="">
                <div className="mt-1 p-2 border items-start w-full border-gray-300 rounded-md shadow-sm">
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    multiple
                    onChange={handleImageChange}
                  />
                  <div className="mt-4 flex flex-wrap space-y-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`Uploaded ${index}`}
                          width={160}
                          height={160}
                          className="w-full h-40 object-cover mt-1 mb-4 rounded-md"
                        />
                        <button
                          onClick={() => handleImageDelete(url)}
                          className="absolute top-0 right-0  text-white rounded-full p-1"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                썸네일
                {previewUrls.length > 0 ? (
                  <Image
                    src={previewUrls[0]}
                    alt="Portfolio Image"
                    width={400}
                    height={400}
                    className="w-96 object-cover mt-1 mb-4 rounded-md"
                  />
                ) : (
                  <Image
                    src="https://via.placeholder.com/150?text=No+Image"
                    alt="No Image"
                    width={296.8}
                    height={160}
                    className="w-full h-40 object-cover mt-1 mb-4 rounded-md"
                  />
                )}
                {previewUrls.length > 1 &&
                  previewUrls
                    .slice(1)
                    .map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`Portfolio image ${index}`}
                        width={400}
                        height={400}
                        className="w-40 object-cover mt-1 mb-4 rounded-md"
                      />
                    ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">프로젝트 설명</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ height: '200px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">참여 기간</label>
                <input
                  type="date"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                ~
                <input
                  type="date"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="mt-4  bg-primary-500 font-normal text-white px-4 mr-3 rounded-md shadow-sm hover:bg-primary-700  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  저장
                </button>
                <button
                  onClick={onBack}
                  className="mt-4 border border-primary-500 hover:bg-primary-100 text-primary-500 rounded p-2"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
