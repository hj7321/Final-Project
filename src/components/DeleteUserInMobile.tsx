'use client';

import DeleteAlarmModal from '@/app/(provider)/(root)/mypage/[id]/_components/DeleteAlarmModal';
import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function DeleteUserInMobile() {
  const [throttling, setThrottling] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { userId, userData, logout } = useAuthStore();
  const router = useRouter();

  const handleUserDelete = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    setThrottling(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const password: string = formData.get('password') as string;

    const dataForSubmit = { email: userData!.email, password };

    const data = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForSubmit)
    }).then((res) => res.json());

    if (data.errorMsg) {
      console.log(data.errorMsg);
      alert('비밀번호가 일치하지 않습니다.');
      setThrottling(false);
      return;
    }

    const userDeleteData = await fetch(`/api/withdrawal?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json());

    if (userDeleteData.errorMsg) {
      alert(userDeleteData.errorMsg);
      setThrottling(false);
      return;
    }

    console.log('회원 탈퇴 완료');
    setOpenModal(true);
    logout();
  };

  const goToPrevPage = () => {
    router.back();
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!throttling) handleUserDelete(e);
        }}
        className="flex flex-col md:hidden fixed bg-white z-50 inset-0"
      >
        <div className="flex justify-center items-center h-[56px] p-[16px] border-b border-grey-100">
          <button type="button" onClick={goToPrevPage} className="left-0 absolute">
            <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
          </button>
          <h2 className={clsx('H3-L', 'text-grey-900')}>회원 탈퇴</h2>
        </div>
        <div className="p-[16px] flex flex-col items-center">
          <div className="flex flex-col gap-[8px] mb-[16px]">
            <p className={clsx('Body-L', 'text-grey-600')}>비밀번호 확인</p>
            <input
              type="password"
              name="password"
              placeholder="코듀에서 사용 중인 비밀번호를 입력해주세요."
              className={clsx(
                'Body-M',
                'w-[328px] h-[56px] p-[16px] border border-grey-100 rounded-[8px] outline-none placeholder:text-[14px] text-[14px]'
              )}
            />
          </div>
          <div
            className={clsx(
              'Caption2-M',
              'w-[328px] border border-primary-300 rounded-[8px] bg-primary-50 text-primary-400 p-[16px] mb-[40px]'
            )}
          >
            <p>• &nbsp;현재 사용중인 계정 정보는 회원 탈퇴 후 복구가 불가합니다.</p>
            <p>• &nbsp;진행 중인 거래건이 있거나 페널티 조치 중인 경우 탈퇴 신청이 불가합니다.</p>
            <p>
              • &nbsp;탈퇴 후 회원님의 정보는 전자상거래 소비자보호법에 의거한 코듀 개인정보처리방침에 따라 관리됩니다.
            </p>
            <p>
              • &nbsp;현재 보유 중인 쿠폰 및 무상지급된 코듀 캐시는 모두 자동 소멸되며, 탈퇴 후 재가입하더라도 이미
              소멸되었기 때문에 양도되지 않습니다.
            </p>
            <p>• &nbsp;구매후기 및 답글은 탈퇴 시 자동 삭제됩니다.</p>
            <p>
              • &nbsp;충전 캐시, 충전 비즈머니 또는 수익금이 있을 경우, 캐시 환불, 비즈머니 환불 및 수익금 출금을 통해
              정산이 완료된 이후 탈퇴를 신청하셔야 합니다.
            </p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;* 무상으로 지급된 코듀캐시는 탈퇴와 함께 자동 소멸됩니다.</p>
          </div>
          <button
            type="submit"
            className={clsx(
              throttling && 'hover:cursor-default bg-black text-white bg-opacity-40 text-opacity-50',
              'Body-M',
              'w-[328px] bg-primary-500 rounded-[8px] hover:bg-primary-700 text-white p-[16px]'
            )}
          >
            회원 탈퇴
          </button>
        </div>
      </form>
      {openModal && <DeleteAlarmModal logout={logout} setOpenModal={setOpenModal} />}
    </>
  );
}