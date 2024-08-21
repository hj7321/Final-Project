'use client';
import { CommunityPosts } from '@/types/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useState, ChangeEvent, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import { CodeCategories } from '@/components/dumy';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@/css/mdStyle.css';
import Image from 'next/image';
import { Notify } from 'notiflix';

interface AddPortfolioProps {
  clickModal: () => void;
}

type CommunityPostsData = Omit<CommunityPosts, 'id' | 'created_at'> & {
  post_category: string;
  post_img: string[] | null;
  user_id: string;
};

const EditPost = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuthStore((state) => state.userId) as string | null; // ??
  const postId = params.id;

  const getPost = async () => {
    const response = await fetch('/api/communityRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();

    return data.filter((post) => post.id === postId);
  };

  const { data, isLoading, error } = useQuery<CommunityPosts[]>({
    queryKey: ['post', id],
    queryFn: getPost,
    enabled: !!id
  });

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string | undefined>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('QnA');

  useEffect(() => {
    if (data && data.length > 0) {
      const postData = data[0]; // 가져온 데이터가 배열이므로 첫 번째 요소를 사용
      setTitle(postData.title || '');
      setContent(postData.content || '');
      setSelectedLanguage(postData.lang_category || []);
      setThumbnailPreview(postData.post_img ? postData.post_img[0] : null);
      setImageUrls(postData.post_img || []);
      setSelectedCategory(postData.post_category || 'QnA');
    }
  }, [data]);

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
      Notify.success('게시글 등록이 완료되었습니다.');
      router.push(`/${selectedCategory.toLowerCase()}`);
    }
  });

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

  const handleThumbnailRemove = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const EditSave = async () => {
    try {
      const uploadPromises = [];
      if (thumbnail) {
        uploadPromises.push(uploadImage(thumbnail));
      }
      additionalImages.forEach((file) => uploadPromises.push(uploadImage(file)));

      const uploadedUrls = await Promise.all(uploadPromises);
      setImageUrls(uploadedUrls);

      const response = await fetch('/api/communityAdd', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: postId,
          title,
          content,
          post_img: uploadedUrls,
          post_category: selectedCategory,
          lang_category: selectedLanguage
        })
      });

      if (response.ok) {
        Notify.success('포트폴리오 수정이 완료되었습니다.');
        router.push(`/${selectedCategory.toLowerCase()}`);
      } else {
        console.error('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="md:max-w-[1240px] w-full p-2 mx-auto md:my-6 my-2">
      <div className="mt-10">
        <div className="relative rounded-xl border border-grey-100 p-2 mb-4">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-black pointer-events-none">
            게시판 선택
          </span>
          <select
            className="w-full pl-24 pr-4 py-2 rounded-md text-lg font-semibold"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="QnA">QnA</option>
            <option value="Insight">Insight</option>
          </select>
        </div>

        {/* 제목 입력 */}
        <div className="relative rounded-xl border border-grey-100 mb-4">
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full p-3 rounded-xl text-lg font-semibold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 언어 선택 */}
        <div className="flex md:flex-row flex-col justify-between h-[180px] mb-4">
          <div className="border border-grey-100 p-3 rounded-xl md:w-[60%] w-full">
            <label className="block text-sm font-medium text-grey-700 mb-4">언어 선택 (필수, 중복 선택 가능) </label>
            <div className="flex flex-row flex-wrap justify-center items-center gap-2">
              {CodeCategories.map((lang, index) => (
                <div className="flex justify-start items-center mx-2 my-3 w-[100px]" key={index}>
                  <input
                    type="checkbox"
                    name={lang.name}
                    id={lang.name}
                    className="hidden"
                    checked={selectedLanguage.includes(lang.name)}
                    onChange={() => handleLanguageChange(lang.name)}
                  />
                  <label
                    htmlFor={lang.name}
                    className={`cursor-pointer flex items-center ${
                      selectedLanguage.includes(lang.name) ? 'text-primary-600' : 'text-grey-500'
                    }`}
                  >
                    <Image
                      src={selectedLanguage.includes(lang.name) ? lang.image : lang.darkImage}
                      alt={lang.name}
                      width={20}
                      height={20}
                    />
                    <p className="ml-2 text-sm">{lang.name}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 썸네일 이미지 업로드 */}
          <div className="flex space-x-4 border border-grey-100 rounded-xl md:w-[38%] w-full mt-4 md:mt-[0]">
            <div className="w-1/2">
              {thumbnailPreview ? (
                <div className="relative">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    width={300}
                    height={300}
                    className="mt-2 w-[150px] h-[150px]"
                  />
                  <button
                    onClick={handleThumbnailRemove}
                    className="absolute top-1 text-red-600 right-14 rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700">썸네일 이미지를 등록해주세요.</label>
                  <input type="file" className="mt-1 w-full text-sm" onChange={handleThumbnailChange} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 내용 입력 */}
        <div className="mt-[220px] md:mt-[0]">
          <label className="block text-sm font-medium text-grey-700"></label>
          <div data-color-mode="light">
            <MDEditor
              height={700}
              value={content}
              onChange={setContent}
              textareaProps={{
                placeholder: '내용을 입력해주세요. (마크다운 형식)'
              }}
            />
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="w-full mt-4">
          <button
            onClick={EditSave}
            className="w-full bg-primary-500 text-white px-6 py-2 md:py-4 rounded-md shadow-sm hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
