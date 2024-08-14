'use client';

import { RequestReviews } from '@/types/type';
import StarRating from './StarRating';
import { useState } from 'react';
import Image from 'next/image';

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

type EditReviewProps = {
  review: ReviewsData;
  onClose: () => void;
  portfolio: PortfolioData;
  userId: string;
};

const EditReview: React.FC<EditReviewProps> = ({ review, onClose, portfolio, userId }) => {
  const [rating, setRating] = useState(review.stars);
  const [content, setContent] = useState(review.contents);
  const imageUrl = Array.isArray(portfolio.post_img) ? portfolio.post_img[0] : '';

  const handleSave = () => {
    const updatedReview = {
      ...review,
      stars: rating,
      contents: content
    };
  };

  return (
    <div className="bg-white flex flex-col p-6 w-[40%] h-[350px] relative overflow-auto rounded-xl">
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

      <div className="flex flex-col mt-5">
        <StarRating totalStars={5} size={40} selectedStars={rating} onRatingChange={setRating} />
        <div className="mt-3 text-gray-400 text-sm">({rating})</div>
      </div>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰를 수정하세요."
          className="border border-grey-300 rounded-lg font-medium text-base mt-10 h-[100px] w-full p-2"
          rows={4}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary-500 text-white text-base font-normal mt-2 px-4 py-2 rounded-md shadow-sm mr-0 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default EditReview;
