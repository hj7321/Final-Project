import React from "react";

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

const PortfolioModal: React.FC<PortfolioModalProps> = ({
  portfolio,
  user,
  onClose,
}) => {
  // lang_category가 배열인지 확인 후 처리
  const langCategory =
    Array.isArray(portfolio.lang_category)
      ? portfolio.lang_category.join(" / ")
      : portfolio.lang_category; // 배열이 아니면 그대로 사용

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl w-[1200px] h-[780px] flex">
        <div className="flex flex-col w-1/2 p-4 space-y-4">
          <div className="flex items-center space-x-4 mb-5">
            <img
              src={user.profile_img}
              alt={user.nickname}
              className="w-16 h-16 rounded-full object-cover bg-gray-400"
            />
            <h2 className="text-xl font-semibold">{user.nickname}</h2>
          </div>
          <div className="space-y-2">
            <p className="text-md font-thin">{langCategory}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">{portfolio.title}</h3>
          </div>
          <div className="w-[80%] h-[5px] bg-gray-200"></div>
          <div className="mt-5">
            <h3 className="text-xl font-semibold">프로젝트 설명</h3>
            <p className="text-gray-600">
              <p>{portfolio.description}</p>
            </p>
          </div>
        </div>
        <div className="w-1/2 p-4">
          <img
            src={portfolio.portfolio_img}
            alt={portfolio.title}
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default PortfolioModal;
