'use client';

// 회원가입 처리 함수
const signUp = (is_pro: boolean): void => {
  // 회원가입 처리 로직
  // 인자로 받은 status 활용해서!
  // 원래 있었던 페이지로 리다이렉션
};

export default function SignUpComplete() {
  const buttonStyle = 'w-[193px] h-[56px] border rounded-[8px] p-[16px] bg-black text-white font-bold';

  return (
    <section className="text-center content-center h-[525px]">
      <h2 className="text-[40px] font-black mb-[10px]">회원가입을 축하드립니다!</h2>
      <h2>전문가로 활동하시겠습니까?</h2>
      <p className="mb-[30px]">전문가는 소액을 받고 의뢰인들의 코드를 피드백하는 활동을 할 수 있습니다.</p>
      <form className="flex gap-[14px] justify-center">
        <button className={buttonStyle} onClick={() => signUp(true)}>
          예
        </button>
        <button className={buttonStyle} onClick={() => signUp(false)}>
          아니오
        </button>
        {/* 여기서 두 버튼 중 아무 버튼이나 누르면 action.tsx에서 정의한 signUp 함수를 호출해서 supabase에 처리해야 함 */}
        {/* SignUpForm 컴포넌트에서 작성한 회원정보를 가져온 후, 어떤 버튼을 눌렀느냐에 따라 is_pro의 boolean 여부가 결정되면 이것까지 합쳐서 signUp 함수 실행해야 됨 */}
        {/* signUp() 함수 두 번 호출하는 게 좋을까? */}
      </form>

      <h2 className="mt-[30px]">전문가로 활동하고 싶으시다면, 마이페이지에서 포트폴리오를 등록해주세요.</h2>
    </section>
  );
}
