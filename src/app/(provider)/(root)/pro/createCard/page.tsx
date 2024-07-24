'use client'
import { createClient } from '@/utils/supabase/client';
import useCreateCard from '@/hooks/useCreateCard';
import TitleInput from './_components/TitleInput';
import LanguageSelect from './_components/LanguageSelect';
import ImageUpload from './_components/ImageUpload';
import DescriptionInput from './_components/DescriptionInput';
import SubmitButton from './_components/SubmitButton';
const supabase = createClient();

export default function CreateCard() {
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
  } = useCreateCard()

  return (
    <div className="max-w-[1240px] mx-auto my-6">
      <h1 className="mb-[20px] text-2xl">전문가 의뢰 등록하기</h1>
      <TitleInput title={title} setTitle={setTitle}/>
      <LanguageSelect codeLang={codeLang} language={language} handleLanguageSelect={handleLanguageSelect}/>
      <ImageUpload images={images} handleImageChange={handleImageChange} handleImageDelete={handleImageDelete}/>
      <DescriptionInput description={description} setDescription={setDescription}/>
      <SubmitButton handleSubmit={handleSubmit}/>
    </div>
  );
}
