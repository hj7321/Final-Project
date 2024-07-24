import favicon from '../../../../../../public/vercel.svg';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuComment() {
  return (
    <div className="flex flex-col gap-16">
      <>
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
        <div className="flex gap-[32px]">
          <textarea
            className="w-[995px] h-[101px] rounded-[8px] border border-black text-[16px] px-2 py-1 resize-none"
            placeholder="도움이 되는 댓글을 등록하세요!"
          />
          <button className="w-[173px] h-[101px] rounded-lg bg-black text-white font-bold text-base flex items-center justify-center">
            댓글 등록
          </button>
        </div>
      </>
      <div>
        <div>
          <p>작성자</p>
          <p>
            안녕하세요! 코드 리뷰 요청 방법에 대해 고민하시는 모습이 멋지네요. 저는 코드 스타일과 가독성을 중시하여
            리뷰를 진행하는 편입니다. 여러분이 제공해 주신 질문과 함께 코드를 보면, 보다 자세히 분석하여 유익한 피드백을
            드릴 수 있을 것 같습니다. 기대가 됩니다!
          </p>
          <div className=" text-base font-bold flex gap-[24px]">
            <p>2024.07.20</p>
            <div className="flex">
              <img src={favicon} className={iconSt} />
              <p>54</p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}
