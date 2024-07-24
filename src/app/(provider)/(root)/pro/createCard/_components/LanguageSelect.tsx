interface LanguageSelectProps {
  language : string[]
  handleLanguageSelect : (lang : string) => void
  codeLang : string[]
}

export default function LanguageSelect({codeLang, language, handleLanguageSelect}: LanguageSelectProps) {
  return (
    <div className="mb-[20px] border-2 border-slate-400 rounded-md">
      <div className="p-4">
        <p className="ml-7 text-lg">언어 선택(중복가능)</p>
        <div className="flex flex-row px-4 flex-wrap items-center">
          {codeLang.map((lang:string, index:number) => (
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]" key={index}>
              <input
                type="checkbox"
                name={lang}
                id={lang}
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                checked={language.includes(lang)}
                onChange={() => handleLanguageSelect(lang)}
              />
              <p className="ml-2">{lang}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}