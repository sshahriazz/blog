import React from "react";

const ListItem = ({ item, provided, snapshot }: any) => {
  return (
    <div
      ref={provided.innerRef}
      snapshot={snapshot}
      {...provided.draggableProps}
    >
      <span>{item.id}</span>
      <div>
        <span>{item.content}</span>
        <div>{item.id}</div>
      </div>
    </div>
  );
};

export default ListItem;
