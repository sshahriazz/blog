import { Card, Text } from "@mantine/core";
import { useEffect, useRef } from "react";

interface AnimatedComponentProps {
  targetRef: HTMLDivElement | null;
  data?: any;
}

const AnimatedComponent: React.FC<AnimatedComponentProps> = ({ targetRef }) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!targetRef || !componentRef.current) {
      return;
    }

    const targetRect = targetRef.getBoundingClientRect();
    const componentHeight = componentRef.current.offsetHeight;

    const newLeft = targetRect.left + targetRect.width;
    const newTop = targetRect.top + (targetRect.height - componentHeight) / 2;

    componentRef.current.style.transition = "all 0.2s ease-out";
    componentRef.current.style.left = `${newLeft + 20}px`;
    componentRef.current.style.top = `${newTop}px`;
    componentRef.current.style.transform = "scale(1)";
  }, [targetRef]);

  return (
    <Card
      withBorder
      shadow={"sm"}
      ref={(el) => {
        componentRef.current = el as HTMLDivElement;
      }}
      sx={{
        position: "fixed",
        zIndex: 9999,
        transition: "all 0.2s ease-out",
        transform: "scale(0)",
        transformOrigin: "top left",
      }}
    >
      <Text>Test</Text>
    </Card>
  );
};
export default AnimatedComponent;
