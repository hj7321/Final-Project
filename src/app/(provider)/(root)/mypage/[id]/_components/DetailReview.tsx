'use client';

import { RequestReviews } from '@/types/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import StarRating from './StarRating';
import { useState } from 'react';
import { Confirm, Notify } from 'notiflix';
import AddReview from './AddReview';
import { CodeCategories } from '@/components/dumy';

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

interface ReData {
  id: string;
  created_at: string;
  user_id: string;
  contents: string;
  stars: number;
  request_post_id: string;
}

type ReviewsData = Omit<RequestReviews, 'id' | 'created_at'>;

type ReviewModalProps = {
  onClose: () => void;
  portfolio: PortfolioData;
};

const DetailReview: React.FC<ReviewModalProps> = ({ onClose, portfolio }) => {
  const { id } = useParams();
  const portfolioId = Array.isArray(portfolio.id) ? portfolio.id[0] : portfolio.id;
  const userId = Array.isArray(id) ? id[0] : id;
  const params = useParams();
  const paramsId = params.id as string;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const imageUrl = Array.isArray(portfolio.post_img) ? portfolio.post_img[0] : '';

  const getReview = async () => {
    const response = await fetch('/api/review');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: RequestReviews[] = await response.json();
    return data.filter((post) => post.user_id === id && post.request_post_id === portfolio.id);
  };

  const { data, isLoading, error } = useQuery<RequestReviews[]>({
    queryKey: ['post', id],
    queryFn: getReview,
    enabled: !!id
  });

  const saveReview = async (data: ReviewsData) => {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const deleteReview = async (id: string) => {
    const response = await fetch('/api/review', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const { mutate: deleteMutation } = useMutation<ReData, Error, string>({
    mutationFn: (id) => deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['porifolio', paramsId] })
  });

  const handleDelete = (id: string) => {
    Confirm.show(
      '리뷰 삭제',
      '정말로 삭제하시겠습니까?',
      '예',
      '아니오',
      () => {
        Notify.failure('삭제되었습니다.');
        try {
          deleteMutation(id);
        } catch (error) {
          console.error('삭제에 실패했습니다.', error);
        }
      },
      () => {
        Notify.failure('삭제가 되지 않았습니다.');
      },
      {}
    );
  };

  const { mutate: addMutation } = useMutation<ReviewsData, unknown, ReviewsData>({
    mutationFn: (reviewData: ReviewsData) => saveReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      setContent(''); // textarea 값 초기화
      Notify.success('리뷰가 성공적으로 등록되었습니다.');
      onClose();
    }
  });

  const handleSubmit = async () => {
    if (!userId || !portfolio.id) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }
    if (!content || rating === 0) {
      Notify.failure('내용과 평점을 입력해주세요.');
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {data?.length === 0 ? (
        <AddReview onClose={onClose} portfolio={portfolio} userId={userId} addMutation={addMutation} />
      ) : (
        <div className="bg-white flex flex-col p-6 w-90% md:w-[40%] h-[350px] relative overflow-auto rounded-xl">
          <div className="flex flex-col">
            <button onClick={onClose} className="absolute top-2 right-4 text-grey-600 flex font-thin justify-end ">
              x
            </button>
            <div className="flex flex-row mt-[24px] ">
              {imageUrl && <Image src={imageUrl} alt="ds" width={100} height={100} className="w-[100px] h-[100px]" />}
              <div className="flex flex-col ml-[40px]">
                <div className="flex items-center ml-0">
                  <Image
                    src={
                      CodeCategories.find((category) => category.name === portfolio.lang_category[0])?.image ||
                      '/defaultProfileimg.svg'
                    }
                    alt="d"
                    width={12}
                    height={12}
                    className="w-5 h-5 "
                  />
                  <p className="flex text-sm ml-1 text-grey-600  font-bold ">{portfolio.lang_category.join(', ')}</p>
                </div>

                <h1 className="flex text-base  text-grey-800 font-bold ">{portfolio.title}</h1>
              </div>
            </div>
          </div>

          <div>
            {data?.map((review) => (
              <div key={review.id} className="mt-5">
                <div className="flex items-center">
                  <StarRating totalStars={5} size={30} selectedStars={review.stars} readOnly />
                  <div className="mt-3 text-gray-400 text-sm">({review.stars})</div>
                </div>
                <p className="ml-1 font-semibold mt-3 text-lg text-grey-800">{review.contents}</p>
                <p className="mt-3 text-sm text-gray-400">작성일: {review.created_at.slice(0, 10)}</p>
                <div className="flex justify-end">
                  <button className="bg-primary-500 text-white text-base font-normal mt-2 px-4 py-2 rounded-md shadow-sm mr-0 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    리뷰 수정
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-grey-200 ml-3 text-white text-base font-normal mt-2 px-4 py-2 rounded-md shadow-sm mr-0 hover:bg-grey-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grey-600"
                  >
                    리뷰 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailReview;
