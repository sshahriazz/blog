import React from "react";
import { RichTextEditor } from "@mantine/tiptap";

const Toolbar = () => {
  return (
    <RichTextEditor.Toolbar sticky stickyOffset={60}>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
        <RichTextEditor.Subscript />
        <RichTextEditor.Superscript />
      </RichTextEditor.ControlsGroup>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Strikethrough />
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Highlight />
        <RichTextEditor.Code />
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
        <RichTextEditor.Hr />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>
  );
};
export default Toolbar;
