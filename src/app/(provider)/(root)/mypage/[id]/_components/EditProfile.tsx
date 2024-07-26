'use client';

import { Users } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, FormEvent, ChangeEvent } from 'react';

export default function EditProfile() {
  const [nickname, setNickname] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [uploadImg, setUploadImg] = useState<File | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>('');

  const { id } = useParams();

  const queryClient = useQueryClient();

  const getUserData = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('Users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  };

  const {
    data: userData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['Users', id],
    queryFn: getUserData
  });

  const changeUserType = async (nickname: string, profile_img: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('Users').update({ nickname, profile_img }).eq('id', id);
    if (error) throw error;
    return data;
  };

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const { data, error } = await supabase.storage.from('portfolio_bucket_image').upload(fileName, file);
    if (error) throw error;
    const {
      data: { publicUrl }
    } = supabase.storage.from('portfolio_bucket_image').getPublicUrl(fileName);
    setPublicUrl(publicUrl);
    console.log('publicUrl', publicUrl);
    return publicUrl;
  };

  const mutation = useMutation({
    mutationFn: ({ nickname, profile_img }: { nickname: string; profile_img: string }) =>
      changeUserType(nickname, profile_img),
    onMutate: async (newData: { nickname: string; profile_img: string }) => {
      await queryClient.cancelQueries({ queryKey: ['Users', id] });

      const previousUserData = queryClient.getQueryData<Users>(['Users', id]);

      queryClient.setQueryData(['Users', id], (old: any) => ({
        ...old,
        nickname: newData.nickname,
        profile_img: newData.profile_img
      }));

      return { previousUserData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['Users'], context?.previousUserData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Users'] });
    }
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      setUploadImg(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrl = publicUrl;
    if (uploadImg) {
      try {
        imageUrl = await uploadImage(uploadImg);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    mutation.mutate({ nickname, profile_img: imageUrl });
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>;
  }

  const birth = userData?.birth;
  const formattedBirth = `${birth?.substring(0, 4)}년 ${birth?.substring(4, 6)}월 ${birth?.substring(6, 8)}일`;

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full p-6">
        <h1 className="text-2xl font-bold mb-6">프로필 수정</h1>
        <div className="mb-6">
          <label htmlFor="profilePic" className="block mb-4">
            <img
              src={previewImage || 'https://via.placeholder.com/150'}
              alt="프로필 사진"
              className="rounded-full w-36 h-36 cursor-pointer"
            />
            <input type="file" id="profilePic" className="cursor-pointer text-xl" onChange={handleImageChange} />
            <div className="mt-2 text-xl text-gray-600">10MB 이내의 이미지 파일을 업로드 해주세요.</div>
          </label>
        </div>
        <div className="mb-6 w-full">
          <div className="relative border border-gray-500 rounded-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none">
              닉네임
            </span>
            <input
              type="text"
              value={nickname}
              placeholder="닉네임 예시"
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-20 pl-24 pr-4 py-2 rounded-md font-normal"
              maxLength={9}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {nickname.length}/10
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            TIP: 한글/영문(대소문자)/숫자만 사용할 수 있으며, 특수문자는 사용 불가해요.
          </div>
        </div>
        <div className="mb-6">
          <div className="relative border border-gray-500 rounded-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none">
              이름
            </span>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={9}
              placeholder="홍길동"
              className="w-full h-20 pl-24 pr-4 py-2 rounded-md font-normal"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">{name.length}/10</span>
          </div>
        </div>
        <div className="mb-20">
          <div className="relative border py-6 border-gray-500 rounded-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none">
              생일
            </span>
            <span className="w-full h-20 pl-24 pr-4 rounded-md font-normal"> {formattedBirth}</span>
          </div>
        </div>
        <div className="flex mx-0 justify-between">
          <button
            type="button"
            onClick={() => console.log('취소')}
            className="w-96 h-20 px-4 py-2 border border-black rounded-md ml-auto"
          >
            취소하기
          </button>
          <button type="submit" className="px-4 py-2 w-96 bg-black text-white rounded-md ml-3 mr-auto">
            저장하기
          </button>
        </div>
      </form>
    </>
  );
}
