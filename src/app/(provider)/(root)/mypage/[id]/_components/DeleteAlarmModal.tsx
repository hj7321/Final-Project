'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface DeleteAlarmModalProp {
  logout: () => void;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteAlarmModal({ logout, setOpenModal }: DeleteAlarmModalProp) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    setOpenModal(false);
    router.replace('/');
  };

  return (
    <section className="fixed inset-0 flex justify-center items-center bg-white md:bg-grey-900 md:bg-opacity-50 z-50 flex flex-col">
      <div className="w-[328px] h-[395px] md:w-[477px] md:h-[394px] relative bg-white rounded-[16px] px-[16px] pb-[48px] md:p-[32px] flex flex-col gap-[24px] items-center">
        <div className="md:hidden flex flex-col my-auto">
          <div className="flex flex-col gap-[8px] items-center mb-[32px] md:mb-[0px]">
            <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] flex justify-center items-center">
              <Image
                src="/cryingLogo.svg"
                alt="슬퍼요"
                width={91}
                height={102}
                className="w-[60px] h-[58px] md:w-[91px] md:h-[102px]"
              />
            </div>
            <h3 className="text-grey-900 text-[16px] md:text-[20px]">회원 탈퇴가 완료되었어요.</h3>
            <p className="text-grey-400 text-[14px] md:text-[16px]">확인 버튼을 누르면, 자동 로그아웃됩니다.</p>
          </div>
          <button
            onClick={handleLogout}
            className={clsx(
              'Body-M',
              'bg-primary-500 hover:bg-primary-700 w-[300px] md:w-[400px] h-[46px] md:h-[56px] rounded-[8px] text-white'
            )}
          >
            확인
          </button>
        </div>
      </div>
    </section>
  );
}
