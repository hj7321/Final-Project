import { CodeCategories } from "@/components/dumy"
import Image from "next/image"
import React from "react"
import bookmark_dark from '../../../../../../../../public/bookmark_dark.svg'
interface ServiceDeskTopViewProps {
  title : string
  langCategory : string[]
  price : number
}

export default function ServiceDeskTopView({title, langCategory, price} : ServiceDeskTopViewProps) {
  return (
    <div className="hidden md:block flex flex-col mt-[15px] md:ml-4">
      <p className="text-base md:text-2xl">{title}</p>
      <p className="text-xs mt-1 flex flex-row flex-wrap">
        {langCategory.map((lang) => {
          const category = CodeCategories.find((cat) => cat.name === lang);
          return category ? (
            <React.Fragment key={category.id}>
              <Image src={category.image} width={15} height={15} alt={lang} className="mr-1 mt-2" />
              <span className="mr-3 mt-2">{lang}</span>
            </React.Fragment>
          ) : null;
        })}
      </p>
      <div className="flex-row flex items-center">
        <p className="text-base md:text-xl mt-2">{price}원</p>
        <span className="mt-2 ml-2"><Image src={bookmark_dark} width={15} height={15} alt="북마크 이미지" /></span>
      </div>
    </div>
  )
}