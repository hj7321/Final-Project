const h2Style = 'font-semibold text-[13px]';
const ulStyle = 'list-disc list-inside';
const liStyle = 'ml-[6px]';

export default function Marketing() {
  return (
    <>
      <p>
        코듀(CodeU)에서는 회원님께 보다 다양한 혜택과 유익한 정보를 제공하기 위해 마케팅 정보 수신 동의를 받고자 합니다.
      </p>
      <p>아래의 내용을 자세히 읽어보신 후 동의 여부를 선택해주시기 바랍니다.</p>
      <br />
      <h2 className={h2Style}>마케팅 정보의 수집 및 이용 목적</h2>
      <p>1. 이벤트 및 프로모션 : 회원님께서 참여하실 수 있는 각종 이벤트 및 프로모션 정보 제공</p>
      <p>2. 신규 서비스 및 제품 안내 : 새로운 서비스 및 제품에 대한 정보 제공</p>
      <p>3. 맞춤형 서비스 제공 : 회원님의 관심사 및 이용 패턴에 맞춘 맞춤형 서비스 및 혜택 제공</p>
      <p>4. 광고성 정보 제공 : 할인, 쿠폰, 이벤트 등 각종 광고성 정보 제공</p>
      <br />
      <h2 className={h2Style}>수집 및 이용 항목</h2>
      <p>이메일 주소, 휴대폰 번호, 이름, 서비스 이용 기록, 관심 분야</p>
      <br />
      <h2 className={h2Style}>보유 및 이용 기간</h2>
      <p>동의일로부터 마케팅 정보 수신 동의 철회 시까지</p>
      <br />
      <h2 className={h2Style}>동의 거부권 및 불이익 사항</h2>
      <p>회원님은 마케팅 정보 수신에 동의하지 않을 권리가 있으며, 동의하지 않더라도 서비스 이용에 제한이 없습니다.</p>
      <p>
        다만, 마케팅 정보 수신에 동의하지 않으실 경우, 서비스에서 제공하는 다양한 이벤트 및 혜택 안내를 받으실 수
        없습니다.
      </p>
      <br />
      <h2 className={h2Style}>동의 철회 방법</h2>
      <ul className={ulStyle}>
        마케팅 정보 수신에 동의하신 후 언제든지 철회가 가능합니다.
        <li className={liStyle}>이메일: 각 이메일 하단의 수신 거부 링크 클릭</li>
        <li className={liStyle}>문자 메시지: 각 문자 메시지 하단의 수신 거부 번호로 회신</li>
        <li className={liStyle}>서비스 내 설정: 회원 정보 관리 페이지에서 수신 동의 철회 선택</li>
      </ul>
    </>
  );
}
