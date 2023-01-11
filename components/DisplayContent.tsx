import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

const DisplayContent = ({ content }: { content: any }) => {
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

export default DisplayContent;
