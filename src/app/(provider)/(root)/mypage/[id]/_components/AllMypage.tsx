'use client';

import { useState } from 'react';
import BookMark from './BookMark';
import AccountList from './AccountList';
import MyCommentList from './MyCommentList';
import MyPostList from './MyPostList';
import Portfolio from './Portfolio';
import EditProfile from './EditProfile';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import ReceiveReview from './ReceiveReview';
import SendReview from './SendReview';
import ChatList from '../../../chat/_components/ChatList';
import Image from 'next/image';
import DeleteUser from './DeleteUser';

export default function AllMypage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [activeComponent, setActiveComponent] = useState('BookMark');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'BookMark':
        return <BookMark />;
      case 'AccountList':
        return <AccountList />;
      case 'MyCommentList':
        return <MyCommentList />;
      case 'MyPostList':
        return <MyPostList />;
      case 'Portfolio':
        return <Portfolio />;
      case 'EditProfile':
        return <EditProfile />;
      case 'ReceiveReview':
        return <ReceiveReview />;
      case 'SendReview':
        return <SendReview />;
      case 'MyChatList':
        return <ChatList />;
      case 'DeleteUser':
        return <DeleteUser />;
    }
  };

  const getUserData = async () => {
    const supabase = createClient();
    if (!id) {
      throw new Error('Invalid UUID: id is null or undefined');
    }
    const data = await supabase.from('Users').select('*').eq('id', id).maybeSingle();

    return data;
  };
  const {
    data: Users,
    isLoading,
    error
  } = useQuery({
    queryKey: ['Users'],
    queryFn: getUserData,
    enabled: !!id
  });

  const changeUserType = async (currentIsPro: any) => {
    const supabase = createClient();
    const updatedIsPro = !currentIsPro;
    const data = await supabase.from('Users').update({ is_pro: updatedIsPro }).eq('id', id);
    return data;
  };

  const mutation = useMutation({
    mutationFn: changeUserType,
    onMutate: async (currentIsPro) => {
      await queryClient.cancelQueries({ queryKey: ['Users'] });

      const previousUserData = queryClient.getQueryData(['Users']);

      queryClient.setQueryData(['Users'], (old: { data: any }) => ({
        ...old,
        data: {
          ...old.data,
          is_pro: !currentIsPro
        }
      }));

      return { previousUserData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['Users'], context?.previousUserData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Users'] });
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>;
  }

  const liStyle = 'text-gray-700 cursor-pointer';
  const activeStyle = 'text-primary-500 cursor-pointer font-bold';

  return (
    <div className="flex flex-col max-w-[90%] md:max-w-[80%] m-auto bg-white">
      <div className="flex flex-1 flex-col  md:flex-row">
        <div className="w-full md:w-64 ">
          <div>
            <div className="flex md:flex-col items-center ml-2 md:mr-8 md:ml-0 mb-6 mt-8 md:mt-0 rounded-full">
              <div className="flex flex-col ">
                <div className="w-16 h-16 md:w-[160px] md:h-[160px] ml-2 md:ml-0 md:mt-10 rounded-full">
                  <img
                    src={Users?.data?.profile_img || '/defaultProfileimg.svg'}
                    className=" rounded-[50%] w-16 h-16 md:w-[160px] md:h-[160px] "
                  />
                </div>
                <div className="text-center text-lg font-bold text-grey-900 md:font-bold mb-4">
                  {Users?.data?.nickname}
                </div>
              </div>
              <div className="flex flex-col ml-5 md:ml-0   items-center">
                <button
                  className="mb-2   w-[225px] h-[36px] text-white rounded-md bg-primary-500 flex items-center justify-center"
                  onClick={() => setActiveComponent('EditProfile')}
                >
                  <Image src="/pencil.svg" alt="변경로고" width={20} height={12} className="mr-2 fill-white" />
                  프로필 수정하기
                </button>
                <button
                  className="mb-2 md:mb-0  w-[225px] h-[36px] text-primary-500 border border-primary-500 rounded-md bg-white flex items-center justify-center"
                  onClick={() => mutation.mutate(Users?.data?.is_pro)}
                >
                  <Image src="/change.svg" alt="변경로고" width={20} height={12} className="mr-2 fill-white" />
                  {Users?.data?.is_pro ? '일반 회원으로 전환' : '전문가로 전환'}
                </button>
              </div>
            </div>
          </div>

          <ul
            className="flex flex-nowrap w-full overflow-x-auto gap-6  whitespace-nowrap md:gap-0 md:space-y-4 md:flex-col mt-[64px] scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <li className="hidden md:flex text-[20px] font-bold">나의 활동</li>
            <div className="hidden md:flex border-t w-[225px] border-gray-300 my-10"></div>

            <li
              className={activeComponent === 'BookMark' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('BookMark')}
            >
              찜한 목록
            </li>
            <li
              className={activeComponent === 'MyPostList' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('MyPostList')}
            >
              내가 쓴 글
            </li>
            <li
              className={activeComponent === 'MyCommentList' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('MyCommentList')}
            >
              내가 쓴 댓글
            </li>
            <li
              className={activeComponent === 'AccountList' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('AccountList')}
            >
              거래내역
            </li>
            <li
              className={activeComponent === 'MyChatList' ? activeStyle : liStyle}
              onClick={() => setActiveComponent('MyChatList')}
            >
              내 채팅 목록
            </li>
            {Users?.data?.is_pro ? (
              <li
                className={activeComponent === 'ReceiveReview' ? activeStyle : liStyle}
                onClick={() => setActiveComponent('ReceiveReview')}
              >
                내가 받은 리뷰
              </li>
            ) : (
              <li
                className={activeComponent === 'SendReview' ? activeStyle : liStyle}
                onClick={() => setActiveComponent('SendReview')}
              >
                내가 작성한 리뷰
              </li>
            )}

            {Users?.data?.is_pro ? (
              <li
                className={activeComponent === 'Portfolio' ? activeStyle : liStyle}
                onClick={() => setActiveComponent('Portfolio')}
              >
                나의 포트폴리오
              </li>
            ) : (
              ''
            )}
            {window.innerWidth >= 768 && (
              <li
                className={activeComponent === 'DeleteUser' ? activeStyle : liStyle}
                onClick={() => setActiveComponent('DeleteUser')}
              >
                회원탈퇴
              </li>
            )}
          </ul>
        </div>
        <main className="md:flex-1">
          <h1 className="flex text-2xl font-bold md:mt-[40px] w-full">{renderComponent()}</h1>
        </main>
      </div>
    </div>
  );
}
