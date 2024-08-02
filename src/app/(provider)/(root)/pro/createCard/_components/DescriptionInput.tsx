'use client'
import MDEditor, { commands } from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '../../../../../../css/mdStyle.css'

interface DescriptionInputProps {
  description : string
  setDescription : (description : any) => void
}

export default function DescriptionInput({description, setDescription} : DescriptionInputProps) {
  return (
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
    </div>
  )
}