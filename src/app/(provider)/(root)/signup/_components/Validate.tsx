// 1. 이메일 유효성 검사 함수
export const validateEmail = (email: string): boolean | void => {
  if (!email) return alert('이메일을 입력해주세요.');

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 1) 기본 이메일 형식이 아닌 경우
  if (!regex.test(email)) return alert('이메일은 people@example.com과 같은 형식이어야 합니다.');

  // 로컬 부분("@" 앞부분)과 도메인 부분("@" 뒷부분) 분리
  const [localPart, domainPart] = email.split('@');

  // 2) 로컬 부분이나 도메인 부분이 없는 경우
  if (!localPart || !domainPart) return alert('이메일은 people@example.com과 같은 형식이어야 합니다.');

  // 도메인 부분에서 도메인 이름과 최상위 도메인(제일 뒤에 오는 "." 뒷부분) 분리
  const domainParts = domainPart.split('.');
  const tld = domainParts.pop(); // 마지막 부분이 최상위 도메인
  const domainName = domainParts.join('.'); // 나머지 부분이 도메인 이름

  // 3) 도메인 이름이나 최상위 도메인이 없는 경우
  if (!domainName || !tld) return alert('도메인 이름이나 최상위 도메인이 없습니다');

  // 4) 도메인 이름의 길이가 64자 이상이거나, 최상위 도메인의 길이가 2자 미만인 경우
  if (domainName.length < 1 || domainName.length > 63)
    return alert('도메인 이름의 길이는 1자 이상 63자 이하여야 합니다.');
  if (tld.length < 2) return alert('최상위 도메인의 길이는 2자 이상이어야 합니다.');

  return true;
};

// 2. 비밀번호 유효성 검사 함수
export const validatePassword = (password: string): boolean | void => {
  if (!password) return alert('비밀번호를 입력해주세요.');

  // 길이: 8자 이상 20자 이하
  // 문자: 알파벳 대소문자 1개 이상, 숫자 1개 이상, 특수문자 1개 이상

  // 1) 길이 조건을 만족하지 않는 경우
  if (password.length < 8 || password.length > 20) return alert('비밀번호는 8자 이상 20자 이하여야 합니다.');

  // 2) 문자 조건을 만족하지 않는 경우
  const hasAlphabet = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  if (!hasAlphabet || !hasDigit || !hasSpecialChar)
    return alert('비밀번호는 알파벳, 숫자, 특수문자를 각각 최소 하나 이상 포함해야 합니다.');

  return true;
};

// 3. 닉네임 유효성 검사 함수
export const validateNickName = (nickname: string): boolean | void => {
  if (!nickname) return alert('닉네임을 입력해주세요.');

  // 길이: 1자 이상 10자 이하
  // 문자: 알파벳 대소문자, 한글, 숫자 허용
  // 공백: 문자의 맨 처음과 끝에만 허용하지 않고, 중간 부분에는 허용

  // 1) 길이 조건을 만족하지 않는 경우
  if (nickname.length < 1 || nickname.length > 10) return alert('닉네임은 1자 이상 10자 이하여야 합니다.');

  // 2) 문자 조건을 만족하지 않는 경우
  const validCharactersRegex = /^[\p{L}\p{N}]+$/u;
  if (!validCharactersRegex.test(nickname)) return alert('닉네임은 알파벳 대소문자, 한글, 숫자만 포함할 수 있습니다.');

  // 3) 공백 조건을 만족하지 않는 경우
  const startsOrEndsWithSpaceRegex = /^\s|\s$/;
  if (startsOrEndsWithSpaceRegex.test(nickname)) return alert('닉네임은 처음과 끝에 공백을 포함할 수 없습니다.');

  return true;
};

// 4. 이름 유효성 검사 함수
export const validateName = (name: string): boolean | void => {
  if (!name) return alert('이름을 입력해주세요.');

  // 길이: 2자 이상 50자 이하
  // 문자: 알파벳 대소문자, 한글만 허용
  // 공백: 문자의 맨 처음과 끝에 허용하지 않고, 중간 부분에는 허용하지만, 연속으로 2개 이상이 올 수 없음

  // 1) 길이 조건을 만족하지 않는 경우
  if (name.length < 2 || name.length > 50) return alert('이름은 2자 이상 50자 이하여야 합니다.');

  // 2) 문자 조건을 만족하지 않는 경우
  const validCharactersRegex = /^[a-zA-Z가-힣\s]+$/;
  if (!validCharactersRegex.test(name)) return alert('이름은 알파벳 대소문자, 한글만 포함할 수 있습니다.');

  // 3) 공백 조건을 만족하지 않는 경우
  const startsOrEndsWithSpaceRegex = /^\s|\s$/;
  if (startsOrEndsWithSpaceRegex.test(name)) return alert('이름은 처음과 끝에 공백을 포함할 수 없습니다.');

  const consecutiveSpacesRegex = /\s{2,}/;
  if (consecutiveSpacesRegex.test(name)) return alert('이름에는 연속으로 두 개 이상의 공백을 포함할 수 없습니다.');

  return true;
};

// 일 범위 검사를 위한 윤년 여부 검사 함수
const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 != 0) || year % 400 === 0;
};

// 5. 생년월일 유효성 검사 함수
export const validateBirth = (birth: string): boolean | void => {
  const currentYear = new Date().getFullYear(); // 올해 연도

  // 1) YYYYWWDD 형식이 아닌 경우
  const regex = /^\d{8}$/;
  if (!regex.test(birth)) return alert('생년월일은 YYYYWWDD 형식으로 작성해야 합니다.');

  const year = parseInt(birth.substring(0, 4), 10);
  const month = parseInt(birth.substring(4, 6), 10);
  const day = parseInt(birth.substring(6, 8), 10);

  // 2) 연도 범위(1900년 ~ 올해연도-15)를 만족하지 않는 경우
  if (year < 1900 || year > currentYear - 15) return alert('연도(YYYY)를 정확히 입력해주세요.');

  // 3) 월 범위(01월 ~ 12월)를 만족하지 않는 경우
  if (month < 1 || month > 12) return alert('월(MM)을 정확히 입력해주세요.');

  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // 3) 일 범위(월에 따라서 30일 또는 31일, 2월은 윤년인지에 따라서 28일 또는 29일)를 만족하지 않는 경우
  if (day < 1 || day > daysInMonth[month - 1]) return alert('일(DD)을 정확히 입력해주세요.');

  return true;
};
