import { useQuery } from '@apollo/client';
import { GET_CONTENT } from '../util/content.ts';
import { checkAuth, logout } from '../util/user.ts';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableNode from '../components/sortableNode.tsx';


const NodeList = () => {
  checkAuth();

  const PAGE_SIZE = 100;
  const [, setCurrentPage] = useState(1);
  const [nodeList, setNodeList] = useState<{ node:{id: string,structureDefinition:{title: string}}}[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<IntersectionObserver | null>(null);

  const { data, loading, error, fetchMore } = useQuery(GET_CONTENT, {
    variables: {
      first: PAGE_SIZE,
      after: null,
    },
    notifyOnNetworkStatusChange: true
  });

  // Sensoren konfigurieren
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Daten beim ersten Laden verarbeiten
  useEffect(() => {
    if (data?.Admin.Tree.GetContentNodes.edges) {
      const storedData = localStorage.getItem('nodeList');
      let initialList = data.Admin.Tree.GetContentNodes.edges;

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        // Match entries between parsedData and data based on their unique id
        if (Array.isArray(parsedData) && Array.isArray(initialList)) {
          initialList = parsedData.map((parsedItem: { id: string }) => {
            const matchingItem = initialList.find(
              (renderItem: { node: { id: string } }) => renderItem.node.id === parsedItem.id
            );
            return matchingItem || parsedItem; // Prefer initialList item if exists, otherwise fallback to parsedData
          });
        }
      }

      setNodeList(initialList);
      setHasMore(!!data.Admin.Tree.GetContentNodes.pageInfo.hasNextPage);
    }
  }, [data]);

  // Nächsten Satz Daten laden
  const loadMoreItems = () => {
    if (!hasMore || loading) return;

    const lastCursor =
      data?.Admin.Tree.GetContentNodes.pageInfo.endCursor || null;

    fetchMore({
      variables: {
        first: PAGE_SIZE,
        after: lastCursor,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;

        const newEdges = fetchMoreResult.Admin.Tree.GetContentNodes.edges;
        const pageInfo = fetchMoreResult.Admin.Tree.GetContentNodes.pageInfo;

        setHasMore(pageInfo.hasNextPage);

        return {
          Admin: {
            ...prevResult.Admin,
            Tree: {
              ...prevResult.Admin.Tree,
              GetContentNodes: {
                ...prevResult.Admin.Tree.GetContentNodes,
                edges: [
                  ...prevResult.Admin.Tree.GetContentNodes.edges,
                  ...newEdges
                ],
                pageInfo
              }
            }
          }
        };
      }
    }).then(fetchMoreResult => {
      if (fetchMoreResult?.data) {
        setNodeList(prev => [
          ...prev,
          ...fetchMoreResult.data.Admin.Tree.GetContentNodes.edges
        ]);

        setCurrentPage(prev => prev + 1);
      }
    });
  };

  // Paginierung Logik - Intersection Observer für Infinite Scrolling
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (loadingRef.current) {
      loadingRef.current.disconnect();
    }

    loadingRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });

    if (node) {
      loadingRef.current.observe(node);
    }
  }, [loading, hasMore, loadMoreItems]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setNodeList((items) => {
      const oldIndex = items.findIndex(item => item.node.id === active.id);
      const newIndex = items.findIndex(item => item.node.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // In localStorage speichern
      const simpleList = newItems.map(item => ({
        id: item.node?.id
      }));
      localStorage.setItem('nodeList', JSON.stringify(simpleList));

      return newItems;
    });
  };

  if (error) {
    if (error.cause?.statusCode === 401) {
      logout();
    }

    return <p data-testid="error-message" className="text-red-600 p-4">Fehler beim Laden der Daten</p>;
  }

  return (
    <div className="h-full overflow-auto" ref={containerRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={nodeList.map(item => item.node?.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="p-4 bg-gray-50 rounded-lg">
            {nodeList.map((node, index) => node.node && (
              <div key={node.node?.id} ref={index === nodeList.length - 10 ? lastElementRef : undefined}>
                <SortableNode
                  id={node.node?.id}
                  node={node.node}
                />
              </div>
            ))}

            {loading && (
              <div className="py-4 flex justify-center items-center">
                <div data-testid="loading-spinner" className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!hasMore && nodeList.length > 0 && (
              <div className="text-center text-gray-500 py-4 italic">
                Ende der Liste erreicht
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default NodeList;