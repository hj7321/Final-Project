'use client';

import { useParams } from 'next/navigation';
import { postDumy } from './DumyData';
import { useQuery } from '@tanstack/react-query';
import { CommunityPosts } from '@/types/type';

export default function InsightPostList() {
  const { id } = useParams();

  const getQnaPost = async () => {
    const response = await fetch('/api/communityRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();
    return data.filter((post) => post.post_category === 'Insight');
  };

  const { data, isLoading, error } = useQuery<CommunityPosts[]>({
    queryKey: ['post', id],
    queryFn: getQnaPost,
    enabled: !!id
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>;
  }
  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <div className=" mb-10">
        <h2 className="text-2xl font-bold">내가 쓴 글</h2>
      </div>
      <div className="space-y-4  ">
        {data?.slice(0, 4).map((post) => (
          <div key={post.id} className="bg-white p-4 border border-gray-400 rounded-2xl">
            <h3 className="font-bold text-[20px] ml-8 mb-8 mt-6">{post.title}</h3>
            <p
              className=" text-[16px] ml-8 mb-6 mr-5"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {post.content}
            </p>
            <p className="ml-8 mb-3">
              <span className="text-gray-500 text-[14px] mr-10  ">{post.created_at.slice(0, 10)}</span>
              <span className="text-gray-500 text-[14px] mr-10"> view:13</span>
              <span className="text-gray-500 text-[14px]"> like:13</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}