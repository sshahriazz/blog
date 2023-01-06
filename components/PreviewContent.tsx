import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { contentAtom } from "../store";

const PreviewContent = () => {
  const [content] = useAtom(contentAtom);

  const editor = useEditor({
    editable: false,
    content: content,
    extensions: [StarterKit],
  });
  useEffect(() => {}, [content]);
  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default PreviewContent;
