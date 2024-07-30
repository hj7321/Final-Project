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
    }
  };

  const getUserData = async () => {
    const supabase = createClient();
    const data = await supabase.from('Users').select('*').eq('id', id).maybeSingle();
    return data;
  };
  const {
    data: Users,
    isLoading,
    error
  } = useQuery({
    queryKey: ['Users'],
    queryFn: getUserData
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
  const activeStyle = 'text-[#253CE5] cursor-pointer font-bold';

  return (
    <div className="flex flex-col max-w-[80%] m-auto bg-white">
      <div className="flex flex-1">
        <aside className="w-64 p-4">
          <div>
            <div className="flex flex-col items-center mb-6 p-4 rounded-full">
              <div className="w-[180px] h-[180px]  rounded-full mb-4">
                <img
                  src={
                    Users?.data?.profile_img ||
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMCAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuOTM2ODAxIDEyLjIwNFY3Ljk1NjAxQzAuOTAzODAxIDIuMTk2MDEgMy44MTM4IDAgMTAuMDQ3OCAwQzE2LjIxODggMC4wMzYgMTkuMDk1OCAyLjIzMjAxIDE5LjA2MjggNy45NTYwMVYxMi4yMDRDMTkuMDI5OCAxOCAxNS45MzA4IDIwLjQ0OCA5Ljk1MTggMjAuNDQ4QzMuOTcyOCAyMC40NDggMC45NjY4MDEgMTggMC45MzY4MDEgMTIuMjA0WiIgZmlsbD0iIzlGQThCMiIvPgo8L3N2Zz4K'
                  }
                  className="w-72 h-40 rounded-full"
                />
              </div>
              <div className="text-black font-bold mb-4">{Users?.data?.nickname}</div>

              <button
                className="mb-2 px-2 w-[244px] h-[36px] text-white rounded-md bg-[#253CE5]"
                onClick={() => setActiveComponent('EditProfile')}
              >
                프로필 수정하기 ✏️
              </button>

              <button
                className="mb-2 px-4 w-[244px] h-[36px] text-[#253CE5] border border-primary-500 rounded-md bg-white"
                onClick={() => mutation.mutate(Users?.data?.is_pro)}
              >
                {Users?.data?.is_pro ? '일반 회원으로 전환' : '전문가로 전환'}
              </button>
            </div>
          </div>

          <ul className="space-y-4 mt-[64px]">
            <li className="text-[20px] font-bold">나의 활동</li>

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
          </ul>
        </aside>
        <main className="flex-1 p-8">
          <h1 className="flex text-2xl font-bold mt-[40px] w-full">{renderComponent()}</h1>
        </main>
      </div>
    </div>
  );
}
