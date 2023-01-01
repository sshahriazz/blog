import {
  Button,
  Container,
  Group,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { contentAtom } from "../../store";
// const RTE = dynamic(() => import("../../components/RTE"), { ssr: false });
import { useForm } from "@mantine/form";
import RTE from "../../components/RTE";

const Create = () => {
  const [content] = useAtom(contentAtom);

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      isDraft: true,
      isPublished: false,
    },
  });
  useEffect(() => {
    form.setFieldValue("content", content);
  }, [content]);

  async function createBlog() {
    const formData = form.values;
    console.log(formData);

    const res = await fetch("/api/blogs/blog", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    console.log(json);
  }
  return (
    <Container>
      <form>
        <Switch
          labelPosition="left"
          label="Save as Draft"
          size="md"
          radius="sm"
          {...form.getInputProps("isDraft")}
        />
        <Switch
          labelPosition="left"
          label="Published"
          size="md"
          radius="sm"
          {...form.getInputProps("isPublished")}
        />
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Title"
          {...form.getInputProps("title")}
        />
        <TextInput
          withAsterisk
          hidden
          label="Content"
          placeholder="Content"
          value={content}
          {...form.getInputProps("content")}
        />
        <RTE />

        <Group position="right" mt="md">
          <Button onClick={createBlog}>Submit</Button>
        </Group>
      </form>
    </Container>
  );
};

export default Create;
