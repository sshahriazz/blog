import {
  Box,
  Progress,
  Group,
  Text,
  Center,
  PasswordInput,
  Tooltip,
  Card,
} from "@mantine/core";
import { useClickOutside, useInputState } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons";
import { useState } from "react";

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text color={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size={14} stroke={1.5} />
        ) : (
          <IconX size={14} stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export function PasswordStrength({ form }: { form: any }) {
  const [value, setValue] = useInputState("");
  const strength = getStrength(value);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          value.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));

  return (
    <Box ref={ref} onClick={() => setOpened(!opened ? true : true)}>
      <Tooltip
        opened={opened}
        offset={50}
        position="right"
        withArrow
        arrowSize={15}
        arrowPosition="side"
        label={
          <Card>
            <PasswordRequirement
              label="Has at least 8 characters"
              meets={value.length > 7}
            />
            {checks}
          </Card>
        }
      >
        <PasswordInput
          onFocus={() => setOpened(true)}
          onBlur={() => setOpened(false)}
          mt="md"
          size="md"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            form.setFieldValue("password", e.target.value);
          }}
          placeholder="Your password"
          label="Password"
          required
        />
      </Tooltip>
      <Group spacing={5} grow mt="xs" mb="md">
        {bars}
      </Group>
    </Box>
  );
}
