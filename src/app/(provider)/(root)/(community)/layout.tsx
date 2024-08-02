import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({ children }: LayoutProps) {
  return <div className="w-[1200px] mx-auto flex">{children}</div>;
}

// 일단 대충 mx auto 먹여서 가운데 정렬 하려고 했더니 안되네 왜지 딴사람들거 봐야겠다
// 디자인 시안대로 했는데 너비가 좀 이상... 함?
