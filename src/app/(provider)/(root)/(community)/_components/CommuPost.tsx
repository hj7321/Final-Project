import { useQuery } from '@tanstack/react-query';
import favicon from '../../../../../../public/vercel.svg';
import { CommunityPosts } from '@/types/type';
import { useParams } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import { createClient } from '@/utils/supabase/client';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuPost() {
  const { userId } = useAuthStore();
  const { id } = useParams();

  const getPost = async (): Promise<CommunityPosts> => {
    const response = await fetch('/api/communityRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();
    const filteredData = data.filter((post) => post.id === id) || null;
    return filteredData[0];
  };
  //  const [filteredData, setFilteredData] = useState<CommunityPosts | null>(null);
  //   const filtered: CommunityPosts | null = data.find((post) => post.id === id)|| null;
  //   setFilteredData(filtered);
  // } catch (error) {
  //   console.error('Fetch data error:', error);
  //   setFilteredData(null);
  // };
  // 추후 return문 안에서 filteredData 이용

  const { data, isLoading, error } = useQuery<CommunityPosts>({
    queryKey: ['post', id],
    queryFn: getPost,
    enabled: !!id
  });

  const getUserData = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('Users').select('*').eq('id', userId).maybeSingle();
    return data;
  };

  const userIdFromPost = data?.user_id;

  const { data: userData } = useQuery({
    queryKey: [userIdFromPost],
    queryFn: () => getUserData(userIdFromPost!),
    enabled: !!userIdFromPost
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 py-6">
        <h1 className="text-2xl font-bold">{data?.title}</h1>
        <ul className="flex gap-[24px]">
          {data?.lang_category?.map((lang, index) => (
            <li key={index} className={langSt}>
              {lang}
            </li>
          ))}
        </ul>
        {userIdFromPost === userData?.id && <p className="text-base font-bold">{userData?.nickname}</p>}
        <div className="text-base font-bold flex gap-[24px]">
          <p>{data?.created_at.split('T')[0]}</p>
        </div>
      </div>
      <hr className="w-full border-t border-black my-8" />
      <p className="py-6">{data?.content}</p>
    </div>
  );
}
