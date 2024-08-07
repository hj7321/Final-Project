interface TitleInputProps {
  title : string;
  setTitle : (title : string) => void
}

export default function TitleInput({ title, setTitle}: TitleInputProps) {
  return (
    <div className="mb-[20px]">
      <input
        type="text"
        className="w-full border-2 md:p-4 p-3 rounded-md border-slate-400 md:text-base text-sm"
        placeholder="제목을 입력해주세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}
