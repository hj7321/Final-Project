import Image from 'next/image';
import cryingLogo from '../../../../../../../../public/cryingLogo.svg'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
interface Reviews {
  stars: number;
  contents: string;
  user: {
    nickname: string;
  };
  created_at: string;
}

interface ReviewsProps {
  reviews: Reviews[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  const renderStars = (stars: number) => (
    <>
      {Array(Math.floor(stars))
        .fill(0)
        .map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-500" />
        ))}
      {stars % 1 !== 0 && (
        <span className="relative inline-block">
        <FaStar className="text-grey-100" />
        <FaStar
          className="absolute top-0 left-0 text-yellow-500"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      </span>
      )}
      {Array(5 - Math.floor(stars) - (stars % 1 !== 0 ? 1 : 0))
        .fill(0)
        .map((_, index) => (
          <FaStar key={`empty-${index}`} className="text-grey-100" />
        ))}
    </>
  );
  return (
    <div id="section3" className="p-2 my-4">
      <h1 className="md:text-2xl text-base">리뷰</h1>
      <div className="mt-4 flex flex-col justify-center items-center md:items-start">
        {reviews.length === 0 ? (
          <div className="flex flex-row justify-center items-center">
            <Image src={cryingLogo} width={30} height={30} alt="crying logo" className="md:mx-3" />
            <p className="ml-3 md:ml-0 text-xs md:text-sm">아직 등록된 리뷰가 없습니다</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.created_at}
              className="mx-3 border border-slate-400 w-full flex flex-col justify-between h-[100px] md:h-auto md:p-4 p-3 rounded-xl mb-3"
            >
              <div className="flex flex-row">{renderStars(review.stars)}</div>
              <div className="line-clamp-1 md:my-2 my-1">
                <p className="md:text-xl text-xs line-clamp-1">{review.contents}</p>
              </div>
              <div className="flex flex-row text-grey-400">
                <div>
                  <p className="md:text-base text-[10px]">작성자 : {review.user.nickname}</p>
                </div>
                <div className="mx-2 md:text-base text-[10px] ">
                  <p>작성일 : {review.created_at.slice(0, 10)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
