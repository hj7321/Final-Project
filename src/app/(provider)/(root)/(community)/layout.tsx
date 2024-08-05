import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({ children }: LayoutProps) {
  return <div className="w-[1200px] h-[1900px] mx-auto flex flex-col">{children}</div>;
}

// 반응형으로 재구축 바람
