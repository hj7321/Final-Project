'use client';

import { useState } from 'react';
import MyBookmarkList from './MyBookmarkList';
import AccountList from './AccountList';
import MyCommentList from './MyCommentList';
import MyPostList from './MyPostList';
import Portfolio from './Portfolio';
import EditProfile from './EditProfile';
import { useParams } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import ReceiveReview from './ReceiveReview';
import SendReview from './SendReview';
import ChatList from '../../../chat/_components/ChatList';
import Image from 'next/image';
import DeleteUser from './DeleteUser';
import ResetPassword from './ResetPassword';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import useProfile from '@/hooks/useProfile';
import { Notify } from 'notiflix';

const myActivities = [
  { name: '찜한 목록', component: 'MyBookmarkList' },
  { name: '내가 쓴 글', component: 'MyPostList' },
  { name: '내가 쓴 댓글', component: 'MyCommentList' },
  { name: '거래 내역', component: 'AccountList' },
  { name: '내 채팅 목록', component: 'ChatList' },
  { name: '내가 받은 리뷰', component: 'ReceiveReview', toggle: [true, 'pro'] },
  { name: '내가 작성한 리뷰', component: 'SendReview', toggle: [true, 'user'] },
  { name: '나의 포트폴리오', component: 'Portfolio', toggle: [true, 'pro'] },
  { name: '비밀번호 변경', component: 'ResetPassword', onlyDesktop: true },
  { name: '회원 탈퇴', component: 'DeleteUser', onlyDesktop: true }
];

export default function AllMypage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [activeComponent, setActiveComponent] = useState('MyBookmarkList');

  const componentMapping: { [key: string]: JSX.Element } = {
    MyBookmarkList: <MyBookmarkList />,
    AccountList: <AccountList />,
    MyCommentList: <MyCommentList />,
    MyPostList: <MyPostList />,
    Portfolio: <Portfolio />,
    EditProfile: <EditProfile />,
    ReceiveReview: <ReceiveReview />,
    SendReview: <SendReview />,
    ChatList: <ChatList />,
    ResetPassword: <ResetPassword />,
    DeleteUser: <DeleteUser />
  };

  const renderComponent = (activeComponent: string): JSX.Element => {
    return componentMapping[activeComponent];
  };

  const goToComponent = (component: string): void => {
    setActiveComponent(component);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToResetPassword = (): void => {
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPagePWChangeOnly', pagePathname);
    setActiveComponent('ResetPassword');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { userData, isUserDataPending, userDataError } = useProfile(id);

  const changeUserType = async (currentIsPro: any) => {
    const supabase = createClient();
    const updatedIsPro = !currentIsPro;
    const data = await supabase.from('Users').update({ is_pro: updatedIsPro }).eq('id', id);
    return data;
  };

  const mutation = useMutation({
    mutationFn: changeUserType,
    onMutate: async (currentIsPro) => {
      await queryClient.cancelQueries({ queryKey: ['User', id] });

      const previousUserData = queryClient.getQueryData(['User', id]);

      queryClient.setQueryData(['User', id], (old: { data: any }) => ({
        ...old,
        data: {
          ...old.data,
          is_pro: !currentIsPro
        }
      }));

      return { previousUserData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['User', id], context?.previousUserData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['User', id] });
    },
    onSuccess: () => {
      Notify.success('회원 유형이 변경되었습니다.');
      window.location.reload();
    }
  });

  if (isUserDataPending)
    return (
      <div className={clsx('flex flex-col justify-center mt-[300px] mb-[400px]  items-center')}>
        <div className={clsx('icon', 'flex gap-[3px]')}>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <div className="text-primary-500 text-2xl font-bold mt-3"> Loading...</div>
      </div>
    );

  if (userDataError) {
    return <div className="h-screen flex items-center justify-center">Error: {userDataError.message}</div>;
  }

  const liStyle = 'text-grey-400 cursor-pointer';
  const activeStyle = 'text-primary-500 cursor-pointer font-bold';

  return (
    <div className="flex flex-col max-w-[90%] md:max-w-[80%] m-auto bg-white">
      <div className="flex flex-1 flex-col  md:flex-row">
        <div className="w-full md:w-64 ">
          <div>
            <div className="flex md:flex-col items-center ml-2 md:mr-8 md:ml-0 mb-6 mt-8 md:mt-0 rounded-full">
              <div className="flex flex-col ">
                <div className="w-16 h-16 md:w-[160px] md:h-[160px] ml-2 md:ml-0 md:mt-10 rounded-full">
                  <Image
                    src={userData?.profile_img || '/defaultProfileimg.svg'}
                    alt="프로필 이미지"
                    width={160}
                    height={160}
                    className="rounded-[50%] w-16 h-16 md:w-[160px] md:h-[160px]"
                  />
                </div>
                <div className="text-center text-lg font-bold text-grey-900 md:font-bold mb-4">
                  {userData?.nickname}
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
                  onClick={() => mutation.mutate(userData?.is_pro)}
                >
                  <Image src="/change.svg" alt="변경로고" width={20} height={12} className="mr-2 fill-white" />
                  {userData?.is_pro ? '일반 회원으로 전환' : '전문가로 전환'}
                </button>
              </div>
            </div>
          </div>

          <ul
            className="flex flex-nowrap w-full overflow-x-auto gap-6  whitespace-nowrap md:gap-0 md:space-y-4 md:flex-col mt-[64px] scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <li className="hidden md:flex text-[20px] font-bold">나의 활동</li>
            <div className="hidden md:flex border-t w-[225px] border-grey-300 my-10"></div>

            {myActivities.map((item) => (
              <li
                key={item.name}
                className={clsx(
                  item.onlyDesktop && 'hidden md:block',
                  item.toggle
                    ? (userData?.is_pro && item.toggle[1] === 'pro') || (!userData?.is_pro && item.toggle[1] === 'user')
                      ? 'block'
                      : 'hidden'
                    : '',
                  activeComponent === item.component ? activeStyle : liStyle
                )}
                onClick={item.name === '비밀번호 변경' ? goToResetPassword : () => goToComponent(item.component)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <main className="md:flex-1">
          <h1 className="flex md:mt-[40px] w-full">{renderComponent(activeComponent)}</h1>
        </main>
      </div>
    </div>
  );
}
