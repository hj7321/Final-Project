import favicon from '../../../../../../public/vercel.svg';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuComment() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-[24px]">
        <div className={langSt}>
          <img src={favicon} className={iconSt} />
          <p>27</p>
        </div>
        <div className={langSt}>
          <img src={favicon} className={iconSt} />
          <p>3</p>
        </div>
      </div>
      <div className="flex gap-[32px] mt-[32px]">
        <textarea
          className="w-[995px] h-[101px] rounded-[8px] border border-black text-[16px] px-2 py-1 resize-none"
          placeholder="도움이 되는 댓글을 등록하세요!"
        />
        <button className="w-[173px] h-[101px] rounded-lg bg-black text-white font-bold text-base flex items-center justify-center">
          댓글 등록
        </button>
      </div>
    </div>
  );
}

// 페이지네이션 - 무한 스크롤 구현 필요
