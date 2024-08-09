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

  const handleDeleteUser = async () => {
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    setOpenModal(false);
    router.replace('/');
  };

  return (
    <section className="fixed inset-0 flex justify-center items-center bg-grey-900 bg-opacity-50 z-50 flex flex-col">
      <div className="w-[328px] h-[395px] md:w-[477px] md:h-[394px] relative bg-white rounded-[16px] px-[16px] pb-[48px] md:p-[32px] flex flex-col gap-[24px] items-center">
        <div className="flex flex-col gap-[8px] items-center">
          <div className="w-[180px] h-[180px] flex justify-center items-center">
            <Image src="/cryingLogo.svg" alt="슬퍼요" width={91} height={102} />
          </div>
          <h3 className={clsx('H3-L', 'text-grey-900')}>회원 탈퇴가 완료되었어요.</h3>
          <p className={clsx('Body-M', 'text-grey-400')}>확인 버튼을 누르면, 자동 로그아웃됩니다.</p>
        </div>
        <button
          onClick={handleDeleteUser}
          className={clsx('Body-M', 'bg-primary-500 hover:bg-primary-700 w-[400px] h-[56px] rounded-[8px] text-white')}
        >
          확인
        </button>
      </div>
    </section>
  );
}
