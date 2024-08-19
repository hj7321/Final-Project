'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

/**
 * 1. 내가 북마크한 QnA 게시물을 가져온다
 * 2. QnA 게시물에 posts_id로 e
 */

export default function QnaBookmarkList() {
  const { id: userId } = useParams();

  // postId에 해당하는 북마크 개수를 가져오는 함수
  const getBookmarkCount = async (postId: string): Promise<{ postId: string | null; count: number }> => {
    const {
      data: BookmarkData,
      count,
      error
    } = await fetch(`/api/bookmarkCount?postId=${postId}`).then((res) => res.json());
    if (error) {
      console.log(error.errorMsg);
      return { postId: null, count: -1 };
    }

    return { postId, count };
  };

  const getQnaBookmark = async () => {
    // (1) Bookmark 테이블의 데이터 중, 해당 사용자가 북마크한 Q&A 카테고리에 해당하는 게시물들을 가져옴
    const response = await fetch(`/api/bookmark?userId=${userId}&category=qna`).then((res) => res.json());
    if (response.errorMsg) {
      console.log(response.errorMsg);
      return { countData: [], filteredData: [] };
    }
    const postIdData = response.data;

    const countData = await Promise.all(postIdData.map((postId) => getBookmarkCount(postId.posts_id)));

    return countData;
  };

  const { data, isPending, error } = useQuery({
    queryKey: ['bookmark', userId],
    queryFn: getQnaBookmark,
    enabled: !!userId
  });

  // data
  // [ { postId: ~~~ , count: 1 }  ,
  //   { postId: ~~~~, count: 2 }
  // ]

  if (isPending) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>;
  }

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
        <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24  mx-auto mb-4" />
        <div className="text-lg font-semibold mb-2">아직 찜을 한 QnA 게시글이 없어요</div>
        <div className="text-sm text-gray-600 mb-4">코듀를 둘러보면서 마음에 드는 게시글을 찾아보세요!</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <div className="space-y-4">
        {data?.slice(0, 10).map((post, index) => (
          <div key={post.id} className="bg-white rounded-2xl">
            <div className="flex flex-col md:flex-row">
              {post.post_img && post.post_img.length > 0 && (
                <Image
                  src={post.post_img[0]}
                  alt="썸네일 이미지"
                  width={288}
                  height={160}
                  className="w-72 h-40 ml-6 mb-3 md:ml-0 md:mb-0 rounded-lg "
                />
              )}
              <div className="flex flex-col">
                {post.post_category && (
                  <Link href={`/${post.post_category.toLowerCase()}/${post.id}`}>
                    <h3 className="font-bold text-[20px] ml-8 mb-8">{post.title}</h3>
                  </Link>
                )}
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
                  <span className="text-gray-500 text-[14px]">
                    {' '}
                    like:{data?.find((item) => item.postId === post.id).count}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
