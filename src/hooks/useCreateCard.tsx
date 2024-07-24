
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const supabase = createClient()
const codeLang = [
  'HTML/CSS',
  'JavaScript',
  'Java',
  'Python',
  'C / C++ / C#',
  'TypeScript',
  'React',
  'Android / IOS',
  'Next.JS',
  'Git / Github'
];

export default function useCreateCard() {
  const [title, setTitle] = useState<string>('');
  const [language, setLanguage] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');

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
    const uploadedImageUrls = [];
    for (let image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `request_post_image/${fileName}`;

      const { error: storageError } = await supabase.storage.from('request_post_image').upload(filePath, image);
      if (storageError) {
        alert('스토리지 업로드 실패');
      } else {
        const { data } = await supabase.storage.from('request_post_image').getPublicUrl(filePath);
        if (data.publicUrl) {
          uploadedImageUrls.push(data.publicUrl);
        } else {
          alert('URL 가져오기 실패');
          return;
        }
      }
    }
    const { data, error } = await supabase
      .from('Request Posts')
      .insert([
        {
          user_id: crypto.randomUUID(),
          title,
          content: description,
          lang_category: language,
          price: '0',
          post_img: uploadedImageUrls
        }
      ]);
    if( error ) {
      alert('게시글을 작성하는데 실패했습니다')
    } else {
      alert('게시글이 작성되었습니다 !')
      setTitle('')
      setLanguage([])
      setImages([])
      setDescription('')
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
    codeLang,
  }
}