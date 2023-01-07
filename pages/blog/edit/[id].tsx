import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  Group,
  JsonInput,
  Modal,
  MultiSelect,
  ScrollArea,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { MIME_TYPES } from "@mantine/dropzone";
import { IconTrash } from "@tabler/icons";
import PreviewContent from "@components/PreviewContent";
import DropzoneButton from "@components/common/dropzone";
import { GetServerSideProps } from "next";
import client from "@lib/prismadb";
import { Blog, MetaSocial, Seo } from "@prisma/client";
import EditRTE from "@components/EditRTE";
import { useAtom } from "jotai";
import { contentAtom } from "@store/index";
import { serialize } from "@utils/prisma";

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
type BlogType = Blog & {
  seo:
    | (Seo & {
        metaSocial: MetaSocial[];
      })
    | null;
};
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
      seo: {
        metaTitle: data.seo?.metaTitle || "",
        metaDescription: data.seo?.metaDescription || "",
        metaImage: data.seo?.metaImage || "",
        metaSocial: data.seo?.metaSocial || [],
        keywords: data.seo?.keywords || [""],
        structuredData: data.seo?.structuredData || {},
        metaRobots: data.seo?.metaRobots || "",
        metaViewPort: data.seo?.metaViewPort || "",
        canonicalURL: data.seo?.canonicalURL || "",
      },
    },
    validateInputOnChange: true,
    validate: {
      title: (value) => (value.length <= 1 ? "Required" : null),
    },
  });

  useEffect(() => {
    form.setFieldValue("content", updatedContent);
    form.setFieldValue("isPublished", form.values.isDraft ? false : false);
    // form.setFieldValue("isDraft", !form.values.isPublished ? true : false);
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
  const { classes } = useStyles();
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "smooth",
    });

  const scrollToCenter = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight / 2,
      behavior: "smooth",
    });

  const scrollToTop = () =>
    viewport.current!.scrollTo({ top: 0, behavior: "smooth" });

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
              data={form.values.seo.keywords!}
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
            <Group position="center">
              <Button onClick={scrollToBottom} variant="outline">
                Scroll to bottom
              </Button>
              <Button onClick={scrollToCenter} variant="outline">
                Scroll to center
              </Button>
              <Button onClick={scrollToTop} variant="outline">
                Scroll to top
              </Button>
            </Group>
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
      include: {
        seo: {
          include: {
            metaSocial: {
              select: {
                title: true,
                description: true,
                image: true,
                socialNetwork: true,
              },
            },
          },
        },
      },
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
