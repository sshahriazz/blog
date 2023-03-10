import {
  createStyles,
  Card,
  Image,
  Avatar,
  Text,
  Group,
  Badge,
  Button,
} from "@mantine/core";
import { Blog, User } from "@prisma/client";
import Link from "next/link";

type BlogUser = Blog & {
  author?: User | null | undefined;
};
const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
  },
  rating: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: "none",
  },
  edit: {
    position: "absolute",
    bottom: theme.spacing.xs,
    right: theme.spacing.xs + 2,
  },

  body: {
    padding: theme.spacing.md,
  },
}));

export function ArticleCardVertical({
  cover,
  title,
  id,
  published,
  author,
}: BlogUser) {
  const { classes } = useStyles();

  return (
    <Card withBorder radius="md" p={0} className={classes.card}>
      {published && !author && (
        <Badge
          className={classes.rating}
          variant="gradient"
          gradient={{ from: "green", to: "cyan" }}
        >
          published
        </Badge>
      )}
      {!published && !author && (
        <Badge
          className={classes.rating}
          variant="gradient"
          gradient={{ from: "yellow", to: "red" }}
        >
          Draft
        </Badge>
      )}

      <Group noWrap spacing={0}>
        <Image src={cover} height={140} alt="test" width={140} />
        <div className={classes.body}>
          <Text transform="uppercase" color="dimmed" weight={700} size="xs">
            {/* {category} */}Category
          </Text>
          <Text
            component={Link}
            href={`/blog/${id}`}
            className={classes.title}
            mt="xs"
            mb="md"
          >
            {title}
          </Text>
          <Group noWrap spacing="xs">
            {author && (
              <Group spacing="xs" noWrap>
                <Avatar size={20} src={author?.image} />
                <Text size="xs">{author?.name}</Text>
              </Group>
            )}
            {author && (
              <Text size="xs" color="dimmed">
                ???
              </Text>
            )}
            <Text size="xs" color="dimmed">
              {/* {date} */}2022
            </Text>
          </Group>
        </div>
      </Group>
      {!author && (
        <Button
          className={classes.edit}
          component={Link}
          href={`/blog/edit/${id}`}
        >
          Edit Blog
        </Button>
      )}
    </Card>
  );
}
