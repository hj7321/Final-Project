export type CodeCategoryType = {
  id: number;
  name: string;
  image: string;
};

export type DummyDataType = {
  id: number;
  category: string;
  title: string;
  content: string;
  nickname: string;
  date: string;
  codeCategory: CodeCategoryType;
};

export const CodeCategoryData = [
    {
      id: 1,
      name: "HTML/CSS",
      image: "https://via.placeholder.com/150?text=HTML/CSS"
    },
    {
      id: 2,
      name: "JavaScript",
      image: "https://via.placeholder.com/150?text=JavaScript"
    },
    {
      id: 3,
      name: "Java",
      image: "https://via.placeholder.com/150?text=Java"
    },
    {
      id: 4,
      name: "Python",
      image: "https://via.placeholder.com/150?text=Python"
    },
    {
      id: 5,
      name: "C/C++/C#",
      image: "https://via.placeholder.com/150?text=C/C++/C#"
    },
    {
      id: 6,
      name: "TypeScript",
      image: "https://via.placeholder.com/150?text=TypeScript"
    },
    {
      id: 7,
      name: "React",
      image: "https://via.placeholder.com/150?text=React"
    },
    {
      id: 8,
      name: "Android/iOS",
      image: "https://via.placeholder.com/150?text=Android/iOS"
    },
    {
      id: 9,
      name: "Next.js",
      image: "https://via.placeholder.com/150?text=Next.js"
    },
    {
      id: 10,
      name: "Git/GitHub",
      image: "https://via.placeholder.com/150?text=Git/GitHub"
    }
  ];

//qna , insight 메인페이지 더미데이터 

export const qnaData = [
    { id: 1, title: "QnA 질문 1", date: "2024.07.19" },
    { id: 2, title: "QnA 질문 2", date: "2024.07.19" },
    { id: 3, title: "QnA 질문 3", date: "2024.07.19" },
    { id: 4, title: "QnA 질문 4", date: "2024.07.19" },
    { id: 5, title: "QnA 질문 5", date: "2024.07.19" },
    { id: 6, title: "QnA 질문 6", date: "2024.07.19" },
    { id: 7, title: "QnA 질문 7", date: "2024.07.19" },
    { id: 8, title: "QnA 질문 8", date: "2024.07.19" },
    { id: 9, title: "QnA 질문 9", date: "2024.07.19" },
    { id: 10, title: "QnA 질문 10", date: "2024.07.19" },
    { id: 11, title: "QnA 질문 11", date: "2024.07.19" },
    { id: 12, title: "QnA 질문 12", date: "2024.07.19" }
  ];
  
  export const insightData = [
    { id: 1, title: "인사이트 글 1", date: "2024.07.19" },
    { id: 2, title: "인사이트 글 2", date: "2024.07.19" },
    { id: 3, title: "인사이트 글 3", date: "2024.07.19" },
    { id: 4, title: "인사이트 글 4", date: "2024.07.19" },
    { id: 5, title: "인사이트 글 5", date: "2024.07.19" },
    { id: 6, title: "인사이트 글 6", date: "2024.07.19" },
    { id: 7, title: "인사이트 글 7", date: "2024.07.19" },
    { id: 8, title: "인사이트 글 8", date: "2024.07.19" },
    { id: 9, title: "인사이트 글 9", date: "2024.07.19" },
    { id: 10, title: "인사이트 글 10", date: "2024.07.19" },
    { id: 11, title: "인사이트 글 11", date: "2024.07.19" },
    { id: 12, title: "인사이트 글 12", date: "2024.07.19" }
  ];
  
  //전문가 더미데이터

  export const expertData = [
    {
      id: 1,
      image: "https://via.placeholder.com/150?text=Expert+1",
      title: "HTML/CSS 전문가",
      price: "₩100,000",
      language: "HTML/CSS",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150?text=Expert+2",
      title: "JavaScript 전문가",
      price: "₩150,000",
      language: "JavaScript",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/150?text=Expert+3",
      title: "Java 전문가",
      price: "₩120,000",
      language: "Java",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/150?text=Expert+4",
      title: "Python 전문가",
      price: "₩130,000",
      language: "Python",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/150?text=Expert+5",
      title: "C/C++/C# 전문가",
      price: "₩140,000",
      language: "C/C++/C#",
    },
    {
      id: 6,
      image: "https://via.placeholder.com/150?text=Expert+6",
      title: "TypeScript 전문가",
      price: "₩110,000",
      language: "TypeScript",
    },
    {
      id: 7,
      image: "https://via.placeholder.com/150?text=Expert+7",
      title: "React 전문가",
      price: "₩160,000",
      language: "React",
    },
    {
      id: 8,
      image: "https://via.placeholder.com/150?text=Expert+8",
      title: "Android/iOS 전문가",
      price: "₩170,000",
      language: "Android/iOS",
    },
    {
      id: 9,
      image: "https://via.placeholder.com/150?text=Expert+9",
      title: "Next.js 전문가",
      price: "₩180,000",
      language: "Next.js",
    },
    {
      id: 10,
      image: "https://via.placeholder.com/150?text=Expert+10",
      title: "Git/GitHub 전문가",
      price: "₩190,000",
      language: "Git/GitHub",
    },
    {
      id: 11,
      image: "https://via.placeholder.com/150?text=Expert+11",
      title: "HTML/CSS 전문가",
      price: "₩100,000",
      language: "HTML/CSS",
    },
    {
      id: 12,
      image: "https://via.placeholder.com/150?text=Expert+12",
      title: "JavaScript 전문가",
      price: "₩150,000",
      language: "JavaScript",
    }
  ];
  
const categories = ['Q&A', '인사이트', '전문가 의뢰'];
export const CodeCategories = [
  { id: 1, name: "HTML/CSS", image: "https://via.placeholder.com/150?text=HTML/CSS" },
  { id: 2, name: "JavaScript", image: "https://via.placeholder.com/150?text=JavaScript" },
  { id: 3, name: "Java", image: "https://via.placeholder.com/150?text=Java" },
  { id: 4, name: "Python", image: "https://via.placeholder.com/150?text=Python" },
  { id: 5, name: "C/C++/C#", image: "https://via.placeholder.com/150?text=C/C++/C#" },
  { id: 6, name: "TypeScript", image: "https://via.placeholder.com/150?text=TypeScript" },
  { id: 7, name: "React", image: "https://via.placeholder.com/150?text=React" },
  { id: 8, name: "Android/IOS", image: "https://via.placeholder.com/150?text=Android/iOS" },
  { id: 9, name: "Next.JS", image: "https://via.placeholder.com/150?text=Next.js" },
  { id: 10, name: "Git/Github", image: "https://via.placeholder.com/150?text=Git/GitHub" },
];

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

const generateDummyData = (numItems: number) => {
  const data = [];
  for (let i = 1; i <= numItems; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const codeCategory = CodeCategories[Math.floor(Math.random() * CodeCategories.length)];
    const date = new Date().toISOString().split('T')[0];

    data.push({
      id: i,
      category: category,
      title: title,
      content: content,
      nickname: nickname,
      date: date,
      codeCategory: codeCategory
    });
  }
  return data;
};

export const dummyData = generateDummyData(200);
