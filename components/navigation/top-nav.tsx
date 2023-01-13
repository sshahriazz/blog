import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  Menu,
  Flex,
  Container,
  Anchor,
} from "@mantine/core";
import { MantineLogo } from "@mantine/ds";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCode,
  IconBook,
  IconCoin,
  IconChevronDown,
  IconExternalLink,
} from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ToggleColorScheme from "../core/ToggleColorScheme";
import ProfileDropdown from "../ProfileButton";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: `${theme.spacing.sm}px ${theme.spacing.sm}px`,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    // color: "red",
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
    borderRadius: theme.radius.md,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconCode,
    title: "Blog Post",
    description: "Browse the latest blog posts",
    href: "/blog",
  },
  {
    icon: IconCoin,
    title: "Create Blog",
    description: "Create a new blog post",
    href: "/blog/create",
  },
  {
    icon: IconBook,
    title: "My Blogs",
    description: "View your blogs",
    href: "/blog/my-blogs",
  },
  // {
  //   icon: IconFingerprint,
  //   title: "Security",
  //   description: "The shell’s rounded shape and the grooves on its.",
  // },
  // {
  //   icon: IconChartPie3,
  //   title: "Analytics",
  //   description: "This Pokémon uses its flying ability to quickly chase",
  // },
  // {
  //   icon: IconNotification,
  //   title: "Notifications",
  //   description: "Combusken battles with the intensely hot flames it spews",
  // },
];

const TopNav = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const session = useSession();

  const links = mockdata.map((item) => (
    <UnstyledButton
      component={Link}
      href={item.href}
      className={classes.subLink}
      key={item.title}
    >
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" weight={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <Header height={60} px="md">
        <Container size={"xl"}>
          <Group position="apart" sx={{ height: "100%" }}>
            <MantineLogo size={30} />

            <Group
              sx={{ height: "100%" }}
              spacing={0}
              className={classes.hiddenMobile}
            >
              <Link href="/" className={classes.link}>
                Home
              </Link>
              <HoverCard
                width={600}
                position="bottom"
                radius="md"
                shadow="md"
                withinPortal
              >
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Blog
                      </Box>
                      <IconChevronDown
                        size={16}
                        color={theme.fn.primaryColor()}
                      />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                  <Group position="apart" px="md">
                    <Text weight={500}>Blog</Text>
                    <Anchor href="#" size="xs">
                      View all
                    </Anchor>
                  </Group>

                  <Divider
                    my="sm"
                    mx="-md"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                  />

                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>

                  {/* <div className={classes.dropdownFooter}>
                    <Group position="apart">
                      <div>
                        <Text weight={500} size="sm">
                          Get started
                        </Text>
                        <Text size="xs" color="dimmed">
                          Their food sources have decreased, and their numbers
                        </Text>
                      </div>
                      <Button variant="default">Get started</Button>
                    </Group>
                  </div> */}
                </HoverCard.Dropdown>
              </HoverCard>
              <a href="#" className={classes.link}>
                Learn
              </a>
              <a href="#" className={classes.link}>
                Academy
              </a>
            </Group>

            <Flex className={classes.hiddenMobile} gap={"sm"} align="center">
              <ToggleColorScheme />

              {session.status !== "authenticated" && (
                <Button variant="default" onClick={() => signIn()}>
                  Log in
                </Button>
              )}
              {session.status !== "authenticated" && (
                <Button component={Link} href="/auth/signup">
                  Sign up
                </Button>
              )}
              {session.status === "authenticated" && (
                <Menu withArrow>
                  <Menu.Target>
                    <ProfileDropdown
                      image={""}
                      name={"Polash"}
                      email={"shahriaz@g.com"}
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => signOut()}>Log out</Menu.Item>

                    <Menu.Item
                      icon={<IconExternalLink size={14} />}
                      component={Link}
                      href="/"
                      target="_blank"
                    >
                      Home
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Flex>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          </Group>
        </Container>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Link href="/" className={classes.link}>
            Home
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="md">
            {session.status !== "authenticated" && (
              <Button onClick={() => signIn()} variant="default">
                Log in
              </Button>
            )}
            {session.status !== "authenticated" && (
              <Button onClick={() => signIn()}>Sign up</Button>
            )}
            {session.status === "authenticated" && (
              <Flex>
                <Menu withArrow>
                  <Menu.Target>
                    <ProfileDropdown image={""} name={""} email={""} />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item component={Link} href="/">
                      Mantine website
                    </Menu.Item>

                    <Menu.Item
                      icon={<IconExternalLink size={14} />}
                      component="a"
                      href="https://mantine.dev"
                      target="_blank"
                    >
                      External link
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <Button
                  variant="subtle"
                  color="orange"
                  onClick={() => signIn()}
                >
                  Sign up
                </Button>
              </Flex>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};
export default TopNav;
