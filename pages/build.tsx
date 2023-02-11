import { useImmerAtom } from "jotai-immer";
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import { profileAtom } from "@store/index";
import { Card, Stack } from "@mantine/core";
const DragDropContext = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.DragDropContext),
  { ssr: false }
);
const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Draggable),
  { ssr: false }
);

interface Props {
  items: typeof profileAtom;
  renderItem: ({
    item,
    provided,
    snapshot,
  }: {
    item: any;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
  }) => JSX.Element;
}

function DragAndDropList({ items, renderItem }: Props) {
  const [list, setList] = useImmerAtom(items);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    setList((draft) => {
      const [removed] = draft.splice(result.source.index, 1);
      draft.splice(result.destination!.index, 0, removed);

      return draft;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {list.map((item, index) => (
              <Draggable
                key={index}
                draggableId={index.toString()}
                index={index}
              >
                {(provided, snapshot) =>
                  renderItem({ item, provided, snapshot })
                }
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default function Build() {
  return (
    <div className="App">
      <DragAndDropList
        renderItem={({ item, provided, snapshot }) => (
          <Stack>
            <Card
              shadow="sm"
              withBorder
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
            >
              {JSON.stringify(item)}
            </Card>
          </Stack>
        )}
        items={profileAtom}
      />
    </div>
  );
}
