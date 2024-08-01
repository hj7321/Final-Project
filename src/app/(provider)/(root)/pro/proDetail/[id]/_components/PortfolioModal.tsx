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
      <div className="bg-white p-8 rounded-xl w-[1200px] h-[780px]">
        <div onClick={() => onClose()} className='cursor-pointer float-right'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L20 20M20 4L4 20" stroke="#0E0F11" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;
