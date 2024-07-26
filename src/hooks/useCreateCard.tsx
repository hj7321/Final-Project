
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const supabase = createClient()
const codeLang = [
  'HTML/CSS',
  'JavaScript',
  'Java',
  'Python',
  'C/C++/C#',
  'TypeScript',
  'React',
  'Android/IOS',
  'Next.JS',
  'Git/Github'
];

export default function useCreateCard() {
  const [title, setTitle] = useState<string>('');
  const [language, setLanguage] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number | "">("")

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
  const handleSubmit = async () => {
    if(!title.trim()) {
      alert('제목을 입력해주세요')
      return
    }
    if(language.length < 1) {
      alert('언어는 1개 이상 선택해야 합니다')
      return
    }
    if(!description.trim()) {
      alert('내용을 입력해주세요')
      return
    }
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('language', JSON.stringify(language))
      formData.append('price',price.toString())
      images.forEach((image) => {
        formData.append('images', image)
      })

      const response = await fetch('/api/createCard', {
        method : 'POST',
        body : formData
      })
      if (response.ok) {
        alert('게시글이 작성되었습니다 !')
        setTitle('')
        setLanguage([])
        setImages([])
        setDescription('')
      } else {
        alert('오류 발생')
      }
    } catch (error) {
      alert(error)
    }
  }
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
    codeLang,
    price,
    setPrice
  }
}