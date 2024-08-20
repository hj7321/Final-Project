'use client';

import { RequestReviews } from '@/types/type';
import StarRating from './StarRating';
import Image from 'next/image';
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

type ReviewsData = Omit<RequestReviews, 'id' | 'created_at'>;

type AddReviewProps = {
  onClose: () => void;
  portfolio: PortfolioData;
  userId: string;
  addMutation: (reviewData: ReviewsData) => void;
};

const AddReview: React.FC<AddReviewProps> = ({ onClose, portfolio, userId, addMutation }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const imageUrl = Array.isArray(portfolio.post_img) ? portfolio.post_img[0] : '';

  const handleSubmit = async () => {
    if (!userId || !portfolio.id) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }
    if (!content || rating === 0) {
      alert('내용과 평점을 입력해주세요.');
      return;
    }

    try {
      const reviewData: ReviewsData = {
        user_id: userId,
        request_post_id: portfolio.id,
        stars: rating,
        contents: content
      };

      addMutation(reviewData);
    } catch (error) {
      console.error('리뷰 등록 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className="bg-white flex flex-col p-6 w-[90%] md:w-[40%] h-[430px] relative overflow-auto rounded-xl">
      <div className="flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-4 text-grey-600 flex font-thin justify-end">
          x
        </button>
        <div className="flex flex-row mt-[24px]">
          {imageUrl && <Image src={imageUrl} alt="ds" width={100} height={100} className="w-[100px] h-[100px]" />}
          <div className="flex flex-col ml-[40px]">
            <h1 className="flex text-sm  text-grey-600  font-bold ">{portfolio.lang_category}</h1>
            <h1 className="flex text-base  text-grey-800 font-bold ">{portfolio.title}</h1>
          </div>
        </div>
      </div>

      <div className="flex mt-5">
        <StarRating totalStars={5} size={40} onRatingChange={(newRating) => setRating(newRating)} />
        <div className="mt-3 text-grey-400 text-sm">({rating})</div>
      </div>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="솔직한 리뷰는 이용자와 모두에게 도움이 됩니다."
          className="border border-grey-300 rounded-lg font-medium text-base mt-10 h-[100px] w-full p-2"
          rows={4}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-primary-500 text-white text-base font-normal mt-2 px-4 py-2 rounded-md shadow-sm mr-0 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          작성완료
        </button>
      </div>
    </div>
  );
};

export default AddReview;
