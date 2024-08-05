
import { createClient } from "@/utils/supabase/client";
import useAuthStore from "@/zustand/authStore";
import { useState } from "react";

const supabase = createClient()

export default function useCreateCard() {
  const [title, setTitle] = useState<string>('');
  const [language, setLanguage] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number | "">("")
  const [disableBtn, setDisableBtn] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files);
      const newImages = [...images, ...imageFiles];
      if (newImages.length <= 5) {
        setImages(newImages);
      } else {
        alert('이미지는 최대 5까지만 등록이 가능합니다');
      }
    }
  };
  const handleImageDelete = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleLanguageSelect = (lang: string) => {
    setLanguage((prevLanguage) =>
      prevLanguage.includes(lang) ? prevLanguage.filter((l) => l !== lang) : [...prevLanguage, lang]
    );
  };
const handleSubmit = async (): Promise<number | null> => {
  const { userId } = useAuthStore.getState();
  if (!userId) {
    throw new Error('로그인되어 있지 않습니다');
  }
  if (!title.trim()) {
    alert('제목을 입력해주세요');
    return null;
  }
  if (!price) {
    alert('가격을 입력해주세요');
    return null;
  }
  if (language.length < 1) {
    alert('언어는 1개 이상 선택해야 합니다');
    return null;
  }
  if(images.length < 1) {
    alert('이미지 사진은 최소 1개 이상 등록해야 합니다')
    return null;
  }
  if (!description.trim()) {
    alert('내용을 입력해주세요');
    return null;
  }
  setDisableBtn(true)
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('language', JSON.stringify(language));
    formData.append('price', price.toString());
    formData.append('userId', userId);
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await fetch('/api/createCard', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Data received from server:', data); // 디버깅 로그
      alert('게시글이 작성되었습니다!');
      setTitle('');
      setLanguage([]);
      setImages([]);
      setPrice("");
      setDescription('');
      return data.id; // 새로 생성된 게시물 ID 반환
    } else {
      alert('오류 발생');
      return null;
    }
  } catch (error) {
    alert(error);
    return null;
  } finally {
    setDisableBtn(false)
  }
};
  return {
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
  }
}