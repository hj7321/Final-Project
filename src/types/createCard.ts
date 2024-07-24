export interface TitleInputProps {
  title : string;
  setTitle : (title : string) => void
}
export interface LanguageSelectProps {
  language : string[]
  handleLanguageSelect : (lang : string) => void
  codeLang : string[]
}
export interface ImageUploadProps {
  images : File[]
  handleImageChange : (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImageDelete : (index: number) => void
}
export interface DescriptionInputProps {
  description : string
  setDescription : (description : string) => void
}
export interface SubmitButtonProps {
  handleSubmit : () => void
}
