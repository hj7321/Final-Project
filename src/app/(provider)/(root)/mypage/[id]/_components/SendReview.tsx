'use client';

import { CodeCategories } from '@/components/dumy';
import { RequestPosts, RequestReviews } from '@/types/type';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import StarRating from './StarRating';

export default function SendReview() {
  const { id } = useParams();

  const getReview = async () => {
    const response = await fetch('/api/review');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: RequestReviews[] = await response.json();
    return data.filter((post) => post.user_id === id);
  };

  const {
    data: reviews,
    isLoading: isLoadingReviews,
    error: errorReviews
  } = useQuery<RequestReviews[]>({
    queryKey: ['reviews', id],
    queryFn: getReview,
    enabled: !!id
  });

  const getRequestPosts: () => Promise<RequestPosts[]> = async () => {
    const response = await fetch('/api/requestRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: RequestPosts[] = await response.json();

    const reviewRequestIds = reviews?.map((review) => review.request_post_id) || [];
    return data.filter((post) => reviewRequestIds.includes(post.id));
  };

  const {
    data: requestPosts,
    isLoading: isLoadingRequestPosts,
    error: errorRequestPosts
  } = useQuery<RequestPosts[]>({
    queryKey: ['requestPosts', id],
    queryFn: getRequestPosts,
    enabled: !!id && !!reviews
  });

  if (isLoadingReviews || isLoadingRequestPosts) {
    return <div>Loading...</div>;
  }

  if (errorReviews || errorRequestPosts) {
    return <div>Error loading data</div>;
  }

  if (reviews?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
        <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24  mx-auto mb-4" />
        <div className="text-lg font-semibold mb-2">아직 작성한 리뷰가 없어요</div>
        <div className="text-sm text-gray-600 mb-4">전문가 의뢰를 받아보고 리뷰를 작성해 보세요!</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-8 min-h-screen">
      <div className="space-y-4 ">
        {reviews?.slice(0, 10).map((review) => {
          const relatedRequestPost = requestPosts?.find((post) => post.id === review.request_post_id);
          return (
            <div key={review.id} className="bg-white rounded-2xl">
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Image
                      src={
                        (relatedRequestPost?.lang_category &&
                          CodeCategories.find((category) => relatedRequestPost.lang_category.includes(category.name))
                            ?.image) ||
                        '/defaultProfileimg.svg'
                      }
                      alt="d"
                      width={12}
                      height={12}
                      className="w-5 h-5 ml-8 "
                    />
                    <p className="text-sm font-extralight text-gray-500 ml-2">
                      {relatedRequestPost?.lang_category.join(', ')}
                    </p>
                  </div>
                  <p
                    className="text-[16px] ml-8 mb-1 mr-5"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {relatedRequestPost?.title || '제목 없음'}
                    <br />
                    <div className="hidden md:flex border-t w-[225px] border-gray-300 my-5"></div>

                    <StarRating selectedStars={review.stars} size={20} readOnly={true} />
                    {review.contents}
                  </p>
                  <p className="ml-8 mb-3">
                    <span className="text-gray-500 text-[14px] mr-10">작성일: {review.created_at.slice(0, 10)}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
