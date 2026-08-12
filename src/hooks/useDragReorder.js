import { useRef, useState } from 'react';

/**
 * useDragReorder – minimal drag-and-drop reorder hook.
 *
 * Returns event-handler factories you attach to each draggable item.
 * The `onReorder(fromIndex, toIndex)` callback fires when the user
 * drops an item onto a new position.
 *
 * Usage:
 *   const { getDragProps, getDropProps, dragIndex } = useDragReorder(onReorder);
 *   <div {...getDragProps(i)} {...getDropProps(i)}>…</div>
 */
export default function useDragReorder(onReorder) {
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

  function getDragProps(index) {
    return {
      draggable: true,
      onDragStart(e) {
        dragIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
        // Small timeout lets the browser snapshot the element before we
        // add the dragging class, which avoids a translucent ghost.
        setTimeout(() => {
          e.target.classList.add('drag-source');
        }, 0);
      },
      onDragEnd(e) {
        e.target.classList.remove('drag-source');
        dragIndex.current = null;
        setOverIndex(null);
      },
    };
  }

  function getDropProps(index) {
    return {
      onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (overIndex !== index) setOverIndex(index);
      },
      onDragLeave() {
        setOverIndex(null);
      },
      onDrop(e) {
        e.preventDefault();
        const from = dragIndex.current;
        if (from !== null && from !== index) {
          onReorder(from, index);
        }
        dragIndex.current = null;
        setOverIndex(null);
      },
    };
  }

  return { getDragProps, getDropProps, overIndex };
}
