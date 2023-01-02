import { useRef, useState } from "react";
import {
  Text,
  Group,
  Button,
  createStyles,
  Image,
  SimpleGrid,
} from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: 250,
    left: "calc(50% - 125px)",
    bottom: -20,
  },
}));

const DropzoneButton = ({
  description,
  fileType,
  message,
  maxSize,
  mimeTypes,
}: {
  description: string;
  fileType: string;
  message: string;
  maxSize: number;
  mimeTypes: string[];
}) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        alt="crap"
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  return (
    <div className={classes.wrapper}>
      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        mt={previews.length > 0 ? "xl" : 0}
      >
        {previews}
      </SimpleGrid>
      <Dropzone
        openRef={openRef}
        onDrop={setFiles}
        className={classes.dropzone}
        radius="md"
        accept={mimeTypes}
        maxSize={maxSize}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={50}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={50}
                color={
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black
                }
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text align="center" weight={700} size="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>{fileType} file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload {message}</Dropzone.Idle>
          </Text>
          <Text align="center" size="sm" mt="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Dropzone>

      <Button
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current?.()}
      >
        Select files
      </Button>
    </div>
  );
};
export default DropzoneButton;
