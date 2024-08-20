'use client';

import Image from 'next/image';
import { postDumy } from './DumyData';
import { useParams } from 'next/navigation';
import { Accounts, Portfolio } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import DetailReview from './DetailReview';

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

export default function AccountList() {
  const { id } = useParams();
  const [isDetailReviewOpen, setIsDetailReviewOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Account | null>(null); // 추가: 선택된 포트폴리오 상태 관리

  const getAccount = async () => {
    const response = await fetch('/api/account');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Account[] = await response.json();
    return data;
  };

  const { data, isLoading, error } = useQuery<Account[]>({
    queryKey: ['accountData', id],
    queryFn: getAccount,
    enabled: !!id
  });

  const handleReview = (portfolio: Account) => {
    setSelectedPortfolio(portfolio); // 선택된 포트폴리오 설정
    setIsDetailReviewOpen(true); // DetailAccount 모달 열기
  };

  const handleCloseReview = () => {
    setIsDetailReviewOpen(false); // DetailAccount 모달 닫기
    setSelectedPortfolio(null); // 선택된 포트폴리오 초기화
  };

  return (
    <div className="w-full ">
      <section className="container w-full mx-auto px-4 py-8 min-h-screen">
        <div className="mb-10">
          <h2 className="hidden md:flex font-bold text-[24px]">거래내역</h2>
        </div>
        {data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full bg-white border border-grey-300 rounded-md p-6 text-center h-96">
            <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24 mx-auto mb-4" />
            <div className="text-lg font-semibold mb-2">아직 거래내역이 없어요</div>
            <div className="text-sm text-grey-600 mb-4">전문가 의뢰를 통해 원하는 결과물을 받아보세요 </div>
          </div>
        ) : (
          <>
            {data?.map((post) => {
              const imageUrl = Array.isArray(post.post_img) ? post.post_img[0] : '';

              return (
                <div key={post.id} className="border rounded-lg mb-[32px] flex h-[226px]">
                  <Image
                    src={imageUrl}
                    alt="포트폴리오 이미지"
                    width={180}
                    height={180}
                    className=" h-[180px] mr-[20px] mt-[23px] "
                  />
                  <div className="flex flex-col justify-between w-[892px]">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl mt-[20px] text-grey-900 font-bold">{post.title}</h3>
                      <p className="text-base mt-[20px] ml-auto">{post.lang_category.join(', ')}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="mb-[16px]">{post.price}원</p>
                      <div>
                        <button
                          onClick={() => handleReview(post)}
                          className="mr-7 border rounded-lg border-primary-500 px-5 py-2 font-semibold mb-3 text-primary-500 text-lg"
                        >
                          리뷰 쓰기
                        </button>
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
      )}{' '}
    </div>
  );
}
