interface TabBarProps {
  activeTab: string;
  handleTabClick: (tabId: string, sectionId: string) => void;
  portfolioCount: number;
  reviewCount: number;
}

export default function TagBar({ activeTab, handleTabClick, portfolioCount, reviewCount }: TabBarProps) {
  return (
    <div className="flex md:justify-start justify-start space-x-4 border-grey-300 md:p-4 p-3 sticky md:top-[71px] top-[55px] bg-white ">
      <ul className="w-[85%] md:w-auto flex justify-between md:space-x-4">
        <li
          id="service"
          className={`md:text-base text-sm ${
            activeTab === 'service' ? 'text-primary-500 border-b-2 border-primary-500 font-bold ' : 'text-grey-500'
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('service', 'section1');
          }}
        >
          <a href="#section1">서비스 정보</a>
        </li>
        <li
          id="portfolio"
          className={`md:text-base text-sm ${
            activeTab === 'portfolio' ? 'text-primary-500 border-b-2 border-primary-500 font-bold ' : 'text-grey-500'
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('portfolio', 'section2');
          }}
        >
          <a href="#section2">포트폴리오 {portfolioCount}</a>
        </li>
        <li
          id="reviews"
          className={`md:text-base text-sm ${
            activeTab === 'reviews' ? 'text-primary-500 border-b-2 border-primary-500 font-bold ' : 'text-grey-500'
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('reviews', 'section3');
          }}
        >
          <a href="#section3">리뷰 {reviewCount}</a>
        </li>
      </ul>
    </div>
  );
}
