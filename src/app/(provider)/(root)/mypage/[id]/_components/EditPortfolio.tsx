'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { Portfolio } from '@/types/type';
import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Notify } from 'notiflix';
import Image from 'next/image';
import useProfile from '@/hooks/useProfile';
import MDEditor from '@uiw/react-md-editor';
import '@/css/mdStyle.css';
interface EditPortfolioProps {
  clickModal: () => void;
  portfolioId: string | null;
}

const EditPortfolio: React.FC<EditPortfolioProps> = ({ clickModal, portfolioId }) => {
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
  const [content, setContent] = useState<string | undefined>('');
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

        clickModal();
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[1200px] h-[80%] relative overflow-auto">
        <button className="absolute top-2 right-2 text-grey-500 hover:text-grey-700" onClick={clickModal}>
          x
        </button>
        <div className="flex">
          <div className="w-[40%] pr-4">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-grey-700">프로젝트 이름</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-grey-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-700">프로젝트 설명</label>
                <div data-color-mode="light">
                  <MDEditor value={content} onChange={setContent} height={200} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-700">참여 기간</label>
                <input
                  type="date"
                  className="mt-1 block w-full p-2 border border-grey-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                ~
                <input
                  type="date"
                  className="mt-1 block w-full p-2 border border-grey-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-grey-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end w-[60%] mt-10 mr-2">
            <div className="mt-1 p-2 border items-start w-full border-grey-300 rounded-md shadow-sm">
              <input
                type="file"
                className="block w-full text-sm text-grey-900 border border-grey-300 rounded-lg cursor-pointer bg-grey-50 focus:outline-none"
                multiple
                onChange={handleImageChange}
              />
              <div className="mt-4 flex flex-wrap space-y-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`Uploaded ${index}`}
                      width={300}
                      height={300}
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
                width={300}
                height={300}
                className="w-96 object-cover mt-1 mb-4 rounded-md"
              />
            ) : (
              <Image
                src="https://via.placeholder.com/150?text=No+Image"
                alt="No Image"
                width={342.112}
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
                    width={300}
                    height={300}
                    className="w-40  object-cover mt-1 mb-4 rounded-md"
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolio;
