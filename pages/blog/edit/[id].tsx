import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Flex,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useMemo, useRef, useState } from "react";
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
      image: data.coverImage,
      content: data.content.toString(),
      isDraft: data.isDraft,
      isPublished: data.isPublished,
    },
    validateInputOnChange: true,
    validate: {
      title: (value) => (value.length <= 1 ? "Required" : null),
    },
  });

  useMemo(() => {
    form.setFieldValue("content", updatedContent);
    form.setFieldValue("isPublished", form.values.isDraft ? false : false);
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
      console.log(json);
    }
  }
  const viewport = useRef<HTMLDivElement>(null);

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
            label="Keep it as draft"
            size="md"
            radius="sm"
            disabled={form.values.isPublished}
            defaultChecked={form.values.isDraft}
            {...form.getInputProps("isDraft")}
          />
          <Switch
            labelPosition="left"
            disabled={form.values.isDraft}
            label="Publish Blog"
            size="md"
            radius="sm"
            defaultChecked={form.values.isPublished}
            {...form.getInputProps("isPublished")}
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
        <ScrollArea
          style={{ height: "90vh" }}
          viewportRef={viewport}
          type="hover"
          offsetScrollbars
        >
          <Stack sx={{ flex: 1 }}>
            <Text>SEO</Text>
            <TextInput
              withAsterisk
              label="Meta Title"
              {...form.getInputProps("seo.metaTitle")}
              placeholder="Title"
            />
            <TextInput
              withAsterisk
              {...form.getInputProps("seo.metaDescription")}
              label="Meta Description"
              placeholder="Description"
            />
            <DropzoneButton
              previewSize={{ height: 200, width: "100%" }}
              form={form}
              dataLocation={`seo.metaImage`}
              description="select a seo meta image for your blog"
              fileType="jpeg or png"
              maxSize={30 * 1024 ** 2}
              message="your seo image"
              mimeTypes={[MIME_TYPES.jpeg, MIME_TYPES.png]}
            />
          </Stack>
        </ScrollArea>
      </Flex>
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
