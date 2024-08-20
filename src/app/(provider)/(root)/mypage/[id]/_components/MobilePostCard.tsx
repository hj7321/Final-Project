import { CodeCategories } from '@/components/dumy';
import { CommunityPosts, RequestPosts } from '@/types/type';
import Image from 'next/image';
import Link from 'next/link';
import GetNickname from './GetNickname';
import { BookmarkCount } from './BookmarkCount';
import clsx from 'clsx';

interface MobilePostCardProp {
  data: CommunityPosts[];
}

export default function MobilePostCard({ data }: MobilePostCardProp) {
  return (
    <div className="md:hidden flex flex-col gap-[16px]">
      {data?.slice(0, 10).map((post) => (
        <div
          key={post.id}
          className="bg-white flex flex-col gap-[8px] h-[196px] rounded-[16px] border border-grey-100 p-[16px]"
        >
          <div className="flex gap-[16px]">
            {post.post_img && post.post_img.length > 0 && (
              <Image
                src={post.post_img[0]}
                alt="썸네일 이미지"
                width={288}
                height={186}
                className="h-[72px] w-auto mr-[16px] rounded-[8px]"
              />
            )}
            <div className="flex flex-col gap-[8px] text-[12px]">
              <div className="flex gap-[10px]">
                {post.lang_category?.slice(0, 4).map((lang, index) => {
                  const categoryData = CodeCategories.find((category) => category.name === lang);
                  return (
                    <div key={lang} className="flex gap-[4px]">
                      <Image
                        src={categoryData!.image}
                        alt={lang}
                        width={24}
                        height={24}
                        className="rounded-full w-[16px] h-[16px]"
                      />
                      <div>{index === 3 && lang.length > 4 ? `${lang} ⋯` : lang}</div>
                    </div>
                  );
                })}
              </div>
              {post.post_category && (
                <Link href={`/${post.post_category.toLowerCase()}/${post.id}`}>
                  <h3 className="font-bold text-[14px] text-grey-800">{post.title}</h3>
                </Link>
              )}
            </div>
          </div>

          <div
            className={clsx(post.post_img?.length === 0 && 'h-[72px]', 'h-[42px] text-[14px] text-grey-600')}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: post.post_img?.length === 0 ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {post.content}
          </div>
          <div className="flex flex-col gap-[4px] text-[10px] text-grey-400">
            <GetNickname userId={post.user_id} />
            <div className="flex justify-between">
              <div className="flex gap-[24px]">
                <div className="flex items-center gap-[4px] text-grey-400">
                  <Image src="/comment.svg" alt="댓글 아이콘" width={16} height={16} className="w-[13px] h-[13px]" />
                  <p>-1</p>
                </div>
                <div className="flex items-center gap-[4px] text-grey-400">
                  <Image src="/bookmark.svg" alt="북마크 아이콘" width={16} height={16} className="w-[13px] h-[13px]" />
                  <BookmarkCount postId={post.id} />
                </div>
              </div>
              <p className="text-grey-500">{post.created_at.slice(0, 10)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
