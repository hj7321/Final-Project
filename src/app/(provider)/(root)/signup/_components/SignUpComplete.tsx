'use client';

// 회원가입 처리 함수
const signUp = (status: string): void => {
  // 회원가입 처리 로직
  // 인자로 받은 status 활용해서!
  // 원래 있었던 페이지로 리다이렉션
};

export default function SignUpComplete() {
  return (
    <section className="border border-main text-center content-center h-[525px]">
      <h2 className="text-[40px] font-black mb-[10px]">회원가입을 축하드립니다!</h2>
      <h2>전문가로 활동하시겠습니까?</h2>
      <p className="mb-[30px]">전문가는 소액을 받고 의뢰인들의 코드를 피드백하는 활동을 할 수 있습니다.</p>
      <div className="flex gap-[20px] justify-center">
        <button className="border rounded-[3px] p-[15px]" onClick={() => signUp('pro_level1')}>
          네. 전문가로 활동할래요
        </button>
        <button className="border rounded-[3px] p-[15px]" onClick={() => signUp('normal')}>
          아니요. 일반 사용자로 활동할래요
        </button>
      </div>

      <h2 className="mt-[30px]">전문가로 활동하고 싶으시다면, 마이페이지에서 포트폴리오를 등록해주세요.</h2>
    </section>
  );
}
