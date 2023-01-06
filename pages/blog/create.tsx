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
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { contentAtom } from "../../store";
import { useForm } from "@mantine/form";
import RTE from "../../components/RTE";
import DisplayContent from "../../components/DisplayContent";
import DropzoneButton from "../../components/common/dropzone";
import { FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";
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

const Create = () => {
  const [content] = useAtom(contentAtom);
  const [showPreview, setShowPreview] = useState(false);
  const [data, setData] = useState([]);

  const form = useForm({
    initialValues: {
      title: "",
      image: "",
      content: "",
      isDraft: true,
      isPublished: false,
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
  useEffect(() => {
    form.setFieldValue("content", content);
    form.setFieldValue("isPublished", form.values.isDraft ? false : false);
    // form.setFieldValue("isDraft", !form.values.isPublished ? true : false);
  }, [content]);

  async function createBlog() {
    const error = form.validate();

    if (!error.hasErrors) {
      const formData = form.values;
      const res = await fetch("/api/blogs/blog", {
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

  // const socials = ["Facebook", "Twitter", "Instagram", "Pinterest"];
  const [bannerFiles, setBannerFiles] = useState<FileWithPath[]>([]);
  // form.setFieldValue("seo.metaSocial.{1}.metaImage", "hello");
  return (
    <Container size={"xl"}>
      <Modal
        fullScreen
        centered
        opened={showPreview}
        onClose={() => setShowPreview((value) => !value)}
      >
        <p>{form.values.title}</p>
        <DisplayContent />
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
          <Button onClick={createBlog}>Create Blog</Button>
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
            value={content}
            {...form.getInputProps("content")}
          />
          <RTE />

          {/* <Group position="right" mt="md">
            <Button onClick={createBlog}>Submit</Button>
          </Group> */}
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

export default Create;
