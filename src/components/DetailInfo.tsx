'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TermsOfService from '../app/(provider)/(root)/signup/_components/TermsOfService';
import PersonalInfo from '../app/(provider)/(root)/signup/_components/PersonalInfo';

interface DetailInfoProp {
  content: string;
}

export default function DetailInfo({ content }: DetailInfoProp) {
  const router = useRouter();

  const goToPrevPage = () => {
    router.back();
  };

  return (
    <section className="md:hidden fixed bg-white z-50 inset-0 overflow-y-auto">
      <div className="flex justify-center items-center h-[56px] p-[16px] border border-grey-100 bg-white">
        <button onClick={goToPrevPage} className="left-0 absolute">
          <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
        </button>
        <h2>{content === 'service' ? '서비스 이용약관' : '개인정보 처리방침'}</h2>
      </div>
      <div className="p-[16px] text-[12px] text-grey-600">
        {content === 'service' ? <TermsOfService /> : <PersonalInfo />}
      </div>
    </section>
  );
}
