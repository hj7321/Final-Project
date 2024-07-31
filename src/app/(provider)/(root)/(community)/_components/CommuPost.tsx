import { useQuery } from '@tanstack/react-query';
import favicon from '../../../../../../public/vercel.svg';
import { CommunityPosts } from '@/types/type';
import { useParams } from 'next/navigation';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuPost() {
  const { id } = useParams();

  const getPosts = async (): Promise<CommunityPosts[]> => {
    const response = await fetch('/api/communityRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();
    return data.find((post) => post.id === id);
  };

  const { data, isLoading, error } = useQuery<CommunityPosts[]>({
    queryKey: ['post', id],
    queryFn: getPosts,
    enabled: !!id
  });

  console.log(data);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 py-6">
        <h1 className="text-2xl font-bold">{data?.title}</h1>
        <ul className="flex gap-[24px]">
          <li className={langSt}>
            <img src={favicon} className={iconSt} />
            <p>HTML/CSS</p>
          </li>
          <li className={langSt}>
            <img src={favicon} className={iconSt} />
            <p>JavaScript</p>
          </li>
        </ul>
        <p className=" text-base font-bold">작성자</p>
        <div className=" text-base font-bold flex gap-[24px]">
          <p>{data?.created_at.match(/^\d{4}-\d{2}-\d{2}/)}</p>
          <div className="flex">
            <img src={favicon} className={iconSt} />
            <p>54</p>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-black my-8" />
      <p className="py-6">{data?.content}</p>
    </div>
  );
}

// 닉네임 연결하는 법 묻기
// 언어별 카테고리 다시 정리하기
// 왜 언디파인이 뜨는 건지 물어보기 (아마 자료에 있을 건데 기억이 슬슬)
