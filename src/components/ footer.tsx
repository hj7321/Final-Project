export default function Footer() {
    return (
      <footer className="bg-gray-100 p-8 pt-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* 고객센터 및 전문가센터 */}
          <div className="col-span-2">
            <div className="flex space-x-4 mb-4">
              <button className="border border-black px-4 py-2 rounded">고객센터</button>
              <button className="border border-black px-4 py-2 rounded">전문가센터</button>
            </div>
            <p className="mb-4">10:30~18:00 (점심시간 13:00~14:00)<br/>주말, 공휴일 휴무</p>
            <div className="p-4 bg-blue-100 rounded">
              <p>CodeU는 서비스 중개 플랫폼이에요.<br/>작업 의뢰는 전문가에게 직접 문의해 주세요.</p>
            </div>
          </div>
  
          {/* 링크 섹션 */}
          <div>
            <h3 className="font-bold mb-4">CodeU</h3>
            <ul>
              <li className="mb-2">커리업! 메인</li>
              <li className="mb-2">Prime</li>
              <li className="mb-2">엔터프라이즈</li>
              <li className="mb-2">프리랜서클럽</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">CodeU 정보</h3>
            <ul>
              <li className="mb-2">서비스 소개</li>
              <li className="mb-2">인재영입</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">관련 사이트</h3>
            <ul>
              <li className="mb-2">CodeU 블로그</li>
              <li className="mb-2">CodeU 인스타그램</li>
              <li className="mb-2">CodeU 유튜브</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">지원</h3>
            <ul>
              <li className="mb-2">공지사항</li>
              <li className="mb-2">자주 묻는 질문</li>
              <li className="mb-2">약관 및 정책</li>
              <li className="mb-2 font-bold">개인정보처리방침</li>
            </ul>
          </div>
        </div>
  
        {/* 앱 다운로드 버튼 */}
        <div className="container mx-auto flex justify-center space-x-4 mt-8">
          <button className="border border-black px-4 py-2 rounded">Google Play</button>
          <button className="border border-black px-4 py-2 rounded">App Store</button>
        </div>
      </footer>
    );
  }
  