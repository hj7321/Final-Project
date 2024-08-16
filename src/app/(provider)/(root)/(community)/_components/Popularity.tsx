import useProfile from '@/hooks/useProfile';
import { CommunityPosts, Users } from '@/types/type';
import useAuthStore from '@/zustand/authStore';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const btnSt = 'w-[32px] h-[32px] bg-[#585858] text-white text-[16pt] flex items-center justify-center rounded-[4px]';
// 페이지네이션 적용 후에, 조건부 서식 걸리도록 bg 다시 제어해야 함 선택되지 않은 버튼은 #D2D2D2 으로 처리

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  post_category: string;
  user_id: string;
  post_img: string[];
  lang_category: string[];
}

export default function Popularity() {
  const { userId } = useAuthStore();
  const pathname = usePathname().split('/')[1];

  const getPosts = async (): Promise<CommunityPosts[]> => {
    const response = await fetch('/api/communityReadPopularity');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();

    const filteredData = data.filter((post) => post.post_category.toLowerCase() === pathname);
    return filteredData;
  };

  const {
    data: postData,
    isLoading,
    error
  } = useQuery<CommunityPosts[]>({
    queryKey: ['post'],
    queryFn: getPosts
  });

  // 리팩토링 전
  // const getUserData = async () => {
  //   const supabase = createClient();
  //   const data = await supabase.from('Users').select('*').eq('id', userId!).maybeSingle();
  //   return data;
  // };
  // const { data: Users } = useQuery({
  //   queryKey: [userId],
  //   queryFn: getUserData
  // });

  // 리팩토링 후
  const { userData, isUserDataPending, userDataError } = useProfile(userId);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex flex-col gap-[24px]">
        {postData &&
          postData.map((post) => (
            <div key={post.id}>
              <Link href={`/${post.post_category.toLowerCase()}/${post.id}`}>
                <div className="flex flex-col gap-[24px] p-[32px] px-[24px] border border-[#D9d9d9] rounded-[16px]">
                  <h1 className="font-black text-[20px]">{post.title}</h1>
                  <p className="font-medium text-[16px] w-[995px] h-[45px] overflow-hidden text-ellipsis line-clamp-2">
                    {post.content}
                  </p>
                  <p className="font-medium text-[16px]">{userData?.nickname}</p>
                </div>
              </Link>
            </div>
          ))}
      </div>
      <div className="mt-12 flex gap-[8px]">
        <button className={btnSt}>1</button>
        <button className={btnSt}>2</button>
        <button className={btnSt}>3</button>
        <button className={btnSt}>4</button>
        <button className={btnSt}>5</button>
      </div>
    </>
  );
}

// 스타일 관련 재작업 필요
// 페이지네이션 필요
// 닉네임, 조회수
// 필터링 필요
