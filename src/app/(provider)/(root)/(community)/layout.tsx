import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({ children }: LayoutProps) {
  return <div>{children}</div>;
}
