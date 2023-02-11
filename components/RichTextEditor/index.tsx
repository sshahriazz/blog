import React from "react";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import FloatingMenus from "./FloatingMenus";
import BubbleMenus from "./BubbleMenus";
import Toolbar from "./Toolbar";
import { Card } from "@mantine/core";
import { useAtom } from "jotai";
import { contentAtom } from "@store/index";

const RTEditor = function RTEditor() {
  const [data, setData] = useAtom(contentAtom);
  const editor = useEditor({
    extensions: [
      Link,
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: "Write your content" }),
    ],
    onUpdate: ({ editor }) => {
      setData(editor.getHTML());
    },
    content: data,
  });

  return (
    <Card shadow="xs" p="xs" radius="md" withBorder>
      <RichTextEditor
        styles={(theme) => ({
          control: {
            height: 43.4,
            width: 40,
            borderTop: "unset",
            borderBottom: "unset",
            borderRadius: "0 !important",
          },

          toolbar: {
            borderRadius: theme.radius.md,
            border: "1px solid #ced4da",
            padding: "unset",
            paddingLeft: theme.spacing.md,
          },
        })}
        sx={{ border: "unset" }}
        editor={editor}
      >
        {editor && <FloatingMenus editor={editor} />}
        {editor && <BubbleMenus editor={editor} />}
        <Card mb={"md"} p="xs" radius="md">
          <RichTextEditor.Content />
        </Card>

        <Toolbar />
      </RichTextEditor>
    </Card>
  );
};
export default React.memo(RTEditor);
