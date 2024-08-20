import { CodeCategories } from '@/components/dumy';
import { RequestPosts } from '@/types/type';
import Image from 'next/image';

interface RequestPostCardProp {
  data: RequestPosts[];
}

export default function RequestPostCard({ data }: RequestPostCardProp) {
  const truncateText = (text: string, maxLength: number): string => {
    let newText: string = '';
    if (text.length < maxLength) return text;
    else newText = text.substring(0, maxLength);
    return newText + ' ...';
  };

  return (
    <div className="flex flex-wrap gap-[32px]">
      {data?.slice(0, 24).map((post) => (
        <div
          key={post.id}
          className="w-[156px] h-[232px] md:w-[276px] md:h-[340px] p-[12px] md:p-[24px] flex flex-col gap-[12px] md:gap-[16px] rounded-[8px] md:rounded-[16px] border border-grey-100"
        >
          {post.post_img && post.post_img.length > 0 && (
            <Image
              src={post.post_img[0]}
              alt="카드 이미지"
              width={228}
              height={162}
              className="w-[132px] h-[100px] md:w-[228px] md:h-[162px] rounded-[8px]"
            />
          )}
          <div className="w-[132px] h-[66px] md:w-[228px] md:h-[94px] flex flex-col gap-[4px] md:gap-[8px]">
            <div className="text-[14px] md:text-[16px] text-grey-600">
              {post.lang_category?.slice(0, 1).map((lang, index) => {
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
                    <div>{index === 0 && lang.length > 1 ? `${lang} ⋯` : lang}</div>
                  </div>
                );
              })}
            </div>
            <div className="hidden md:block w-[228px] h-[48px] text-[16px] text-grey-900 justify-start">
              {truncateText(post.title, 40)}
            </div>
            <div className="md:hidden w-[132px] text-[14px] text-grey-900 justify-start">
              {truncateText(post.title, 25)}
            </div>
            <div className="text-[16px] md:text-[20px] text-grey-900 font-bold">{post.price}원~</div>
          </div>
        </div>
      ))}
    </div>
  );
}
