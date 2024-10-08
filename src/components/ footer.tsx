'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const hideLayoutPatterns = ['/login', '/signup'];

  const hideLayout = hideLayoutPatterns.some((pattern) => pathname.startsWith(pattern));

  return (
    <>
      {
        <footer className={clsx('h-[378px] flex flex-col justify-end', hideLayout && 'hidden md:flex')}>
          <div className="h-[314px] flex flex-col justify-center items-center gap-[30px] pt-[32px] pb-[64px] border border-grey-100 w-[100%]">
            <div className="h-[72px] flex flex-col gap-[8px] justify-center items-center">
              <Image
                src="/logo_kor.svg"
                alt="한국어 로고"
                width={120}
                height={40}
                className="w-[60px] h-[20px] md:w-[120px] md:h-[40px]"
              />
              <div className="flex gap-[16px]">
                <Link
                  href="https://nbcamp.spartacodingclub.kr/?next=%2Fmypage%2Fattendance&utm_source=google&utm_medium=pmax&utm_campaign=nbc&utm_content=backend_java&utm_term=&gad_source=1&gclid=CjwKCAjwnK60BhA9EiwAmpHZwy_tgCwAdAyZE5paMiXUQk4lgk0SKd09K-WeExCd4X_IoTlqpmQ9ghoC-88QAvD_BwE"
                  target="_blank"
                >
                  <Image
                    src="/footer_nbcamp.svg"
                    alt="내배캠 아이콘"
                    width={48}
                    height={24}
                    className="content-center w-[34px] h-[18px] md:w-[48px] md:h-[24px]"
                  />
                </Link>
                <p className="text-grey-900 font-bold text-[12px] md:text-[16px]">내일배움캠프 팔색조(A08)</p>
                <Link href="https://github.com/hj7321/Final-Project" target="_blank">
                  <Image
                    src="/footer_github.svg"
                    alt="깃허브 아이콘"
                    width={24}
                    height={24}
                    className="h-[18px] w-[18px] md:w-[24px] md:h-[24px]"
                  />
                </Link>
                <Link href="https://www.notion.so/teamsparta/A08-77087b93ead74831ab62a973c70d3330" target="_blank">
                  <Image
                    src="/footer_notion.svg"
                    alt="노션 아이콘"
                    width={24}
                    height={24}
                    className="h-[18px] w-[18px] md:w-[24px] md:h-[24px]"
                  />
                </Link>
              </div>
            </div>

            <div className="h-[116px] text-[8px] md:text-[12px] flex flex-col items-center gap-[24px]">
              <div className="text-grey-600 flex flex-col items-center gap-[16px]">
                <p className="text-[10px] md:text-[12px]">팀스파르타 ㈜ 사업자 정보</p>
                <div className="flex flex-col items-center gap-[4px]">
                  <p className="hidden md:block">
                    대표자: 이범규 │ 사업자 등록번호: 783-86-01715 │ 통신판매업 신고번호: 2020-서울강남-02300 │
                    평신교육시설 신고번호: 제 661호
                  </p>
                  <p className="md:hidden">대표자: 이범규 │ 사업자 등록번호: 783-86-01715</p>
                  <p className="md:hidden">
                    통신판매업 신고번호: 2020-서울강남-02300 │ 평신교육시설 신고번호: 제 661호
                  </p>
                  <p>주소: 서울특별시 강남구 테헤란로44길 8 12층 │ 이메일: contact@teamsparta.co │ 전화: 1522-8016</p>
                </div>
              </div>
              <p className="text-grey-400">Copyright ⓒ 2024 TEAMSPARTA. All rights reserved.</p>
            </div>
          </div>
        </footer>
      }
    </>
  );
}
