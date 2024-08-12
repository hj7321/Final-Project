
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

interface PostDescriptionProps {
  content : string
}

export default function PostDescription({ content }: PostDescriptionProps) {
  return (
    <div id="section1" className="p-2 md:my-2">
      <h1 className="md:text-2xl text-base mb-3 ">서비스 정보</h1>
      <div data-color-mode="light">
        <MDEditor.Markdown source={content} style={{ fontSize: '14px' }} />
      </div>
    </div>
  );
}
