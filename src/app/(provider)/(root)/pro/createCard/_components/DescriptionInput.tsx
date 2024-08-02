<<<<<<< HEAD
'use client'
import MDEditor, { commands } from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '../../../../../../css/mdStyle.css'
=======
'use client';
import MDEditor, { commands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
>>>>>>> 7a8946630bb91c7e3a833cf04b53f2619392a693

interface DescriptionInputProps {
  description : string
  setDescription : (description : any) => void
}

export default function DescriptionInput({ description, setDescription }: DescriptionInputProps) {
  return (
<<<<<<< HEAD
    <div className="border-2 border-slate-400 mb-[20px] rounded-md" data-color-mode='light'>
      <MDEditor height={700} value={description} onChange={setDescription}
        commands={[
          commands.title1,
          commands.title2,
          commands.title3,
          commands.divider,
          commands.bold,
          commands.italic,
          commands.divider,
          commands.orderedListCommand,
          commands.unorderedListCommand,
          commands.divider,
          commands.code,
          commands.quote
        ]}
      />
=======
    <div className="border-2 border-slate-400 mb-[20px] rounded-md" data-color-mode="light">
      {/* <textarea
        name="text"
        id="text"
        className="w-full h-[500px] p-5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea> */}
      <MDEditor height={700} value={description} onChange={setDescription} className="py-5" commands={[]} />
>>>>>>> 7a8946630bb91c7e3a833cf04b53f2619392a693
    </div>
  );
}
