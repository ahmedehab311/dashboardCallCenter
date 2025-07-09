// hooks/useReorderableList.js
import { useState } from "react";

export const useReorderableList = (list, setList) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, localIndex, offset = 0) => {
    const actualIndex = offset + localIndex;
    setDraggedIndex(actualIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    const reordered = [...list];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);

    setList(reordered);
    setDraggedIndex(null);

    const arrangement = reordered.map((_, index) => index + 1);
    const ids = reordered.map((item) => item.id);
    const updatedIds = arrangement.map((index) => ids[index - 1]);

    // Optional: return them
    return { reordered, arrangement, updatedIds };
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};
