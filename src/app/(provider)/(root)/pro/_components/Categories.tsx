"use client"

import { CodeCategories } from "@/components/dumy"
import Image from "next/image"

interface CategoriesProps {
  handleLanguageFilter : (lang : string) => void;
  selectedLanguages : string[]
}

export default function Categories( {handleLanguageFilter, selectedLanguages } : CategoriesProps ) {
  return (
    <div className=" md:mt-[30px] mt-[30px] mx-auto overflow-hidden">
    <ul className="flex flex-row justify-start items-center max-w-7xl mx-auto lg:justify-between lg:flex-wrap lg:overflow-visible overflow-x-auto scrollbar-hide">
      {CodeCategories.map((lang) => (
        <li
          className="md:mx-[10px] mx-[5px] flex-col justify-center items-center hover:cursor-pointer flex-shrink-0 w-[80px] sm:w-[100px] md:w-[120px] lg:w-auto"
          key={lang.id}
          onClick={() => handleLanguageFilter(lang.name)}
        >
          <Image
            className="md:w-[80px] md:h-[80px] w-[54px] h-[54px] mb-[10px] mx-auto"
            src={lang.categoryImage}
            width={80}
            height={80}
            priority
            alt={lang.name}
          />
          <p
            className={`text-center w-full ${
              selectedLanguages.includes(lang.name) ? 'text-blue-500' : 'text-black-500'
            } md:text-base text-xs`}
          >
            {lang.name}
          </p>
        </li>
      ))}
    </ul>
  </div>
  )
}