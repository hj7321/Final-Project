'use client';

import useCreateCard from '@/hooks/useCreateCard';
import TitleInput from './_components/TitleInput';
import LanguageSelect from './_components/LanguageSelect';
import ImageUpload from './_components/ImageUpload';
import DescriptionInput from './_components/DescriptionInput';
import SubmitButton from './_components/SubmitButton';
import PriceInput from './_components/PriceInput';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import { useEffect } from 'react';

export default function CreateCard() {
  const route = useRouter();
  const { isPro } = useAuthStore();

  const {
    title,
    setTitle,
    language,
    setLanguage,
    description,
    setDescription,
    images,
    setImages,
    handleImageChange,
    handleImageDelete,
    handleLanguageSelect,
    handleSubmit,
    price,
    setPrice,
    disableBtn
  } = useCreateCard();

  const handleNavigation = () => {
    route.push('/pro');
  };

  const handleFormSubmit = async () => {
    const newPostId = await handleSubmit();
    if (newPostId !== null && newPostId !== undefined) {
      route.push(`/pro/proDetail/${newPostId}`);
    }
  };

  return (
    <div className="md:max-w-[1240px] w-full p-2 mx-auto md:my-6 my-2">
      <div
        className="md:mb-5 mb-3 ml-2 cursor-pointer group md:w-[65px] md:h-[65px] w-[30px] h-[30px]"
        onClick={handleNavigation}
      >
        <svg width="full" height="full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="31.5"
            className="stroke-gray-300 group-hover:stroke-gray-400"
          />
          <path
            d="M24 24L40 40M40 24L24 40"
            className="stroke-gray-300 group-hover:stroke-gray-400"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="md:mb-[20px] mb-[10px] md:text-2xl text-base">전문가 의뢰 등록하기</h1>
      <TitleInput title={title} setTitle={setTitle} />
      <PriceInput price={price} setPrice={setPrice} />
      <LanguageSelect language={language} handleLanguageSelect={handleLanguageSelect} />
      <ImageUpload images={images} handleImageChange={handleImageChange} handleImageDelete={handleImageDelete} />
      <DescriptionInput description={description} setDescription={setDescription} />
      <SubmitButton handleFormSubmit={handleFormSubmit} disableBtn={disableBtn} />
    </div>
  );
}
