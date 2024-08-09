import Image from 'next/image';
import React from 'react';
import defaultProfileImg from  '../../../../../../../../public/defaultProfileimg.svg'

interface PortfolioModalProps {
  portfolio: {
    id: string;
    user_id: string;
    title: string;
    content: string;
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
      <div className="bg-white md:p-8 p-4 md:rounded-xl md:w-[1200px] md:h-[780px] max-h-[100%]  overflow-y-auto  md:overflow-hidden w-full flex flex-col items-end ">
        <div className='mt-2 md:mt-[0px]' onClick={() => onClose()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L20 20M20 4L4 20" stroke="#0E0F11" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className='md:mt-[40px] mx-auto p-4 flex md:flex-row flex-col justify-between w-full '>
          <div>
            <div className='flex flex-row items-center order-1'>
              <Image src={user.profile_img? user.profile_img : defaultProfileImg} alt="프로필이미지" className='w-[64px] h-[64px] bg-gray-700 rounded-full mr-4' width={64} height={64} />
              <p className='font-semibold md:text-xl text-base'>{user.nickname}</p>
            </div>
            <div className='md:mt-[40px] mt-[15px] order-2'>
              <p className='font-thin md:text-lg text-sm'>{portfolio.lang_category}</p>
            </div>
            <div className='mt-[20px] order-3'>
              <h1 className='md:text-2xl text-lg'>{portfolio.title}</h1>
              <div className='md:w-[390px] w-full h-[1.5px] bg-grey-300 mt-[30px] hidden md:block'></div>
            </div>
            <div className='md:hidden mt-[30px]'>
              <img src={portfolio.portfolio_img} alt="포스트이미지" className=' w-[330px] h-[330px] rounded-xl'/>
            </div>
            <div className='mt-[30px] order-5'>
              <h2 className='md:text-xl text-lg'>프로젝트 설명</h2>
              <p className='mt-[20px] px-2 font-thin line-clamp-4 md:w-[400px] w-full md:text-base text-sm'>{portfolio.content}</p>
            </div>
            <div className='mt-[30px] order-6'>
              <h2 className='md:text-xl text-lg'>참여 기간</h2>
              <p className='mt-[20px] px-2 md:text-base text-sm'>{portfolio.start_date} ~ {portfolio.end_date}</p>
            </div>
          </div>
          <div className='hidden md:block'>
            <img src={portfolio.portfolio_img} alt="포스트이미지" className='md:w-[630px] w-[330px] h-[630px] rounded-xl'/>
          </div>
        </div> 
      </div>
    </div>
  );
};
export default PortfolioModal;
