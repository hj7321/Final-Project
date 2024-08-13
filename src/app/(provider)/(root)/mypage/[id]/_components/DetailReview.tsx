'use client';

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

type ReviewModalProps = {
  onClose: () => void;
  portfolio: PortfolioData;
};

const DetailReview: React.FC<ReviewModalProps> = ({ onClose, portfolio }) => {
  const imageUrl = Array.isArray(portfolio.post_img) ? portfolio.post_img[0] : '';
  console.log('imageUrl', imageUrl);
  console.log(portfolio);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white flex flex-col    p-6 w-[40%] h-[50%] relative overflow-auto">
        <button onClick={onClose} className="text-grey-600 flex justify-end mr-0">
          x
        </button>
        <div className="flex flex-col">
          <div className="flex flex-row mt-[24px]">
            {imageUrl && <Image src={imageUrl} alt="ds" width={100} height={100} />}
            <div className="flex flex-col ml-[40px]">
              <h1 className="flex text-base  text-grey-600  font-bold ">{portfolio.lang_category}</h1>
              <h1 className="flex text-base  text-grey-800 font-bold ">{portfolio.title}</h1>
            </div>
          </div>
        </div>
        <h1 className="flex text-base  text-grey-600 mt-2 mb-[32px]">
          전문가 채팅에서 의뢰 내용과 채팅 시간을 상담해보세요! {portfolio.title}
        </h1>
      </div>
    </div>
  );
};

export default DetailReview;
