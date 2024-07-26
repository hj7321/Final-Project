'use client';

import useAuthStore from '@/zustand/authStore';
import { useRouter } from 'next/navigation';

export default function SignUpComplete() {
  const { isLogin, userId, userData } = useAuthStore();
  const router = useRouter();

  const handleChangePro = async (isPro: boolean): Promise<void> => {
    console.log(userId);
    console.log(userData);
    if (isLogin && isPro) {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      }).then((res) => res.json());
    }
    router.back();
  };

  const buttonStyle = 'w-[193px] h-[56px] border rounded-[8px] p-[16px] bg-black text-white font-bold';

  return (
    <section className="text-center content-center h-[525px]">
      <h2 className="text-[40px] font-black mb-[10px]">회원가입을 축하드립니다!</h2>
      <h2>전문가로 활동하시겠습니까?</h2>
      <p className="mb-[30px]">전문가는 소액을 받고 의뢰인들의 코드를 피드백하는 활동을 할 수 있습니다.</p>
      <div className="flex gap-[14px] justify-center">
        <button className={buttonStyle} onClick={() => handleChangePro(true)}>
          예
        </button>
        <button className={buttonStyle} onClick={() => handleChangePro(false)}>
          아니오
        </button>
        {/* 근데 여기서 예, 아니오를 클릭하지 않고 페이지를 뒤로가기 해 버리면? -> 어차피 일반 사용자로 저장은 되지만 이러면 페이지가 하나 더 있는 이유가 없는 것 같다 */}
      </div>

      <h2 className="mt-[30px]">전문가로 활동하고 싶으시다면, 마이페이지에서 포트폴리오를 등록해주세요.</h2>
    </section>
  );
}
