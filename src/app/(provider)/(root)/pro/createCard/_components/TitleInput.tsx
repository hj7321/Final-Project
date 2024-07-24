
import { TitleInputProps } from "@/types/createCrad"

export default function TitleInput({ title, setTitle}: TitleInputProps) {
  return (
    <div className="mb-[20px]">
      <input
        type="text"
        className="w-full border-2 p-4 rounded-md border-slate-400"
        placeholder="제목을 입력해주세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}
