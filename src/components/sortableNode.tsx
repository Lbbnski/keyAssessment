import Node from './node.tsx';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SortableNode = ({node, id}: { node: { structureDefinition: {title: string} }, id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 rounded-md cursor-grab transition-colors ${
        isDragging
          ? 'bg-gray-100 opacity-80 shadow-lg'
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <Node title={node.structureDefinition?.title}/>
    </div>
  );
};

export default SortableNode;