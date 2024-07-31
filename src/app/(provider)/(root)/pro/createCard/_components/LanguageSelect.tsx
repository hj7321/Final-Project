import { CodeCategories } from "@/components/dumy"

interface LanguageSelectProps {
  language : string[]
  handleLanguageSelect : (lang : string) => void
}

export default function LanguageSelect({language, handleLanguageSelect}: LanguageSelectProps) {
  return (
    <div className="mb-[20px] border-2 border-slate-400 rounded-md">
      <div className="p-4">
        <p className="ml-7 text-lg">언어 선택(중복가능)</p>
        <div className="flex flex-row px-4 flex-wrap items-center">
          {
            CodeCategories.map((lang, index) => (
              <div className="flex justify-start items-center mx-5 my-3 w-[150px]" key={index}>
                <input 
                  type="checkbox"
                  name={lang.name}
                  id={lang.name}
                  className="hidden" 
                  checked={language.includes(lang.name)} 
                  onChange={() => handleLanguageSelect(lang.name)}
                />
                <label htmlFor={lang.name} className={`cursor-pointer flex items-center ${language.includes(lang.name) ? 'text-primary-600' : 'text-gray-500'}`}>
                  <img src={language.includes(lang.name) ? lang.image : lang.darkImage} alt={lang.name} className="w-[20px] h-[20px]" />
                  <p className="ml-2">{lang.name}</p>
                </label>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}