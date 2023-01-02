import {
  Accordion,
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  Group,
  JsonInput,
  Modal,
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
import { MIME_TYPES } from "@mantine/dropzone";
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

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      isDraft: true,
      isPublished: false,
      seo: {
        metaSocial: [
           {
            social: 'facebook'
          }
        ]
      }
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

  const socials = ["Facebook", "Twitter", "Instagram", "Pinterest"];

  return (
    <Container size={"xl"}>
      <Button onClick={() => setShowPreview((value) => !value)}>Preview</Button>
      <Modal
        fullScreen
        centered
        opened={showPreview}
        onClose={() => setShowPreview((value) => !value)}
      >
        <p>{form.values.title}</p>
        <DisplayContent />
      </Modal>
      <Flex gap={"md"}>
        <Box component="form" sx={{ flex: 2 }}>
          <Switch
            labelPosition="left"
            label="Save as Draft"
            size="md"
            radius="sm"
            defaultChecked={form.values.isDraft}
            {...form.getInputProps("isDraft")}
          />
          <Switch
            labelPosition="left"
            label="Published"
            size="md"
            radius="sm"
            defaultChecked={form.values.isPublished}
            {...form.getInputProps("isPublished")}
          />
          <DropzoneButton
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

          <Group position="right" mt="md">
            <Button onClick={createBlog}>Submit</Button>
          </Group>
        </Box>
        <ScrollArea style={{ height: "90vh" }} viewportRef={viewport}>
          {/* ... content */}
          <Stack sx={{ flex: 1 }}>
            <p>SEO</p>
            <TextInput withAsterisk label="Meta Title" placeholder="Title" />
            <TextInput
              withAsterisk
              label="Meta Description"
              placeholder="Description"
            />
            <DropzoneButton
              description="select a seo meta image for your blog"
              fileType="jpeg or png"
              maxSize={30 * 1024 ** 2}
              message="your seo image"
              mimeTypes={[MIME_TYPES.jpeg, MIME_TYPES.png]}
            />
            <Text>Meta Social</Text>

            <Box>
              <Accordion variant="separated">
                {socials.map((s) => (
                  <Accordion.Item key={s} className={classes.item} value={s}>
                    <Accordion.Control>{s}</Accordion.Control>
                    <Accordion.Panel>
                      <TextInput hidden withAsterisk value={s.toUpperCase()} />
                      <TextInput
                        withAsterisk
                        label="Title"
                        placeholder="Title"
                      />
                      <TextInput
                        withAsterisk
                        label="Description"
                        placeholder="Description"
                      />
                      <DropzoneButton
                        description="select a seo meta social image for your blog"
                        fileType="jpeg or png"
                        maxSize={30 * 1024 ** 2}
                        message="your seo image"
                        mimeTypes={[MIME_TYPES.jpeg, MIME_TYPES.png]}
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Box>
            <TextInput withAsterisk label="Keywords" placeholder="Keywords" />
            <JsonInput
              label="Structured json data"
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
