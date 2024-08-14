'use client';

import useAuthStore from '@/zustand/authStore';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import clsx from 'clsx';

const webBtnStyle = 'w-[193px] h-[56px] border rounded-[8px] p-[16px] text-[16px]';
const mobileBtnStyle = 'w-[140px] h-[37px] border rounded-[8px] py-[8px] px-[16px] text-[14px]';

export default function SignUpComplete() {
  const { isLogin, userId } = useAuthStore();
  const router = useRouter();

  const handleChangePro = async (isPro: boolean): Promise<void> => {
    if (isLogin && isPro) {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      }).then((res) => res.json());
    }

    // 사용자 유형 선택 후 로직
    const redirectPage = Cookies.get('returnPage'); // (1) 쿠키에서 "returnPage"를 키로 하는 값(pathname)을 가져옴
    Cookies.remove('returnPage'); // (2) 쿠키에서 "returnPage"를 키로 하는 값(pathname)을 지움
    if (redirectPage!.startsWith('/login')) router.replace('/');
    // (3) 돌아갈 페이지가 로그인 관련 페이지라면, 현재 페이지를 홈페이지로 대체
    else router.replace(redirectPage!);
    // (3) 돌아갈 페이지가 로그인 관련 페이지가 아니라면, 현재 페이지를 회원가입 관련 페이지로 오기 전 페이지로 대체
    router.refresh();
  };

  return (
    <section className="flex h-[600px] bg-grey-50">
      <div className="m-auto text-center content-center justify-center items-center w-[328px] h-[360px] md:w-[651px] md:h-[438px] bg-white rounded-[24px] p-[64px] flex flex-col gap-[32px]">
        <Image
          src="/helloworld.svg"
          alt="helloworld"
          width={524}
          height={65}
          className="w-[223.07px] h-[27.48px] md:w-[524px] md:h-[65px]"
        />
        <div className="flex flex-col gap-[16px]">
          <div className="text-grey-600 text-[12px] md:text-[16px]">
            <p>가입을 축하드려요!</p>
            <p>전문가는 소액을 받고 의뢰인들의 코드를 피드백하는 활동을 할 수 있어요.</p>
          </div>
          <h2 className="text-grey-900 text-[18px] md:text-[24px] font-bold">전문가로 활동하시겠어요?</h2>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex">
            <div className="flex md:hidden gap-[16px] justify-center">
              <button
                className={clsx(mobileBtnStyle, 'bg-primary-500 text-white')}
                onClick={() => handleChangePro(true)}
              >
                전문가로 활동
              </button>
              <button
                className={clsx(mobileBtnStyle, 'bg-white text-primary-500 border border-primary-500')}
                onClick={() => handleChangePro(false)}
              >
                일반회원으로 활동
              </button>
            </div>
            <div className="hidden md:flex gap-[16px] justify-center">
              <button className={clsx(webBtnStyle, 'bg-primary-500 text-white')} onClick={() => handleChangePro(true)}>
                전문가로 활동할래요
              </button>
              <button
                className={clsx(webBtnStyle, 'bg-white text-primary-500 border border-primary-500')}
                onClick={() => handleChangePro(false)}
              >
                일반회원으로 활동할래요
              </button>
            </div>
          </div>
          <h2 className="text-primary-400 text-[10px] md:text-[14px]">
            * 전문가 활동 시, 포트폴리오를 등록하면 매칭율이 높아져요!
          </h2>
        </div>
      </div>
    </section>
  );
}
