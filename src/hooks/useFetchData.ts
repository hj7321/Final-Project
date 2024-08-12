'use client';

import { useEffect, useState } from 'react';

export default function useFetchData() {
  // Users 테이블의 모든 이메일이 담긴 배열
  const [emailData, setEmailData] = useState<string[]>(['']);
  // Users 테이블의 모든 닉네임이 담긴 배열
  const [nicknameData, setNicknameData] = useState<string[]>(['']);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/signup');
      const result = await response.json();
      setEmailData(result.emailData);
      setNicknameData(result.nicknameData);
    };
    fetchUserData();
  }, []);

  return { emailData, nicknameData };
}
