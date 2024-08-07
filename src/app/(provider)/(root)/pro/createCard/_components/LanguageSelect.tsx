import { CodeCategories } from "@/components/dumy"

interface LanguageSelectProps {
  language : string[]
  handleLanguageSelect : (lang : string) => void
}

export default function LanguageSelect({language, handleLanguageSelect}: LanguageSelectProps) {
  return (
    <div className="mb-[20px] border-2 border-slate-400 rounded-md">
      <div className="md:p-4 p-2">
        <p className="md:ml-7 ml-2 md:text-lg text-base">언어 선택(중복가능)</p>
        <div className="flex flex-row md:px-4 px-2 flex-wrap items-center">
          {
            CodeCategories.map((lang, index) => (
              <div className="md:flex justify-start items-center mx-5 my-3 md:w-[150px] w-[100px]" key={index}>
                <input 
                  type="checkbox"
                  name={lang.name}
                  id={lang.name}
                  className="hidden" 
                  checked={language.includes(lang.name)} 
                  onChange={() => handleLanguageSelect(lang.name)}
                />
                <label htmlFor={lang.name} className={`cursor-pointer flex items-center ${language.includes(lang.name) ? 'text-primary-600' : 'text-gray-500'}`}>
                  <img src={language.includes(lang.name) ? lang.image : lang.darkImage} alt={lang.name} className="md:w-[20px] md:h-[20px] w-[14px] h-[14px]" />
                  <p className="ml-2 md:text-base text-sm">{lang.name}</p>
                </label>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}