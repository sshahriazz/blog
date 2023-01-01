import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  Box,
} from "@mantine/core";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from "@tabler/icons";
import UserAvatar from "../UserAvatar";
import { LinksGroup } from "./links-group";
// import { UserButton } from "../UserButton/UserButton";
// import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
// import { Logo } from "./Logo";

const mockdata = [
  { label: "Dashboard", icon: IconGauge },
  {
    label: "Market news",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Overview", link: "/" },
      { label: "Forecasts", link: "/" },
      { label: "Outlook", link: "/" },
      { label: "Real time", link: "/" },
    ],
  },
  {
    label: "Releases",
    icon: IconCalendarStats,
    links: [
      { label: "Upcoming releases", link: "/" },
      { label: "Previous releases", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  { label: "Analytics", icon: IconPresentationAnalytics },
  { label: "Contracts", icon: IconFileAnalytics },
  { label: "Settings", icon: IconAdjustments },
  {
    label: "Security",
    icon: IconLock,
    links: [
      { label: "Enable 2FA", link: "/" },
      { label: "Change password", link: "/" },
      { label: "Recovery codes", link: "/" },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function VerticalNav() {
  const { classes } = useStyles();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <Box className={classes.linksInner}>{links}</Box>
      </Navbar.Section>
    </Navbar>
  );
}
