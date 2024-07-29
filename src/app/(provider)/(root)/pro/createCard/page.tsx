'use client'

import useCreateCard from '@/hooks/useCreateCard';
import TitleInput from './_components/TitleInput';
import LanguageSelect from './_components/LanguageSelect';
import ImageUpload from './_components/ImageUpload';
import DescriptionInput from './_components/DescriptionInput';
import SubmitButton from './_components/SubmitButton';
import PriceInput from './_components/PriceInput';
import { useRouter } from 'next/navigation';


export default function CreateCard() {
  const route = useRouter()
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
    codeLang,
    price,
    setPrice
  } = useCreateCard()

  const handleNavigation = () => {
    route.push('/pro')
  }
  return (
    <div className="max-w-[1240px] mx-auto my-6">
      <div className='text-4xl border-2 border-solid px-4 py-2 inline-block rounded-full font-thin mb-3 cursor-pointer' onClick={handleNavigation}>X</div>
      <h1 className="mb-[20px] text-2xl">전문가 의뢰 등록하기</h1>
      <TitleInput title={title} setTitle={setTitle}/>
      <PriceInput price={price} setPrice={setPrice}/>
      <LanguageSelect codeLang={codeLang} language={language} handleLanguageSelect={handleLanguageSelect}/>
      <ImageUpload images={images} handleImageChange={handleImageChange} handleImageDelete={handleImageDelete}/>
      <DescriptionInput description={description} setDescription={setDescription}/>
      <SubmitButton handleSubmit={handleSubmit}/>
    </div>
  );
}
