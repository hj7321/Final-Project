interface UserDescriptionProp {
  introduction : string;
}

export default function UserDescription({ introduction } : UserDescriptionProp) {
  return (
    <div className="mx-auto md:mt-5 my-3">
      <p className="md:w-[30ch] w-full md:min-h-[70px] md:line-clamp-3 md:text-base text-xs text-grey-500 line-clamp-2">
        {
          introduction ? introduction : '프로젝트에 대한 요구사항을 함께 논의하고, 최적의 솔루션을 제공하겠습니다. 언제든지 문의해 주세요!'
        }
      </p>
    </div>
  );
}
