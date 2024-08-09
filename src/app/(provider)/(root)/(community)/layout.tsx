import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({ children }: LayoutProps) {
  return <div className="w-full md:w-[1200px] px-4 md:px-0 mx-auto flex flex-col">{children}</div>;
}
