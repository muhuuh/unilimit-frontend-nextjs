import { useState } from "react";
import { useDrop } from "react-dnd/dist/hooks";

const useElement = (responseList) => {
  const [board, setBoard] = useState();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "text",
    drop: (item) => addElementToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addElementToBoard = (id) => {
    const dropppedElement = responseList.filter(
      (response) => response.id === id
    );
    setBoard(dropppedElement[0].name);
  };

  return { board: board, drop: drop };
};

export default useElement;