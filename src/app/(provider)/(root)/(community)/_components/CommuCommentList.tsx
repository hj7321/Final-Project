'use client';

import favicon from '../../../../../../public/vercel.svg';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuCommentList() {
  return (
    <div className="flex flex-col">
      <div className=" text-base flex flex-col gap-[24px] ">
        <p className="font-bold">작성자</p>
        <p>
          안녕하세요! 코드 리뷰 요청 방법에 대해 고민하시는 모습이 멋지네요. 저는 코드 스타일과 가독성을 중시하여 리뷰를
          진행하는 편입니다. 여러분이 제공해 주신 질문과 함께 코드를 보면, 보다 자세히 분석하여 유익한 피드백을 드릴 수
          있을 것 같습니다. 기대가 됩니다!
        </p>
        <div className="flex gap-[24px]">
          <p>2024.07.20</p>
          <div className="flex">
            <img src={favicon} className={iconSt} />
            <p>54</p>
          </div>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-black border-0 my-[32px]" />
    </div>
  );
}

// 페이지네이션 - 무한 스크롤 구현 필요
