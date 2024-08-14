'use client';

import Image from 'next/image';
import { postDumy } from './DumyData';
import { useParams } from 'next/navigation';
import { Accounts, Portfolio } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import DetailReview from './DetailReview';
import { CodeCategories } from '@/components/dumy';

interface Account {
  id: string;
  post_img: string[];
  content: string;
  price: number;
  title: string;
  user_id: string;
  created_at: string;
  lang_category: string[];
  portfolio_img: string;
  start_date: string;
  end_date: string;
}

interface Review {
  request_post_id: string;
  user_id: string;
  stars: number;
  contents: string;
}
export default function AccountList() {
  const { id } = useParams();
  const [isDetailReviewOpen, setIsDetailReviewOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Account | null>(null);

  const getAccount = async () => {
    const response = await fetch('/api/account');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Account[] = await response.json();
    return data;
  };

  const getUserReviews = async () => {
    const response = await fetch(`/api/review?user_id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const reviews = await response.json();
    return reviews;
  };

  const {
    data: accountData,
    isLoading: isAccountLoading,
    error: accountError
  } = useQuery<Account[]>({
    queryKey: ['accountData', id],
    queryFn: getAccount,
    enabled: !!id
  });

  const {
    data: userReviews,
    isLoading: isReviewLoading,
    error: reviewError
  } = useQuery<Review[]>({
    queryKey: ['userReviews', id],
    queryFn: getUserReviews,
    enabled: !!id
  });

  const handleReview = (portfolio: Account) => {
    setSelectedPortfolio(portfolio);
    setIsDetailReviewOpen(true);
  };

  const handleCloseReview = () => {
    setIsDetailReviewOpen(false);
    setSelectedPortfolio(null);
  };

  if (isAccountLoading || isReviewLoading) return <div>Loading...</div>;
  if (accountError || reviewError) return <div>Error occurred!</div>;

  return (
    <div className="w-full">
      <section className="container w-full mx-auto px-4 py-8 min-h-screen">
        <div className="mb-10">
          <h2 className="hidden md:flex text-2xl font-bold">거래내역</h2>
        </div>
        {accountData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
            <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24 mx-auto mb-4" />
            <div className="text-lg font-semibold mb-2">아직 거래내역이 없어요</div>
            <div className="text-sm text-gray-600 mb-4">전문가 의뢰를 통해 원하는 결과물을 받아보세요 </div>
          </div>
        ) : (
          <>
            {accountData?.map((post) => {
              const userReview = userReviews?.find(
                (review) => review.request_post_id === post.id && review.user_id === id
              );

              return (
                <div key={post.id} className="border rounded-lg mb-[32px] flex h-[226px]">
                  <div className="flex flex-col ml-[32px] justify-between w-[892px]">
                    <div className="flex mt-[20px]">
                      <p className="mt-[20px] text-grey-600 text-base">거래일자: {post.created_at.slice(0, 10)}</p>
                      <div className="flex items-center ml-auto">
                        <Image
                          src={
                            CodeCategories.find((category) => category.name === post.lang_category[0])?.image ||
                            '/defaultProfileimg.svg'
                          }
                          alt="d"
                          width={12}
                          height={12}
                          className="w-5 h-5 "
                        />
                        <p className="text-base ml-2">{post.lang_category.join(', ')}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h3 className="text-xl  text-grey-900 font-bold">{post.title}</h3>
                    </div>
                    <div className="flex justify-between">
                      <p className="mb-[50px]">{post.price}원</p>
                      <div>
                        {userReview ? (
                          <button
                            onClick={() => handleReview(post)}
                            className="mr-7 border rounded-lg bg-grey-200 px-5 py-2 font-normal mb-3 text-white text-lg"
                          >
                            내가 쓴 리뷰 보기
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReview(post)}
                            className="mr-7 border rounded-lg border-primary-500 px-5 py-2 font-semibold mb-3 text-primary-500 text-lg"
                          >
                            리뷰 쓰기
                          </button>
                        )}
                        <button className="font-normal mb-3 text-lg">채팅 내역</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>
      {isDetailReviewOpen && selectedPortfolio && (
        <DetailReview onClose={handleCloseReview} portfolio={selectedPortfolio} />
      )}
    </div>
  );
}
