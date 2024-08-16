'use client';

import useProfile from '@/hooks/useProfile';
import { Users } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Notify } from 'notiflix';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

export default function EditProfile() {
  const [nickname, setNickname] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [isPro, setIsPro] = useState<boolean>(false);

  const [previewImage, setPreviewImage] = useState<string>('');
  const [uploadImg, setUploadImg] = useState<File | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>('');

  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { userData, isUserDataPending, userDataError } = useProfile(id);

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname || '');
      setName(userData.name || '');
      setBirth(userData.birth || '');
      setPreviewImage(userData.profile_img || '/defaultProfileimg.svg');
      setPublicUrl(userData.profile_img || '');
      setTime(userData.possible_time || '');
      setIntroduction(userData.introduction || '');
      setIsPro(userData.is_pro || false);
    }
  }, [userData]);

  const changeUserType = async (
    nickname: string,
    profile_img: string,
    name: string,
    birth: string,
    possible_time: string,
    introduction: string
  ) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Users')
      .update({ nickname, profile_img, name, birth, possible_time, introduction })
      .eq('id', id);
    if (error) throw error;
    return data;
  };

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const { data, error } = await supabase.storage.from('portfolio_bucket_image/profile').upload(fileName, file);
    if (error) throw error;
    const {
      data: { publicUrl }
    } = supabase.storage.from('portfolio_bucket_image/profile').getPublicUrl(fileName);
    setPublicUrl(publicUrl);
    return publicUrl;
  };

  const mutation = useMutation({
    mutationFn: ({
      nickname,
      profile_img,
      name,
      birth,
      possible_time,
      introduction
    }: {
      nickname: string;
      profile_img: string;
      name: string;
      birth: string;
      possible_time: string;
      introduction: string;
    }) => changeUserType(nickname, profile_img, name, birth, possible_time, introduction),
    onMutate: async (newData: {
      nickname: string;
      profile_img: string;
      name: string;
      birth: string;
      possible_time: string;
      introduction: string;
    }) => {
      await queryClient.cancelQueries({ queryKey: ['Users', id] });

      const previousUserData = queryClient.getQueryData<Users>(['Users', id]);

      queryClient.setQueryData(['Users', id], (old: any) => ({
        ...old,
        nickname: newData.nickname,
        profile_img: newData.profile_img,
        name: newData.name,
        birth: newData.birth,
        possible_time: newData.possible_time,
        introduction: newData.introduction
      }));

      return { previousUserData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['Users'], context?.previousUserData);
    },
    onSuccess: () => {
      Notify.success('프로필이 성공적으로 수정되었습니다.', {
        width: '290px'
      });
      window.location.reload();
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

  const handleImageDelete = () => {
    setPreviewImage('/defaultProfileimg.svg');
    setUploadImg(null);
    setPublicUrl('');
  };

  const handleBirthChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 6) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}`;
    } else if (value.length > 0) {
      value = `${value.slice(0, 4)}`;
    }

    setBirth(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrl = publicUrl;
    if (uploadImg) {
      try {
        imageUrl = await uploadImage(uploadImg);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    mutation.mutate({ nickname, profile_img: imageUrl, name, birth, possible_time: time, introduction });
  };

  const cancleButton = (): void => {
    Notify.failure('수정이 취소되었습니다.');
    window.location.reload();
  };

  if (isUserDataPending) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (userDataError) {
    return <div className="h-screen flex items-center justify-center">Error: {userDataError.message}</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <h1 className="hidden md:flex text-2xl font-bold mb-6">프로필 수정</h1>
        <div className="mb-6">
          <label htmlFor="profilePic" className="block mb-4">
            <div className="relative">
              <Image
                src={previewImage || '/defaultProfileimg.svg'}
                alt="프로필 사진"
                width={144}
                height={144}
                className="rounded-[50%] cursor-pointer"
              />
              {previewImage !== '/defaultProfileimg.svg' && (
                <button
                  type="button"
                  className="absolute top-1 left-32  text-red-700 rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={handleImageDelete}
                >
                  x
                </button>
              )}
            </div>
            <input type="file" id="profilePic" className="cursor-pointer text-xl mt-3" onChange={handleImageChange} />
            <div className="mt-2 text-base md:text-xl text-grey-300 md:text-gray-600">
              10MB 이내의 이미지 파일을 업로드 해주세요.
            </div>
          </label>
        </div>
        <div className="mb-6 w-full">
          <div className="relative border border-gray-300 rounded-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grey-500 pointer-events-none">
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
            <span className="hidden md:absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {nickname.length}/10
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            TIP: 한글/영문(대소문자)/숫자만 사용할 수 있으며, 특수문자는 사용 불가해요.
          </div>
        </div>
        <div className="mb-6">
          <div className="relative border border-gray-300 rounded-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
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
            <span className="hidden md:absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {name.length}/10
            </span>
          </div>
        </div>
        <div className="mb-6">
          <div className="relative border  border-gray-300 rounded-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              생일
            </span>
            <input
              type="text"
              id="birth"
              value={birth}
              onChange={handleBirthChange}
              placeholder="YYYY-MM-DD"
              maxLength={11}
              className="w-full h-20 pl-24 pr-4 py-2 rounded-md font-normal"
            />
          </div>
        </div>

        {isPro && (
          <>
            <div className="mb-6">
              <div className="relative border  border-gray-300 rounded-md">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  연락 가능 시간
                </span>
                <input
                  type="text"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="00시 ~ 00시"
                  className="w-full h-20 pl-48 pr-4 py-2 rounded-md font-normal"
                />
              </div>
            </div>
            <div className="mb-20">
              <div className="relative border  border-gray-300 rounded-md">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  전문가 한 줄 소개
                </span>
                <input
                  type="text"
                  id="myintroduction"
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="전문가 한 줄 소개를 입력하세요"
                  className="w-full h-20 pl-48 pr-4 py-2 rounded-md font-normal"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex mx-0 justify-between">
          <button
            type="button"
            onClick={() => cancleButton()}
            className="w-96  md:h-20 px-4 py-2 border border-primary-500 text-primary-500 rounded-md ml-auto"
          >
            취소하기
          </button>
          <button
            type="submit"
            className="px-4 font-normal md:font-bold  py-2 w-96 bg-primary-500 text-white  rounded-md ml-3 mr-auto"
          >
            저장하기
          </button>
        </div>
      </form>
    </>
  );
}
