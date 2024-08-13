'use client';

import { RequestReviews } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import StarRating from './StarRating';
import { useState } from 'react';

interface PortfolioData {
  id: string;
  user_id: string;
  title: string;
  content: string;
  portfolio_img: string;
  lang_category: string[];
  start_date: string;
  end_date: string;
  post_img: string[];
}

type ReviewModalProps = {
  onClose: () => void;
  portfolio: PortfolioData;
};

const DetailReview: React.FC<ReviewModalProps> = ({ onClose, portfolio }) => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);

  const imageUrl = Array.isArray(portfolio.post_img) ? portfolio.post_img[0] : '';

  const getReview = async () => {
    const response = await fetch('/api/review');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: RequestReviews[] = await response.json();
    return data.filter((post) => post.user_id === id);
  };

  const { data, isLoading, error } = useQuery<RequestReviews[]>({
    queryKey: ['post', id],
    queryFn: getReview,
    enabled: !!id
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white flex flex-col    p-6 w-[40%] h-[50%] relative overflow-auto">
        <button onClick={onClose} className="text-grey-600 flex justify-end mr-0">
          x
        </button>
        <div className="flex flex-col">
          <div className="flex flex-row mt-[24px]">
            {imageUrl && <Image src={imageUrl} alt="ds" width={100} height={100} className="w-[100px] h-[100px]" />}
            <div className="flex flex-col ml-[40px]">
              <h1 className="flex text-base  text-grey-600  font-bold ">{portfolio.lang_category}</h1>
              <h1 className="flex text-base  text-grey-800 font-bold ">{portfolio.title}</h1>
            </div>
          </div>
        </div>
        {data?.length === 0 ? (
          <>
            <div className="flex mt-5">
              <StarRating totalStars={5} size={40} onRatingChange={(newRating) => setRating(newRating)} />
              <div className="mt-3 text-gray-400 text-sm">({rating})</div>
            </div>
            <div>
              <textarea
                placeholder="솔직한 리뷰는 이용자와 모두에게 도움이 됩니다."
                className="border border-grey-300 rounded-lg font-medium text-base mt-10 h-[100px] w-full p-2"
                rows={4}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1>ds</h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailReview;
