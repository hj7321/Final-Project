'use client';

import { useState } from 'react';
import Languages from './Languages';
import Latest from './Latest';
import Popularity from './Popularity';

export default function CompletePostList() {
  const [view, setView] = useState<boolean>(true);

  const handleListChange = () => {
    setView(!view);
  };

  return (
    <div>
      <Languages />
      <div>
        <button>질문 작성하기</button>
        <p onClick={() => handleListChange()}>최신 순</p>
        <p onClick={() => handleListChange()}>인기 순</p>
        <div>{view ? <Latest /> : <Popularity />}</div>
      </div>
    </div>
  );
}
