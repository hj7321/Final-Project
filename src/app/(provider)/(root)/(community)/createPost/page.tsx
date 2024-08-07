'use client';
import { CommunityPosts } from '@/types/type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useRef, useState, ChangeEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import DescriptionInput from '../../pro/createCard/_components/DescriptionInput';

interface AddPortfolioProps {
  clickModal: () => void;
}

type CommunityPostsData = Omit<CommunityPosts, 'id' | 'created_at'> & {
  post_category: string;
  post_img: string[] | null;
  user_id: string;
};

const CreatePost = () => {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuthStore((state) => state.userId) as string | null; // 유저 정보 가져오기

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const savePost = async (data: CommunityPostsData) => {
    const response = await fetch('/api/communityAdd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const { data, error } = await supabase.storage.from('community_post_image').upload(fileName, file);
    if (error) throw error;
    const { publicUrl } = supabase.storage.from('community_post_image').getPublicUrl(fileName).data;
    return publicUrl;
  };

  const { mutate: addMutation } = useMutation<CommunityPosts, unknown, CommunityPostsData>({
    mutationFn: (data: CommunityPostsData) => savePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
      if (contentRef.current) {
        contentRef.current.value = '';
      }
      alert('게시글 등록이 완료되었습니다.');
    }
  });

  const handleSubmit = async () => {
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (selectedLanguage.length === 0) {
      alert('언어를 선택해주세요.');
      return;
    }
    if (!content) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      const uploadPromises = [];
      if (thumbnail) {
        uploadPromises.push(uploadImage(thumbnail));
      }
      additionalImages.forEach((file) => uploadPromises.push(uploadImage(file)));

      const uploadedUrls = await Promise.all(uploadPromises);
      setImageUrls(uploadedUrls);

      if (!user) {
        alert('유저 정보가 없습니다.');
        return;
      }

      const CommunityPostsData: CommunityPostsData = {
        title,
        content,
        user_id: user,
        post_img: uploadedUrls,
        post_category: selectedCategory,
        lang_category: selectedLanguage
      };

      addMutation(CommunityPostsData);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleLanguageChange = (language: string) => {
    if (selectedLanguage.includes(language)) {
      setSelectedLanguage(selectedLanguage.filter((lang) => lang !== language));
    } else {
      setSelectedLanguage([...selectedLanguage, language]);
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="flex flex-col m-auto mt-10 max-w-[80%] justify-center">
      <h1 className="flex text-2xl font-bold mb-4">게시글 등록하기</h1>
      <div className="mt-10 space-y-4">
        <div className="relative rounded-md">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-black pointer-events-none">
            제목
          </span>
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full pl-24 pr-4 py-2 rounded-md text-lg font-semibold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="relative rounded-md">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-black pointer-events-none">
            카테고리
          </span>
          <select
            className="w-full pl-24 pr-4 py-2 rounded-md text-lg font-semibold"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">카테고리를 선택해주세요</option>
            <option value="QnA">QnA</option>
            <option value="Insight">Insight</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 w-full h-auto" />}
            <label className="block text-sm font-medium text-gray-700"> 이미지를 등록해주세요.</label>
            <input type="file" className="mt-1 w-full text-sm" onChange={handleThumbnailChange} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">언어 선택 </label>
          <div className="flex flex-wrap gap-2">
            {[
              'HTML/CSS',
              'JavaScript',
              'Java',
              'Python',
              'C/C++/C#',
              'TypeScript',
              'React',
              'Android/iOS',
              'Next.js',
              'Git/GitHub'
            ].map((language) => (
              <div key={language} className="flex items-center">
                <input
                  type="checkbox"
                  id={language}
                  name="language"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={selectedLanguage.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                />
                <label htmlFor={language} className="ml-2 block text-sm text-gray-900">
                  {language}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">내용</label>
          <textarea
            placeholder="내용을 입력해주세요."
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {/* <DescriptionInput content={content} setContent={setContent} />  */}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-2 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
