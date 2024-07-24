import SignUpForm from "./_components/SignUpForm";


export default function SignUpPage() {
  return (
    <>
      {/* 기본적으로 signup 페이지로 들어가면 SignUpForm 컴포넌트만 보임 */}
      {/* SignUpForm 컴포넌트에서 유효성 검사를 모두 통과하고, 체크박스에 모두 체크하고 나서 회원가입 버튼을 클릭하면 SignUpForm 컴포넌트에서 SignUpComplete 컴포넌트로 전환됨 */}
      {/* 이때 SignUpForm 컴포넌트에서 작성한 회원정보를 SignUpComplete 컴포넌트로 가져가야 함 - 이걸 page.tsx에서 하면 되나? */}
      {/* SignUpComplete 컴포넌트에서 "예" 또는 "아니오" 버튼을 클릭하면 is_pro 정보가 저장됨 */}
      {/* 모든 정보를 data로 넣어서 action.tsx 파일에서 만든 signUp 함수를 호출함 */}
      <SignUpForm />
    </>
  );
}
