'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function TopButton() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 90) setIsVisible(true);
      else setIsVisible(false);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={clsx(
        isVisible ? 'flex' : 'hidden',
        'fixed bottom-[20px] right-[20px] w-[45px] h-[45px] md:w-[60px] md:h-[60px] bg-primary-500 hover:bg-primary-700 text-white rounded-full justify-center items-center font-bold text-[30px]'
      )}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
}
