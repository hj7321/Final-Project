'use client';

import React from 'react';

interface HeaderLayoutProps {
  component: React.ElementType;
  componentProps: {
    setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>;
  };
}

export default function HeaderLayout({ component, componentProps }: HeaderLayoutProps) {
  return <>{React.createElement(component, componentProps)}</>;
}
