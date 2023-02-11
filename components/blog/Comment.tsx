import RTE from "@components/RTE";
import { createStyles, Text, Avatar, Group } from "@mantine/core";
const data = {
  postedAt: "10 minutes ago",
  body: "This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.",
  author: {
    name: "Jacob Warnhalter",
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
  },
};
const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
  },
}));

interface CommentProps {
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
  };
}

export function CommentSimple() {
  const { classes } = useStyles();
  const { postedAt, body, author } = data;

  return (
    <div>
      <Group>
        <Avatar src={author.image} alt={author.name} radius="xl" />
        <div>
          <Text size="sm">{author.name}</Text>
          <Text size="xs" color="dimmed">
            {postedAt}
          </Text>
        </div>
      </Group>
      <RTE />
      <Text className={classes.body} size="sm">
        {body}
      </Text>
    </div>
  );
}
