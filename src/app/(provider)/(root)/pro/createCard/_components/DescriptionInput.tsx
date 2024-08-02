'use client';
import MDEditor, { commands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

interface DescriptionInputProps {
  description: any;
  setDescription: (description: string) => void;
}

export default function DescriptionInput({ description, setDescription }: DescriptionInputProps) {
  return (
    <div className="border-2 border-slate-400 mb-[20px] rounded-md" data-color-mode="light">
      {/* <textarea
        name="text"
        id="text"
        className="w-full h-[500px] p-5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea> */}
      <MDEditor height={700} value={description} onChange={setDescription} className="py-5" commands={[]} />
    </div>
  );
}
