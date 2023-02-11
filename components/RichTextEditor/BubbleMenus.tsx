import React from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { BubbleMenu, Editor } from "@tiptap/react";

const BubbleMenus = ({ editor }: { editor: Editor }) => {
  return (
    <BubbleMenu editor={editor}>
      <RichTextEditor.ControlsGroup
        sx={{
          background: "white",
          borderBottom: "1px solid #ced4da",
          borderTop: "1px solid #ced4da",
        }}
      >
        <RichTextEditor.ColorPicker
          colors={[
            "#25262b",
            "#868e96",
            "#fa5252",
            "#e64980",
            "#be4bdb",
            "#7950f2",
            "#4c6ef5",
            "#228be6",
            "#15aabf",
            "#12b886",
            "#40c057",
            "#82c91e",
            "#fab005",
            "#fd7e14",
          ]}
        />
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strikethrough />

        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
      </RichTextEditor.ControlsGroup>
    </BubbleMenu>
  );
};
export default BubbleMenus;
