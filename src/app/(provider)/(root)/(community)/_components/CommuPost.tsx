import favicon from '../../../../../../public/vercel.svg';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuPost() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 py-6">
        <h1 className="text-2xl font-bold">코드 리뷰를 요청할 때 어떻게 하면 더 좋은 피드백을 받을 수 있을까요?</h1>
        <ul className="flex gap-[24px]">
          <li className={langSt}>
            <img src={favicon} className={iconSt} />
            <p>HTML/CSS</p>
          </li>
          <li className={langSt}>
            <img src={favicon} className={iconSt} />
            <p>JavaScript</p>
          </li>
        </ul>
        <p className=" text-base font-bold">작성자</p>
        <div className=" text-base font-bold flex gap-[24px]">
          <p>2024.07.20</p>
          <div className="flex">
            <img src={favicon} className={iconSt} />
            <p>54</p>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-black my-8" />
      {/* <div className="py-6"> */}
      <p className="py-6">
        안녕하세요 <br /> <br />
        제가 작성한 코드를 개선하고 배우기 위해 도움을 요청하고자 합니다. 코드 리뷰를 요청할 때 어떻게 하면 더 좋은
        피드백을 받을 수 있을지 고민이 많이 되네요. 몇 가지 질문과 함께 제 코드에 대한 피드백을 요청드립니다.
        <br /> <br />
        1. 함수 구현에 대한 명확성: 제가 구현한 이 함수가 명확하게 이해되는지 확인 부탁드립니다. 만약 더 명확한 방법이
        있다면 제안해 주세요.
        <br />
        2. 성능 개선 가능성: 이 부분의 성능을 개선할 수 있는 방법이 있을까요? 혹시 다른 최적화 방법이나 알고리즘 제안이
        있으면 알려주세요. <br />
        3. 코드 스타일 및 가독성: 코드 스타일이나 가독성 측면에서 어떤 개선점이 보이시나요? 변수명이나 주석 사용에 대한
        의견을 듣고 싶습니다. <br />
        4. 테스트 케이스 추가 여부: 추가적인 테스트 케이스가 필요한지, 혹은 현재의 테스트 케이스가 충분한지 판단해
        주세요. <br />
        <br />제 코드를 통해 저의 실력을 더욱 향상시키기 위해 여러분의 소중한 의견을 기다리고 있습니다. 어떠한
        피드백이라도 감사히 받겠습니다. 감사합니다!
      </p>
      {/* </div> */}
    </div>
  );
}
//하드코딩버전
// className="flex gap-[24px]" 이 겹치는데 일부분 겹치는 부분도 있어서 정의 어떻게 하면 좋으지 고민
