const categories = ['Q&A', '인사이트', '전문가 의뢰'];

const titles = [
  '파이썬 질문', '자바스크립트 오류 해결', 'HTML/CSS 레이아웃 문제', 
  'React 상태 관리', 'Java 메서드 오버로딩', 'Python 데이터 분석', 
  'C++ 메모리 관리', 'TypeScript 타입 정의', 'Node.js 비동기 처리', 
  'Git 충돌 해결', '안드로이드 앱 개발', 'iOS 배포 문제', 
  'Next.js 라우팅', '데이터베이스 설계', 'API 통신 오류', 
  '네트워크 문제 해결', '웹 접근성 향상', 'SEO 최적화', 
  '클라우드 서비스 선택', '보안 문제 해결'
];

const contents = [
  '파이썬에서 리스트 컴프리헨션을 사용할 때 주의해야 할 점은 무엇인가요?',
  '자바스크립트에서 비동기 처리를 할 때 발생하는 오류를 어떻게 해결하나요?',
  'HTML과 CSS를 사용하여 반응형 레이아웃을 구성하는 방법을 알고 싶습니다.',
  'React에서 상태 관리를 효과적으로 할 수 있는 방법은 무엇인가요?',
  'Java에서 메서드 오버로딩을 사용할 때 주의해야 할 점이 있나요?',
  'Python을 사용하여 데이터를 분석할 때 자주 사용하는 라이브러리는 무엇인가요?',
  'C++에서 메모리 관리를 잘하기 위한 팁을 알려주세요.',
  'TypeScript에서 타입을 정의할 때의 좋은 관행은 무엇인가요?',
  'Node.js에서 비동기 처리를 효과적으로 할 수 있는 방법을 알고 싶습니다.',
  'Git을 사용하여 협업할 때 충돌을 해결하는 방법을 알고 싶습니다.',
  '안드로이드 앱을 개발할 때 자주 발생하는 문제와 해결 방법을 알려주세요.',
  'iOS 앱을 배포할 때 발생하는 문제를 어떻게 해결하나요?',
  'Next.js에서 라우팅을 설정할 때 주의해야 할 점이 있나요?',
  '데이터베이스를 설계할 때 고려해야 할 중요한 요소는 무엇인가요?',
  'API 통신 시 발생하는 오류를 어떻게 해결하나요?',
  '네트워크 문제를 진단하고 해결하는 방법을 알고 싶습니다.',
  '웹 접근성을 향상시키기 위한 방법을 알려주세요.',
  'SEO를 최적화하기 위한 방법과 도구를 알고 싶습니다.',
  '클라우드 서비스를 선택할 때 고려해야 할 요소는 무엇인가요?',
  '보안 문제를 예방하고 해결하기 위한 방법을 알고 싶습니다.'
];

const nicknames = [
  '개발자123', '코딩마스터', '프로그래머', '웹디자이너', '풀스택개발자',
  '소프트웨어엔지니어', '데이터과학자', '백엔드전문가', '프론트엔드개발자', '모바일앱개발자',
  '시스템엔지니어', '네트워크관리자', 'DBA', '클라우드아키텍트', '보안전문가',
  '테크블로거', '오픈소스기여자', 'IT강사', '해커', '기술지원'
];

const generateDummyData = (numItems : any) => {
  const data = [];
  for (let i = 1; i <= numItems; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];

    data.push({
      id: i,
      category: category,
      title: title,
      content: content,
      nickname: nickname
    });
  }
  return data;
};

const dummyData = generateDummyData(200);

export default dummyData;
