import Image from 'next/image';
import favicon from '../../../../../../public/vercel.svg';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';
export default function Languages() {
  return (
    <div className="w-[170px] h-[575px] px-6 py-8 flex flex-col items-start gap-6 border border-black rounded-[24px] mt-1">
      <p className="font-bold text-[20px]">언어 선택</p>
      {/* 일단 하드코딩 해 놓고 이후 db에서 목록 끌어 쓸 예정 */}
      {/* 약간 클래스네임들이 지저분해지는 거 같긴 한디 */}
      <ul className="flex flex-col gap-[24px]">
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
        <li className={langSt}>
          {/* <img src={favicon} className={iconSt} /> */}
          <p>HTML/CSS</p>
        </li>
      </ul>
    </div>
  );
}
