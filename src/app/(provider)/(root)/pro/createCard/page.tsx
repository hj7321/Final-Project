'use client';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
const supabase = createClient();

export default function CreateCard() {
  const [title, setTitle] = useState<string>('');
  const [language, setLanguage] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');

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

  return (
    <div className="max-w-[1240px] mx-auto my-6">
      <h1 className="mb-[20px] text-2xl">전문가 의뢰 등록하기</h1>
      <div className="mb-[20px]">
        <input
          type="text"
          className="w-full border-2 p-4 rounded-md border-slate-400"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* 언어 선택 카테고리 섹션 */}
      <div className="mb-[20px] border-2 border-slate-400 rounded-md">
        <div className="p-4">
          <p className="ml-7 text-lg">언어 선택(중복가능)</p>
          <div className="flex flex-row px-4 flex-wrap items-center">
            {codeLang.map((lang, index) => (
              <div className="flex justify-start items-center mx-5 my-3 w-[150px]" key={index}>
                <input
                  type="checkbox"
                  name={lang}
                  id={lang}
                  className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                  checked={language.includes(lang)}
                  onChange={() => handleLanguageSelect(lang)}
                />
                <p className="ml-2">{lang}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 이미지 업로드 섹션 */}
      <div className="w-full border-2 border-slate-400 my-[20px] rounded-md p-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-[100px] h-[100px] mr-2 mb-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview ${index}`}
                  className="w-full h-full object-cover rounded-md cursor-pointer"
                  onClick={() => handleImageDelete(index)}
                />
              </div>
            ))}
          </div>
          {images.length < 1 && (
            <label 
              className="w-[60px] h-[60px] flex items-center justify-center relative rounded-full mt-4 cursor-pointer"
              style={{backgroundImage : "url('../images/image_select.jpeg')", backgroundSize : 'cover', backgroundPosition : 'center'}}
            >
              <input
                type="file"
                multiple
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                onChange={handleImageChange}
              />
            </label>
          )}
          <label className="my-4 underline underline-offset-4 text-blue-600 cursor-pointer">
            이미지를 첨부해주세요. (1개 이상 필수, 최대 5개까지 첨부 가능)
            <input type="file" multiple className="hidden" onChange={handleImageChange} />
          </label>
        </div>
      </div>
      {/* 상품 설명 입력 섹션 */}
      <div className="border-2 border-slate-400 mb-[20px] rounded-md">
        <textarea
          name="text"
          id="text"
          className="w-full h-[500px] p-5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      {/* 게시물 등록 버튼 섹션 */}
      <button className="w-full p-5 border-2 border-slate-400 rounded-md" onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}
