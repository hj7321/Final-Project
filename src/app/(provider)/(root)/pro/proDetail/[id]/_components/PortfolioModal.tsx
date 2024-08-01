import React from 'react';

interface PortfolioModalProps {
  portfolio: {
    id: string;
    user_id: string;
    title: string;
    description: string;
    portfolio_img: string;
    lang_category: string[] | string; // 기술 스택
    start_date: string;
    end_date: string;
  };
  user: {
    nickname: string;
    profile_img: string;
  };
  onClose: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ portfolio, user, onClose }) => {
  // lang_category가 배열인지 확인 후 처리
  const langCategory = Array.isArray(portfolio.lang_category)
    ? portfolio.lang_category.join(' / ')
    : portfolio.lang_category; // 배열이 아니면 그대로 사용

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl w-[1200px] h-[780px] flex">
        <span onClick={() => onClose()}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="0.5"
              y="0.5"
              width="63"
              height="63"
              rx="31.5"
              className="stroke-gray-300 group-hover:stroke-gray-400"
            />
            <path
              d="M24 24L40 40M40 24L24 40"
              className="stroke-gray-300 group-hover:stroke-gray-400"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default PortfolioModal;
