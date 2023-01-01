export const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
export const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Client", href: "/client", current: false },
  { name: "Server", href: "/server", current: false },
  { name: "Protected", href: "/protected", current: false },
  { name: "Api-Example", href: "/api-example", current: false },
  { name: "Admin", href: "/admin", current: false },
  // { name: "Me", href: "/me", current: false },
];
export const userNavigation = [
  { name: "Your Profile", href: "/me" },
  // { name: "Settings", href: "#" },
  { name: "Sign out", href: "/api/auth/signout" },
];
export const links = [
  {
    link: "#",
    label: "Contact",
  },
  {
    link: "#",
    label: "Privacy",
  },
  {
    link: "#",
    label: "Blog",
  },
  {
    link: "#",
    label: "Store",
  },
  {
    link: "#",
    label: "Careers",
  },
];
