import dynamic from "next/dynamic";
import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  createStyles,
  Flex,
  JsonInput,
  Loader,
  Modal,
  MultiSelect,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Select,
} from "@mantine/core";
import { useAtom } from "jotai";
import React, { useMemo, useRef, useState } from "react";
import { contentAtom } from "@store/index";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { MIME_TYPES } from "@mantine/dropzone";
import client from "@lib/prismadb";

const RTE = dynamic(() => import("@components/RTE"));
const DropzoneButton = dynamic(() => import("@components/common/dropzone"), {
  ssr: false,
  loading: () => <Loader />,
});
const PreviewContent = dynamic(() => import("@components/PreviewContent"));
const BlogLayout = dynamic(() => import("@components/layout/blog-layout"));

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    minHeight: 650,
  },

  title: {
    marginBottom: theme.spacing.xl * 1.5,
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,

    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

const Create = (props: any) => {
  const [content] = useAtom(contentAtom);
  const [showPreview, setShowPreview] = useState(false);
  const [data, setData] = useState(props.tags || []);

  const form = useForm({
    initialValues: {
      title: "",
      image: "",
      content: "",
      isDraft: true,
      isPublished: false,
      tags: [""],
      category: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaImage: "",
        metaSocial: [
          {
            title: "",
            description: "",
            image: "",
            socialNetwork: "",
          },
        ],
        keywords: [],
        structuredData: {},
        metaRobots: "",
        metaViewPort: "",
        canonicalURL: "",
      },
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
    form.setFieldValue("isPublished", true);
    form.setFieldValue("isDraft", false);
    const error = form.validate();

    if (!error.hasErrors) {
      await fetch("/api/blogs/blog", {
        method: "POST",
        body: JSON.stringify(form.values),
      }).then(async (res) => {
        if (res.status === 200) {
          console.log("blog created");
          push(`/blog/my-blogs`);
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
          push(`/blog/my-blogs`);
          showNotification({
            title: "Blog Created",
            message: "Your blog has been created as draft",
          });
        }
      });
    }
  }
  const { classes } = useStyles();
  const viewport = useRef<HTMLDivElement>(null);

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
            withAsterisk
            label="Title"
            placeholder="Title"
            {...form.getInputProps("title")}
          />
          <Select
            label="Category"
            searchable
            clearable
            placeholder="Pick one"
            {...form.getInputProps("category")}
            data={props?.categories || []}
          />
          <MultiSelect
            searchable
            clearable
            {...form.getInputProps("tags")}
            data={data || []}
            label="Tags"
            placeholder="Pick one or more"
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setData((current: any) => [...current, item]);

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
            <Text>Meta Social</Text>
            <Accordion variant="separated">
              {form.values.seo.metaSocial.map((s, index) => (
                <Accordion.Item
                  key={index}
                  className={classes.item}
                  value={index.toString()}
                >
                  <Flex align="center">
                    <Accordion.Control>
                      <Flex justify={"space-between"}>
                        <Text>Social: {index + 1}</Text>
                      </Flex>
                    </Accordion.Control>
                    <ActionIcon
                      mr={"sm"}
                      color="red"
                      onClick={() =>
                        form.removeListItem("seo.metaSocial", index)
                      }
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Flex>

                  <Accordion.Panel>
                    <Box>
                      <TextInput
                        {...form.getInputProps(
                          `seo.metaSocial.${index}.socialNetwork`
                        )}
                        label="Social Network"
                        placeholder="Add Social network"
                        withAsterisk
                        // value={s.socialNetwork.toUpperCase()}
                      />
                      <TextInput
                        {...form.getInputProps(`seo.metaSocial.${index}.title`)}
                        withAsterisk
                        label="Title"
                        placeholder="Title"
                      />
                      <TextInput
                        {...form.getInputProps(
                          `seo.metaSocial.${index}.description`
                        )}
                        withAsterisk
                        label="Description"
                        placeholder="Description"
                      />
                      <DropzoneButton
                        previewSize={{ height: 200, width: "100%" }}
                        form={form}
                        dataLocation={`seo.metaSocial.${index}.image`}
                        description="select a seo meta social image for your blog"
                        fileType="jpeg or png"
                        maxSize={30 * 1024 ** 2}
                        message="your seo image"
                        mimeTypes={[MIME_TYPES.jpeg, MIME_TYPES.png]}
                      />
                    </Box>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
            <Button
              onClick={() =>
                form.insertListItem("seo.metaSocial", {
                  title: "",
                  description: "",
                  image: "",
                  socialNetwork: "",
                })
              }
            >
              Add Social
            </Button>
            <TextInput
              {...form.getInputProps(`seo.metaRobots`)}
              withAsterisk
              label="Robots"
              placeholder="Robots"
            />
            <TextInput
              {...form.getInputProps(`seo.metaViewPort`)}
              withAsterisk
              label="Viewport"
              placeholder="ViewPort"
            />
            <TextInput
              {...form.getInputProps(`seo.canonicalURL`)}
              withAsterisk
              label="Canonical URL"
              placeholder="Canonical URL"
            />
            <MultiSelect
              label="Keywords"
              data={form.values.seo.keywords}
              placeholder="add keywords"
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              {...form.getInputProps("seo.keywords")}
            />
            <JsonInput
              label="Structured json data"
              {...form.getInputProps("seo.structuredData")}
              placeholder="Textarea will autosize to fit the content"
              validationError="Invalid json"
              formatOnBlur
              minRows={4}
            />
          </Stack>
        </ScrollArea>
      </Flex>
    </BlogLayout>
  );
};

export default Create;

export async function getServerSideProps() {
  const tags = await client.tag.findMany();
  const category = await client.category.findMany();

  return {
    props: {
      tags: tags.map((t) => ({ value: t.name, label: t.name })),
      categories: category.map((c) => ({ value: c.name, label: c.name })),
    },
  };
}
