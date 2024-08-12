import Image from "next/image"
import defaultProfileImg from '../../../../../../../../public/defaultProfileimg.svg'

interface UserProfileProps {
  profile : string
  nickname : string
}

export default function UserProfile({profile, nickname} : UserProfileProps) {
  return (
    <div className="flex flex-row md:flex-col">
    <div className="md:h-[150px] md:w-[150px] w-[64px] h-[64px] border-2 rounded-full md:mx-auto mx-2 mt-5">
      <Image
        src={profile? profile : defaultProfileImg}
        alt="user_profile"
        className="object-cover h-full w-full rounded-full"
        width={150}
        height={150}
        priority
      />
    </div>
    <div className="md:mx-auto mx-2 mt-4 flex-col md:justify-center justify-start md:text-center text-start">
      <p className="md:text-2xl text-base md:pl-[0px] pl-1 md:mb-[0px]">{nickname}</p>
      <div className="mx-auto flex flex-col md:items-center item-start justify-center font-thin md:mt-5">
        <div className="flex flex-row mt-1 md:mt-[0px] justify-center items-center">
          <div className="md:w-[25px] md:h-[24px] w-[21px] h-[21px]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12.5" cy="12" r="8" stroke="#687582" />
              <path d="M12.5 6V12L16.5 13.5" stroke="#687582" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="md:text-base text-xs text-grey-500">연락 가능 시간 : AM 9 - PM 6</p>
        </div>
      </div>
    </div>
  </div>
  )
}