'use client';

import { useState } from 'react';
import BookMark from './BookMark';
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

const myActivities = [
  { name: '찜한 목록', component: 'BookMark' },
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

  const [activeComponent, setActiveComponent] = useState('BookMark');

  // const renderComponent = () => {
  //   switch (activeComponent) {
  //     case 'BookMark':
  //       return <BookMark />;
  //     case 'AccountList':
  //       return <AccountList />;
  //     case 'MyCommentList':
  //       return <MyCommentList />;
  //     case 'MyPostList':
  //       return <MyPostList />;
  //     case 'Portfolio':
  //       return <Portfolio />;
  //     case 'EditProfile':
  //       return <EditProfile />;
  //     case 'ReceiveReview':
  //       return <ReceiveReview />;
  //     case 'SendReview':
  //       return <SendReview />;
  //     case 'MyChatList':
  //       return <ChatList />;
  //     case 'ResetPassword':
  //       return <ResetPassword />;
  //     case 'DeleteUser':
  //       return <DeleteUser />;
  //   }
  // };

  const componentMapping: { [key: string]: JSX.Element } = {
    BookMark: <BookMark />,
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

  // 리팩토링 전
  // const getUserData = async () => {
  //   const supabase = createClient();
  //   if (!id) {
  //     throw new Error('Invalid UUID: id is null or undefined');
  //   }
  //   const data = await supabase.from('Users').select('*').eq('id', id).maybeSingle();

  //   return data;
  // };
  // const {
  //   data: Users,
  //   isPending,
  //   error
  // } = useQuery({
  //   queryKey: ['Users'],
  //   queryFn: getUserData,
  //   enabled: !!id
  // });

  // 리팩토링 후
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
    }
  });

  if (isUserDataPending) return <div className="h-screen flex items-center justify-center">Loading...</div>;

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
            <div className="hidden md:flex border-t w-[225px] border-gray-300 my-10"></div>

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
            {/* <li
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
            {userData?.is_pro ? (
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

            {userData?.is_pro ? (
              <li
                className={activeComponent === 'Portfolio' ? activeStyle : liStyle}
                onClick={() => setActiveComponent('Portfolio')}
              >
                나의 포트폴리오
              </li>
            ) : (
              ''
            )}
            <li
              className={clsx('hidden md:block', activeComponent === 'ResetPassword' ? activeStyle : liStyle)}
              onClick={goToResetPassword}
            >
              비밀번호 변경
            </li>
            <li
              className={clsx('hidden md:block', activeComponent === 'DeleteUser' ? activeStyle : liStyle)}
              onClick={() => setActiveComponent('DeleteUser')}
            >
              회원탈퇴
            </li> */}
          </ul>
        </div>
        <main className="md:flex-1">
          <h1 className="flex text-2xl font-bold md:mt-[40px] w-full">{renderComponent(activeComponent)}</h1>
        </main>
      </div>
    </div>
  );
}
