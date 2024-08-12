'use client'

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CodeCategories } from "@/components/dumy";


export default function useProMain() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const route = useRouter();


  const handleLanguageFilter = useCallback(
    (lang: string) => {
      const newSelectedLanguages = selectedLanguages.includes(lang)
        ? selectedLanguages.filter((l) => l !== lang)
        : [...selectedLanguages, lang];

      setSelectedLanguages(newSelectedLanguages);
    },
    [selectedLanguages]
  );

  const handleNavigation = useCallback(() => {
    route.push('/pro/createCard');
  }, [route]);

  const getCategoryImage = useCallback((categoryName: string) => {
    const category = CodeCategories.find((cat) => cat.name === categoryName);
    return category ? category.image : '/default_image.svg';
  }, []);

  return {
    selectedLanguages,
    setSelectedLanguages,
    route,
    handleLanguageFilter,
    handleNavigation,
    getCategoryImage
  }
}