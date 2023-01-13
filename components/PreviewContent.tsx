import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAtom } from "jotai";
import React from "react";
import { contentAtom } from "@store/index";

const PreviewContent = () => {
  const [content] = useAtom(contentAtom);

  const editor = useEditor({
    editable: false,
    content,
    extensions: [StarterKit],
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default React.memo(PreviewContent);
