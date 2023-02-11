import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Flex,
  Loader,
  Modal,
  Switch,
  TextInput,
} from "@mantine/core";
import React, { useMemo, useState } from "react";
import { useForm } from "@mantine/form";
import { MIME_TYPES } from "@mantine/dropzone";
const PreviewContent = dynamic(() => import("@components/PreviewContent"));
const DropzoneButton = dynamic(() => import("@components/common/dropzone"), {
  ssr: false,
  loading: () => <Loader />,
});
import { GetServerSideProps } from "next";
import client from "@lib/prismadb";
import { Blog } from "@prisma/client";
const EditRTE = dynamic(() => import("@components/EditRTE"));
import { useAtom } from "jotai";
import { contentAtom } from "@store/index";
import { serialize } from "@utils/prisma";

type BlogType = Blog;
const Page = ({ data }: { data: BlogType }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [updatedContent] = useAtom(contentAtom);

  const form = useForm({
    initialValues: {
      title: data.title,
      image: data.cover,
      content: data.content.toString(),
      published: data.published,
    },
    validateInputOnChange: true,
    validate: {
      title: (value) => (value.length <= 1 ? "Required" : null),
    },
  });

  useMemo(() => {
    form.setFieldValue("content", updatedContent);
  }, [updatedContent]);

  async function createBlog() {
    const error = form.validate();

    if (!error.hasErrors) {
      const formData = form.values;
      const res = await fetch(`/api/blogs/update?id=${data.id}`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const json = await res.json();
    }
  }

  return (
    <Container size={"xl"}>
      <Modal
        fullScreen
        centered
        opened={showPreview}
        onClose={() => setShowPreview((value) => !value)}
      >
        <p>{form.values.title}</p>
        <PreviewContent />
      </Modal>

      <Flex justify={"space-between"}>
        <Flex>
          <Switch
            labelPosition="left"
            label="Publish Blog"
            size="md"
            radius="sm"
            {...form.getInputProps("published")}
          />
        </Flex>
        <Flex gap={"md"}>
          <Button onClick={() => setShowPreview((value) => !value)}>
            Preview Blog
          </Button>
          <Button onClick={createBlog}>Update Blog</Button>
          <Button>Delete Blog</Button>
        </Flex>
      </Flex>
      <Box sx={{ flex: 2 }}>
        <DropzoneButton
          previewLink={data.cover!}
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
          {...form.getInputProps("content")}
        />
        <EditRTE content={form.values.content} />
      </Box>
    </Container>
  );
};

export default Page;
export const getServerSideProps: GetServerSideProps<{
  data: any;
}> = async (ctx) => {
  const { params } = ctx;

  if (params?.id) {
    const data = await client.blog.findUnique({
      where: { id: params?.id as string },
    });

    return {
      props: {
        data: serialize(data),
      },
    };
  } else {
    return {
      props: {
        data: {},
      },
    };
  }
};
