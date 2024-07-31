export default function PersonalInfo() {
  const h2Style = 'font-semibold text-[13px]';
  const ulStyle = 'list-disc list-inside';
  const liStyle = 'ml-[6px]';

  return (
    <>
      <p>
        코듀(CodeU) (이하 &quot;서비스&quot;)는 회원님의 개인정보를 매우 중요하게 생각하며, 『개인정보 보호법』을
        준수하고 있습니다. 서비스는 개인정보 처리방침을 통하여 회원님께서 제공하시는 개인정보가 어떠한 용도와 방식으로
        이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
      </p>
      <br />
      <h2 className={h2Style}>제 1 조 (개인정보 수집 항목 및 수집 방법)</h2>
      <ul className={ulStyle}>
        1. 수집 항목
        <li className={liStyle}>필수항목: 이름, 이메일 주소, 비밀번호, 휴대폰 번호, 생년월일</li>
        <li className={liStyle}>선택항목: 프로필 사진, 닉네임, 관심 분야</li>
      </ul>
      <ul className={ulStyle}>
        2. 수집 방법
        <li className={liStyle}>회원가입, 서비스 이용, 고객센터 문의, 이벤트 응모 등을 통해 회원님이 직접 제공</li>
      </ul>
      <br />
      <h2 className={h2Style}>제 2 조 (개인정보의 수집 및 이용 목적)</h2>
      <ul className={ulStyle}>
        1. 서비스 제공 및 회원 관리
        <li className={liStyle}>
          회원 가입 의사 확인, 회원제 서비스 제공, 개인 식별, 서비스 이용 관련 문의 및 불만 처리
        </li>
      </ul>
      <ul className={ulStyle}>
        2. 마케팅 및 광고에의 활용
        <li className={liStyle}>
          신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재
        </li>
      </ul>
      <br />
      <h2 className={h2Style}>제 3 조 (개인정보의 보유 및 이용 기간)</h2>
      <ul className={ulStyle}>
        회원님의 개인정보는 수집 및 이용 목적이 달성된 후 지체 없이 파기합니다. 단, 관계 법령에 의해 보존할 필요가 있는
        경우 해당 법령에서 정한 기간 동안 보관합니다.
        <li className={liStyle}>회원 탈퇴 시 즉시 삭제</li>
        <li className={liStyle}>전자상거래 등에서의 소비자 보호에 관한 법률 등 관련 법령에 의한 보관</li>
      </ul>
      <br />
      <h2 className={h2Style}>제 4 조 (개인정보의 제3자 제공)</h2>
      <ul className={ulStyle}>
        서비스는 회원님의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
        <li className={liStyle}>회원님이 사전에 동의한 경우</li>
        <li className={liStyle}>
          법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
        </li>
      </ul>
      <br />
      <h2 className={h2Style}>제 5 조 (개인정보 처리의 위탁)</h2>
      <ul className={ulStyle}>
        1. 서비스는 원활한 개인정보 업무 처리를 위하여 아래와 같이 개인정보 처리 업무를 외부 전문업체에 위탁하고
        있습니다.
        <li className={liStyle}>위탁 대상자: [위탁업체명]</li>
        <li className={liStyle}>위탁 업무 내용: 데이터 보관 및 관리, 고객상담 응대, 이벤트 운영 등</li>
      </ul>
      <p>
        2. 서비스는 위탁 계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있으며, 위탁 업체가 변경될
        경우 이를 회원님께 고지합니다.
      </p>
      <br />
      <h2 className={h2Style}>제 6 조 (회원의 권리와 의무)</h2>
      <p>
        1. 회원님은 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 가입 해지를 요청할 수도
        있습니다.
      </p>
      <p>
        2. 회원님은 자신의 개인정보를 보호할 의무가 있으며, 부정확한 정보 제공으로 발생하는 문제에 대해 서비스는 책임을
        지지 않습니다.
      </p>
      <p>
        3. 회원님은 개인정보가 유출되지 않도록 관리할 책임이 있으며, 타인의 개인정보를 훼손하지 않을 의무가 있습니다.
      </p>
      <br />
      <h2 className={h2Style}>제 7 조 (개인정보의 파기 절차 및 방법)</h2>
      <p>서비스는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
      <ul className={ulStyle}>
        파기 절차 및 방법은 다음과 같습니다.
        <li className={liStyle}>
          파기 절차: 회원님이 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의
          서류함) 내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.
        </li>
        <li className={liStyle}>
          파기 방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된
          개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
        </li>
      </ul>
      <br />
      <h2 className={h2Style}>제 8 조 (개인정보 보호를 위한 기술적/관리적 대책)</h2>
      <ul className={ulStyle}>
        서비스는 회원님의 개인정보를 안전하게 보호하기 위해 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.
        <li className={liStyle}>
          기술적 대책: 개인정보는 비밀번호에 의해 보호되며, 중요한 데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금
          기능을 사용하는 등의 별도 보안 기능을 통해 보호되고 있습니다.
        </li>
        <li className={liStyle}>
          관리적 대책: 개인정보를 처리하는 직원을 최소한으로 제한하고, 개인정보 보호 교육을 실시하며,
          개인정보보호전담기구를 통해 이행 상황을 점검하고 있습니다.
        </li>
      </ul>
      <br />
      <h2 className={h2Style}>제 9 조 (개인정보 보호책임자 및 담당자의 연락처)</h2>
      <ul className={ulStyle}>
        서비스는 회원님의 개인정보를 보호하고 개인정보와 관련된 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보
        보호책임자를 지정하고 있습니다.
        <li className={liStyle}>개인정보 보호책임자: [담당자 이름]</li>
        <li className={liStyle}>전화번호: [전화번호]</li>
        <li className={liStyle}>이메일: [이메일 주소]</li>
        <li className={liStyle}>주소: [회사 주소]</li>
      </ul>
      <br />
      <h2 className={h2Style}>제 10 조 (개인정보 처리방침 변경)</h2>
      <p>
        이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있을 경우
        변경사항의 시행 7일 전부터 서비스 내 공지사항을 통해 고지합니다.
      </p>
      <h2 className={h2Style}>부칙</h2>
      <p>이 개인정보 처리방침은 2024년 8월 5일부터 시행됩니다.</p>
    </>
  );
}
