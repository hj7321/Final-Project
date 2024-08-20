import { CommunityComments, CommunityPosts } from '@/types/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function MyCommentList() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const getComments = async () => {
    const response = await fetch('/api/commentsRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityComments[] = await response.json();
    return data.filter((post) => post.user_id === id);
  };

  const { data: comments } = useQuery<CommunityComments[]>({
    queryKey: ['comments', id],
    queryFn: getComments,
    enabled: !!id
  });

  const getPostList = async () => {
    const response = await fetch('/api/communityRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();
    return data;
  };

  const { data: posts } = useQuery<CommunityPosts[]>({
    queryKey: ['posts', id],
    queryFn: getPostList,
    enabled: !!id
  });

  const deleteComment = async (id: string) => {
    const response = await fetch('/api/commentsRead', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const { mutate: deleteMutation } = useMutation<CommunityComments, Error, string>({
    mutationFn: (id) => deleteComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', id] })
  });

  const handleDelete = (id: string) => {
    const confirmed = confirm('정말로 삭제하시겠습니까?');
    if (confirmed) {
      try {
        deleteMutation(id);
      } catch (error) {
        console.error('삭제에 실패했습니다.', error);
      }
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col w-full">
        <h2 className="hidden md:flex text-2xl font-bold">내가 쓴 댓글</h2>
        <div className="flex flex-col items-center justify-center w-fullbg-white border mt-10 border-grey-100 rounded-md p-6 text-center h-96">
          <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24 mx-auto mb-4" />
          <div className="text-lg font-semibold mb-2">아직 남긴 댓글이 없어요</div>
          <div className="text-sm text-grey-600 mb-4">다른 사람의 글을 읽어보고 답변을 남겨보세요 </div>
        </div>
      </div>
    );
  }

  const commentWithPosts = comments.map((comment) => {
    const post = posts?.find((post) => post.id === comment.community_post_id);
    return {
      ...comment,
      postTitle: post?.title,
      postCategory: post?.post_category.toLowerCase(),
      postId: post?.id
    };
  });

  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-10">
        <h2 className="hidden md:flex font-bold text-[24px]">내가 쓴 댓글</h2>
      </div>
      <div className="space-y-4">
        {commentWithPosts.map((comment) => (
          <div
            key={comment.id}
            className="bg-white p-4 border border-grey-400 rounded-2xl flex justify-between items-center"
          >
            <div>
              <Link href={`/${comment.postCategory}/${comment.postId}`}>
                <p className="text-lg font-semibold mt-2 mb-2 ml-8">{comment.postTitle}</p>
              </Link>
              <div
                className="text-[16px] ml-8 mb-4 mt-3 mr-10"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {comment.contents}
              </div>
              <p className="ml-8 mb-3">
                <span className="text-grey-500 text-[14px] mr-10">{comment.created_at.slice(0, 10)}</span>
              </p>
            </div>
            <button
              onClick={() => handleDelete(comment.id)}
              className="mt-4 p-2 w-20 text-base border border-primary-500 text-primary-500 hover:bg-primary-50 rounded"
            >
              댓글 삭제
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
