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
      <div className="bg-white p-8 rounded-xl w-[1200px] h-[780px] relative">
        <div onClick={() => onClose()} className='cursor-pointer absolute top-4 right-4'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L20 20M20 4L4 20" stroke="#0E0F11" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div className='mt-[40px] mx-auto p-4 flex flex-row justify-between'>
          <div>
            <div className='flex flex-row items-center'>
              <img src={user.profile_img} alt="프로필이미지" className='w-[64px] h-[64px] bg-gray-700 rounded-full mr-4' />
              <p className='font-semibold text-xl'>{user.nickname}</p>
            </div>
            <div className='mt-[40px]'>
              <p className='font-thin text-lg'>{portfolio.lang_category}</p>
            </div>
            <div className='mt-[20px]'>
              <h1 className='text-2xl'>{portfolio.title}</h1>
              <div className='w-[390px] h-[1.5px] bg-gray-300 mt-[30px]'></div>
            </div>
            <div className='mt-[30px]'>
              <h2 className='text-xl'>프로젝트 설명</h2>
              <p className='mt-[20px] px-2 font-thin line-clamp-4 w-[400px]'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit, sed omnis. Voluptate, unde magni accusamus beatae corrupti, temporibus necessitatibus omnis non, ab deleniti accusantium obcaecati ut repellat consectetur. Possimus, ratione?</p>
            </div>
            <div className='mt-[30px]'>
              <h2 className='text-xl'>참여 기간</h2>
              <p className='mt-[20px] px-2 '>{portfolio.start_date} ~ {portfolio.end_date}</p>
            </div>
          </div>
          <div>
            <img src={portfolio.portfolio_img} alt="포스트이미지" className='w-[630px] h-[630px] rounded-xl'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;
