import dynamic from "next/dynamic";
import {
  Button,
  Card,
  Flex,
  Loader,
  MultiSelect,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import { contentAtom } from "@store/index";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { MIME_TYPES } from "@mantine/dropzone";
import client from "@lib/prismadb";
import { showNotification } from "@mantine/notifications";
import RichTextEditor from "@components/RichTextEditor";
import AnimatedComponent from "@components/common/AnimatedComponent";

const DropzoneButton = dynamic(() => import("@components/common/dropzone"), {
  ssr: false,
  loading: () => <Loader />,
});
const BlogLayout = dynamic(() => import("@components/layout/blog-layout"));

const Create = (props: any) => {
  const [content] = useAtom(contentAtom);
  const [data, setData] = useState(
    props.tags.map((t: { value: string; label: string }) => ({
      value: "#" + t?.value.replace("#", ""),
      label: "#" + t?.label.replace("#", ""),
    }))
  );

  const form = useForm({
    initialValues: {
      title: "",
      cover: null,
      content: "",
      published: false,
      tags: [""],
    },
    validateInputOnChange: true,
    validate: {
      title: (value) => (value.length <= 1 ? "Required" : null),
    },
  });

  const { push } = useRouter();
  useMemo(() => {
    form.setFieldValue("content", content);
    console.log(form.values.content);
  }, [content]);

  async function publishBlog() {
    const formData = new FormData();
    const { cover, ...rest } = form.values;
    const error = form.validate();

    if (!error.hasErrors) {
      formData.append("cover", form.values.cover!);

      await fetch("/api/upload", {
        method: "POST",

        body: formData,
      })
        .then(async (res) => {
          const { data } = await res.json();
          if (res.status === 200) {
            await fetch("/api/blogs/blog", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...rest,
                cover: data.url,
              }),
            })
              .then((res) => {
                if (res.status === 200) {
                  showNotification({
                    title: "Blog Created",
                    message: "Your blog has been created as draft",
                  });
                }
              })
              .catch((err) => {
                showNotification({
                  title: "Blog Creation failed",
                  message:
                    "Your blog has been created and published successfully",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const [clickedElement, setClickedElement] = useState<HTMLDivElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setClickedElement(event.currentTarget);
  };

  return (
    <BlogLayout>
      <Stack maw={{ sm: "100%", md: "70%" }}>
        <DropzoneButton
          previewSize={{ height: 250, width: "100%" }}
          form={form}
          dataLocation={`cover`}
          description="select a banner image for your blog"
          fileType="jpeg or png"
          maxSize={30 * 1024 ** 2}
          message="your banner image"
          mimeTypes={[MIME_TYPES.jpeg, MIME_TYPES.png]}
        />
        <Card
          withBorder
          shadow={"sm"}
          display={{ sm: "none", md: "block" }}
          sx={{
            position: "fixed",
            zIndex: 9999,
            right: "26%",
            top: 85,
          }}
        >
          <Text>Test</Text>
        </Card>
        <div onClick={handleClick}>
          <TextInput
            fz={30}
            styles={{
              input: { border: "none", fontSize: "1.5rem", fontWeight: 700 },
            }}
            withAsterisk
            placeholder="Title"
            {...form.getInputProps("title")}
          />
        </div>

        <div onClick={handleClick}>
          <MultiSelect
            mt={16}
            styles={{
              input: { border: "none" },
            }}
            searchable
            clearable
            {...form.getInputProps("tags")}
            data={data || []}
            placeholder="Pick one or more"
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: "#" + query, label: "#" + query };
              setData((current: any) => [...current, item]);

              return item;
            }}
          />
        </div>
        <TextInput
          mt={"md"}
          withAsterisk
          hidden
          placeholder="Content"
          {...form.getInputProps("content")}
        />
        <div onClick={handleClick}>
          <RichTextEditor />
        </div>
        <Card
          withBorder
          component={Flex}
          align="center"
          justify={"end"}
          gap={3}
          mt={"md"}
        >
          <Text>Saved as draft</Text>
          <Flex gap={"md"}>
            <Button onClick={publishBlog}>Publish Blog</Button>
          </Flex>
        </Card>
      </Stack>

      {clickedElement && <AnimatedComponent targetRef={clickedElement} />}
    </BlogLayout>
  );
};

export default Create;

export async function getServerSideProps() {
  const tags = await client.tag.findMany();

  return {
    props: {
      tags: tags.map((t) => ({ value: t.name, label: t.name })),
    },
  };
}
