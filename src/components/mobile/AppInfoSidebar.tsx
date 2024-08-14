'use client';

import useAuthStore from '@/zustand/authStore';
import useSidebarStore from '@/zustand/sidebarStore';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AppInfoSidebar() {
  const { logout } = useAuthStore();
  const { sidebarClose, appInfoSidebarClose } = useSidebarStore();

  const router = useRouter();

  const goToServiceInfoPage = () => {
    router.push('/serviceInfo');
  };

  const goToPersonalInfoPage = () => {
    router.push('/personalInfo');
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    router.replace('/');
    appInfoSidebarClose();
    sidebarClose();
  };

  const goToDeleteUserPage = () => {
    router.push('/deleteUser');
  };

  return (
    <section className="md:hidden fixed min-h-screen w-screen inset-0 z-40 bg-white">
      <div className="flex justify-center items-center h-[56px] p-[16px] border-b border-grey-100">
        <button onClick={appInfoSidebarClose} className="left-0 absolute">
          <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
        </button>
        <Image src="/logo_eng.svg" alt="영어 로고" width={120} height={24} />
      </div>
      <nav className={clsx('flex flex-col gap-[16px] p-[16px] items-start', 'Body-M')}>
        <button onClick={goToServiceInfoPage}>서비스 이용약관</button>
        <button onClick={goToPersonalInfoPage}>개인정보 처리방침</button>
        <div className="flex gap-[8px]">
          <p>버전 정보</p>
          <div className={clsx('Caption2-M', 'text-grey-400 mt-[4px]')}>v1.0</div>
        </div>
        <button onClick={handleLogout}>로그아웃</button>
        <button onClick={goToDeleteUserPage}>회원 탈퇴</button>
      </nav>
    </section>
  );
}
