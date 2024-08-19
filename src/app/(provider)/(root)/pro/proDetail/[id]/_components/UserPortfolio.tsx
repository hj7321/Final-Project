
import Image from "next/image";
import { PortfolioData } from "../page"
import cryingLogo from '../../../../../../../../public/cryingLogo.svg'
interface PortfolioListProps {
  portfolio: PortfolioData[];
  handlePortfolioClick: (portfolio: PortfolioData) => void;
}
export default function UserPortfolio({portfolio, handlePortfolioClick} : PortfolioListProps) {
  return (
    <div id="section2" className="p-2 my-4">
    <h1 className="md:text-2xl text-base my-3">포트폴리오</h1>
    <div className="mt-4 flex flex-row md:justify-start justify-center flex-wrap">
      {portfolio.length === 0 ? (
        <div className="flex flex-row justify-start items-center">
          <Image src={cryingLogo} width={30} height={30} alt="crying logo" className="md:mx-3" />
          <p className="ml-3 md:ml-0 text-xs md:text-sm">아직 등록된 포트폴리오가 없습니다</p>
        </div>
      ) : (
        portfolio.map((item) => (
          <div
            key={item.id}
            className="flex md:flex-col flex flex-row border-2 p-4 rounded-xl  md:w-[280px] w-full md:mx-3 my-2 cursor-pointer"
            onClick={() => handlePortfolioClick(item)} // 포트폴리오 카드 클릭 시 모달 열림
          >
            <div className="md:w-[3/4] md:h-[140px]">
              <Image
                src={item.portfolio_img[0]}
                width={300}
                height={300}
                alt={item.title}
                className="md:w-full md:h-full w-[64px] h-[64px] rounded-xl object-cover"
              />
            </div>
            <div className="ml-3">
              <div className="flex flex-row justify-start items-center md:mt-3 text-xs text-grey-600">
                <p>{item.lang_category}</p>
              </div>
              <div className="md:my-2 my-1">
                <p className="font-bold md:text-lg text-sm line-clamp-1">{item.title}</p>
              </div>
              <div className="md:text-xs text-[10px] text-grey-600">
                <p>
                  {item.start_date} ~ {item.end_date}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  )
}