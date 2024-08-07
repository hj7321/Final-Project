'use client';

import clsx from 'clsx';
import Image from 'next/image';

export default function ConfirmEmailPage() {
  return (
    <section className="flex flex-col text-center items-center bg-grey-50">
      <div className="flex flex-col justify-center items-center w-[504px] h-[471px] bg-white p-[64px] rounded-[24px] gap-[32px]">
        <Image src="/check.svg" alt="체크" width={80} height={80} />
        <div className={clsx('Body-M', 'text-grey-600')}>
          <p>비밀번호 재설정을 위한 링크를 이메일로 전송했습니다.</p>
          <p>메일함을 확인해주세요.</p>
        </div>
        <div className="flex flex-col gap-[8px] justify-center items-center">
          <button className="h-[56px] w-[376px] rounded-[8px] bg-primary-500 hover:bg-primary-700 text-white">
            확인
          </button>
          <p className={clsx('Caption1-M', 'text-grey-600')}>
            메일이 오지 않았다면, 스팸메일함을 확인하거나 이메일을 재전송해주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
