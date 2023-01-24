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
  console.log(props.tags);

  const [content] = useAtom(contentAtom);
  const [showPreview, setShowPreview] = useState(false);
  const [data, setData] = useState(
    props.tags.map((t) => ({
      value: "#" + t?.value,
      label: "#" + t?.label,
    })) || []
  );
  console.log(props.tags.map((t: string) => "#" + t));

  const form = useForm({
    initialValues: {
      title: "",
      image: null,
      content: "",
      isDraft: true,
      isPublished: false,
      tags: [""],
    },
    validateInputOnChange: true,
    validate: {
      title: (value) => (value.length <= 1 ? "Required" : null),
    },
  });
  console.log(form.values);

  const { push } = useRouter();
  useMemo(() => {
    form.setFieldValue("content", content);
  }, [content]);

  async function publishBlog() {
    form.setFieldValue("isPublished", true);
    form.setFieldValue("isDraft", false);
    const formData = new FormData();

    const error = form.validate();

    if (!error.hasErrors) {
      formData.append("image", form.values.image!);
      formData.append("title", form.values.title);
      formData.append("content", form.values.content);
      formData.append("isPublished", form.values.isPublished.toString());
      formData.append("isDraft", form.values.isDraft.toString());
      formData.append("tags", JSON.stringify(form.values.tags));
      await fetch("/api/blogs/blog", {
        method: "POST",

        body: formData,
      }).then(async (res) => {
        if (res.status === 200) {
          console.log("blog created");
          // push(`/blog/my-blogs`);
          showNotification({
            title: "Blog Created",
            message: "Your blog has been created and published successfully",
          });
        }
      });
    }
  }
  async function createDraftBlog() {
    const error = form.validate();
    form.setFieldValue("isPublished", false);
    form.setFieldValue("isDraft", true);
    if (!error.hasErrors) {
      await fetch("/api/blogs/blog", {
        method: "POST",
        body: JSON.stringify(form.values),
      }).then(async (res) => {
        if (res.status === 200) {
          console.log("blog created");
          // push(`/blog/my-blogs`);
          showNotification({
            title: "Blog Created",
            message: "Your blog has been created as draft",
          });
        }
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
          <Button onClick={createDraftBlog}>Create Draft</Button>
        </Flex>
      </Flex>
      <Flex gap={"md"}>
        <Box sx={{ flex: 2 }}>
          <DropzoneButton
            previewSize={{ height: 250, width: "100%" }}
            form={form}
            dataLocation={`image`}
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
