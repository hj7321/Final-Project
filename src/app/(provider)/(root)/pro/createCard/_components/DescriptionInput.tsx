
import { DescriptionInputProps } from "@/types/createCard"

export default function DescriptionInput({description, setDescription} : DescriptionInputProps) {
  return (
    <div className="border-2 border-slate-400 mb-[20px] rounded-md">
      <textarea
        name="text"
        id="text"
        className="w-full h-[500px] p-5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>
  )
}