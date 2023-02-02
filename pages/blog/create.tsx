import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Flex,
  Loader,
  Modal,
  MultiSelect,
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

const RTE = dynamic(() => import("@components/RTE"));
const DropzoneButton = dynamic(() => import("@components/common/dropzone"), {
  ssr: false,
  loading: () => <Loader />,
});
const PreviewContent = dynamic(() => import("@components/PreviewContent"));
const BlogLayout = dynamic(() => import("@components/layout/blog-layout"));

const Create = (props: any) => {
  const [content] = useAtom(contentAtom);
  const [showPreview, setShowPreview] = useState(false);
  const [data, setData] = useState(
    props.tags.map((t: { value: string; label: string }) => ({
      value: "#" + t?.value,
      label: "#" + t?.label,
    })) || []
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
          if (res.status === 200) {
            await fetch("/api/blog", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...rest,
                cover: await res.json().then((res) => res.data.url),
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

  return (
    <BlogLayout>
      <Modal
        fullScreen
        centered
        opened={showPreview}
        onClose={() => setShowPreview((value) => !value)}
      >
        <p>{form.values.title}</p>
        <PreviewContent />
      </Modal>

      <Flex justify={"end"}>
        <Flex gap={"md"}>
          <Button onClick={() => setShowPreview((value) => !value)}>
            Preview Blog
          </Button>
          <Button onClick={publishBlog}>Publish Blog</Button>
        </Flex>
      </Flex>
      <Flex gap={"md"}>
        <Box sx={{ flex: 2 }}>
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

          <TextInput
            fz={30}
            styles={{
              input: { border: "none", fontSize: "1.5rem", fontWeight: 700 },
            }}
            withAsterisk
            placeholder="Title"
            {...form.getInputProps("title")}
          />

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
              const item = { value: query, label: query };
              setData((current: any) => [
                ...current,
                {
                  label: "#" + item.label.replace("#", ""),
                  value: "#" + item.value.replace("#", ""),
                },
              ]);

              return item;
            }}
          />
          <TextInput
            withAsterisk
            hidden
            label="Content"
            placeholder="Content"
            {...form.getInputProps("content")}
          />
          <RTE />
        </Box>
      </Flex>
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
