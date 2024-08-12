import Image from "next/image";

interface PostImageProps {
  postImage : string
}

export default function PostImage({postImage} : PostImageProps) {
  return (
    <div className="md:h-[350px] md:w-[810px] w-[330px] h-[180px] border-2 rounded-xl md:mb-[35px]">
      <Image
        src={postImage}
        alt="post_image"
        className="w-full h-full object-cover rounded-xl"
        height={514}
        width={810}
        priority
      />
    </div>
  );
}
