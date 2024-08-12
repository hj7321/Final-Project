
import Image from "next/image"

export default function Reviews() {
  return (
    <div id="section3" className="p-2 my-4">
    <h1 className="md:text-2xl text-base">리뷰</h1>
    <div className="mt-4 flex flex-col justify-center items-center">
      <div className="mx-3 border border-slate-400 w-full flex flex-col justify-between h-[100px] md:h-auto md:p-4 p-3 rounded-xl mb-3">
        <div className="flex flex-row">
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
        </div>
        <div className="line-clamp-1 md:my-2 my-1">
          <p className="md:text-xl text-xs line-clamp-1">리뷰 내용 입니다 !</p>
        </div>
        <div className="flex flex-row text-grey-400">
          <div>
            <p className="md:text-base text-[10px]">작성자 : 코듀</p>
          </div>
          <div className="mx-2 md:text-base text-[10px] ">
            <p>작성일 : 2024.08.01</p>
          </div>
        </div>
      </div>

      <div className="mx-3 border border-slate-400 w-full justify-between h-[100px] md:h-auto md:p-4 p-3 rounded-xl mb-3">
        <div className="flex flex-row">
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
          <Image src="/star.svg" alt="star" width={16} height={16} priority />
        </div>
        <div className="line-clamp-1 md:my-2 my-1">
          <p className="md:text-xl text-xs line-clamp-2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste maiores inventore voluptas non,
            officia est consectetur iusto dignissimos! Eligendi quisquam est numquam, libero ad saepe! Neque
            quae doloribus suscipit architecto.
          </p>
        </div>
        <div className="flex flex-row text-grey-400">
          <div>
            <p className="md:text-base text-[10px]">작성자 : 코듀</p>
          </div>
          <div className="mx-2 md:text-base text-[10px] ">
            <p>작성일 : 2024.08.01</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}