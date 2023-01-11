import { useEffect, useRef, useState } from "react";
import {
  Text,
  Group,
  Button,
  createStyles,
  Image,
  Stack,
  Box,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: 10,
    marginTop: 10,
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
  form,
  dataLocation,
  previewSize,
}: {
  description: string;
  fileType: string;
  message: string;
  maxSize: number;
  mimeTypes: string[];
  form: any;
  dataLocation: string;
  previewSize: { height: number | string; width: number | string };
}) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const { classes, theme } = useStyles();
  const [showDropzone, setShowDropzone] = useState(true);
  const openRef = useRef<() => void>(null);
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);

    return (
      <Stack key={index}>
        <Image
          fit="cover"
          alt="crap"
          width={previewSize.width}
          height={previewSize.height}
          src={imageUrl}
          imageProps={{
            onLoad: () => {
              URL.revokeObjectURL(imageUrl);
            },
          }}
        />
        <Button
          onClick={() => {
            setFiles([]);
            setShowDropzone(true);
          }}
        >
          Remove
        </Button>
      </Stack>
    );
  });

  useEffect(() => {
    if (previews.length > 0) {
      setShowDropzone(false);
    }
  }, [previews]);

  return (
    <div className={classes.wrapper}>
      {!showDropzone && <Box>{previews}</Box>}
      {showDropzone && (
        <>
          <Dropzone
            openRef={openRef}
            onDrop={(e) => {
              const imageUrl = URL.createObjectURL(e[0]);
              setFiles(e);

              form.setFieldValue(dataLocation, imageUrl);
            }}
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
                <Dropzone.Reject>
                  {fileType} file less than 30mb
                </Dropzone.Reject>
                <Dropzone.Idle>Upload {message}</Dropzone.Idle>
              </Text>
              <Text align="center" size="sm" mt="xs" color="dimmed">
                {description}
              </Text>
            </div>
          </Dropzone>

          {/* <Button
            className={classes.control}
            size="md"
            radius="xl"
            onClick={() => openRef.current?.()}
          >
            Select files
          </Button> */}
        </>
      )}
    </div>
  );
};
export default DropzoneButton;
