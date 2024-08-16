'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateForms } from '@/app/(provider)/(root)/signup/_components/Validate';
import { Report, Notify } from 'notiflix';
import Cookies from 'js-cookie';
import useSidebarStore from '@/zustand/sidebarStore';

export default function useResetPassword() {
  const inputs = [
    { label: '비밀번호', type: 'password', id: 'pw' },
    { label: '비밀번호 확인', type: 'password', id: 'pwCheck' }
  ];

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // 각 인풋 요소를 가리키는 참조 변수 배열
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null); // 선택된 인풋 필드의 인덱스
  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 값(내용)이 담긴 배열
  const [showPassword, setShowPassword] = useState<boolean[]>(Array(2).fill(false)); // 비밀번호를 표시할지 여부를 결정하는 boolean 값이 담긴 배열 (비밀번호, 비밀번호 확인)
  const [inputMsgs, setInputMsgs] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 유효성 메시지가 담긴 배열

  const [throttling, setThrottling] = useState<boolean>(false); // 버튼 연속 클릭 방지

  const { isSidebarOpened, sidebarClose, isAppInfoSidebarOpened, appInfoSidebarClose } = useSidebarStore();

  const router = useRouter();

  // 인풋 필드의 값이 바뀔(입력될) 때마다 호출되는 이벤트 핸들러 -> 값에 맞는 유효성 메시지가 실시간으로 바뀜
  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValues(newValues);

    const alertMessage = validateForms(newValues[idx], idx + 1);
    const newMsgs = [...inputMsgs];
    if (idx === 1 && inputValues[0] !== newValues[1]) {
      newMsgs[idx] = '비밀번호가 일치하지 않습니다.';
    } else {
      newMsgs[idx] = alertMessage;
    }
    setInputMsgs(newMsgs);
  };

  // 비밀번호를 보여줄지, 숨길지 여부를 결정하는 이벤트 핸들러
  const handleTogglePassword = (idx: number): void => {
    const newVisibility = [...showPassword];
    newVisibility[idx] = !newVisibility[idx];
    setShowPassword(newVisibility);
  };

  // 비밀번호 변경을 진행하는 이벤트 핸들러
  const handleChangePW = async (e: FormEvent<HTMLFormElement>) => {
    if (inputMsgs[0] !== '') {
      inputRefs.current[0]!.focus();
      return;
    } else if (inputMsgs[1] !== '') {
      inputRefs.current[1]!.focus();
      return;
    } else if (inputValues[0] === '' || inputValues[1] === '') {
      return Report.failure('비밀번호 재설정 실패', '비밀번호를 입력해주세요.', '확인');
    } else {
      setThrottling(true); // 모든 조건을 통과했으므로, 이 시점에서 버튼 클릭을 막음 (연속 제출 방지)

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const password: string = formData.get('pw') as string;

      // 비밀번호를 재설정하는 라우트 핸들러 호출
      const data = await fetch('/api/resetPassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      }).then((res) => res.json());

      if (data.errorMsg) {
        console.log(data.errorMsg);
        Notify.failure('비밀번호 변경에 실패했습니다.');
        setThrottling(false); // 다시 버튼 클릭을 허용함
        return;
      }

      // 비밀번호 재설정 성공 후 로직
      Notify.success('비밀번호가 성공적으로 변경되었습니다.', {
        width: '310px'
      }); // (1) 성공 알럿 메시지 띄우기
      // (2) 비밀번호 재설정 페이지로 오기 전 페이지로 리다이렉트
      const redirectPage = Cookies.get('returnPagePWChangeOnly'); // (2-1) 쿠키에서 "returnPagePWChangeOnly"를 키로 하는 값(pathname)을 가져옴
      Cookies.remove('returnPagePWChangeOnly'); // (2-2) 쿠키에서 "returnPagePWChangeOnly"를 키로 하는 값(pathname)을 지움
      if (redirectPage === '/signup' || redirectPage?.startsWith('/login') || !redirectPage) {
        // (2-3) 돌아갈 페이지가 회원가입 페이지 또는 로그인 관련 페이지이거나 없다면, 현재 페이지를 홈페이지로 대체
        if (isAppInfoSidebarOpened) appInfoSidebarClose();
        if (isSidebarOpened) sidebarClose();
        router.replace('/');
        router.refresh(); // 현재 페이지를 다시 로드함
      } else if (redirectPage?.startsWith('/mypage')) {
        // (2-3) 돌아갈 페이지가 마이페이지라면(데스크톱 전용), 현재 페이지를 새로고침함
        window.location.reload();
      } else {
        // (2-3) 위의 경우가 아니라면, 현재 페이지를 로그인 페이지로 오기 전 페이지로 대체
        if (isAppInfoSidebarOpened) appInfoSidebarClose();
        if (isSidebarOpened) sidebarClose();
        router.replace(redirectPage!);
        router.refresh(); // 현재 페이지를 다시 로드함
      }
    }
  };

  return {
    inputs,
    inputRefs,
    selectedIdx,
    setSelectedIdx,
    inputValues,
    showPassword,
    inputMsgs,
    throttling,
    handleInputChange,
    handleTogglePassword,
    handleChangePW
  };
}
