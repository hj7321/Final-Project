import { CodeCategories } from '@/components/dumy';
import { CommunityPosts, RequestPosts } from '@/types/type';
import Image from 'next/image';
import Link from 'next/link';
import GetNickname from './GetNickname';
import { BookmarkCount } from './BookmarkCount';

interface DesktopPostCardProp {
  data: CommunityPosts[];
}

export default function DesktopPostCard({ data }: DesktopPostCardProp) {
  return (
    <div className="hidden md:flex flex-col gap-[32px]">
      {data?.slice(0, 10).map((post) => (
        <div
          key={post.id}
          className="bg-white w-[892px] h-[234px] rounded-[16px] border border-grey-100 px-[32px] py-[24px]"
        >
          <div className="h-[186px] flex">
            {post.post_img && post.post_img.length > 0 && (
              <Image
                src={post.post_img[0]}
                alt="썸네일 이미지"
                width={186}
                height={186}
                className="h-[186px] w-[186px] mr-[24px] rounded-[8px] object-cover"
              />
            )}
            <div className="w-full flex flex-col gap-[16px]">
              <div className="flex text-[16px] text-grey-600">
                <div className="flex gap-[20px]">
                  {post.lang_category?.slice(0, 4).map((lang, index) => {
                    const categoryData = CodeCategories.find((category) => category.name === lang);
                    return (
                      <div key={lang} className="flex gap-[8px]">
                        <Image
                          src={categoryData!.image}
                          alt={lang}
                          width={24}
                          height={24}
                          className="rounded-full w-[24px] h-[24px]"
                        />
                        <div>{index === 3 && lang.length > 4 ? `${lang} ⋯` : lang}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                {post.post_category && (
                  <Link href={`/${post.post_category.toLowerCase()}/${post.id}`}>
                    <h3 className="font-bold text-[16px] text-grey-800">{post.title}</h3>
                  </Link>
                )}
                <p
                  className="h-[48px] text-[16px] text-grey-600"
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
              </div>
              <div className="flex flex-col gap-[8px] text-[12px] text-grey-400">
                <GetNickname userId={post.user_id} />
                <div className="flex justify-between">
                  <div className="flex gap-[24px]">
                    <div className="flex items-center gap-[4px] text-grey-400 text-[16px]">
                      <Image
                        src="/comment.svg"
                        alt="댓글 아이콘"
                        width={16}
                        height={16}
                        className="w-[16px] h-[16px]"
                      />
                      <p>-1</p>
                    </div>
                    <div className="flex items-center gap-[4px] text-grey-400 text-[16px]">
                      <Image
                        src="/bookmark.svg"
                        alt="북마크 아이콘"
                        width={16}
                        height={16}
                        className="w-[16px] h-[16px]"
                      />
                      <BookmarkCount postId={post.id} />
                    </div>
                  </div>
                  <p className="text-grey-500 text-[14px]">{post.created_at.slice(0, 10)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
