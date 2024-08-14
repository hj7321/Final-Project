import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../../../../../../../css/carousel.css'
interface PostImageProps {
  postImage: string[];
}

export default function PostImage({ postImage }: PostImageProps) {
  const navigationButton = postImage.length > 1
  return (
    <div className="relative carousel-container md:h-[350px] md:w-[810px] w-[330px] h-[180px] border-2 rounded-xl md:mb-[5px]">
      <Swiper
        className='w-full h-full'
        modules={[Navigation, Pagination ,A11y]}
        spaceBetween={50}
        slidesPerView={1}
        loop = {true}
        navigation={navigationButton}
        pagination={{
          clickable : true,
          type : 'fraction',
        }}
      >
        {postImage.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={`post_image_${index}`}
              className="w-full h-full object-cover rounded-xl"
              height={514}
              width={810}
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
