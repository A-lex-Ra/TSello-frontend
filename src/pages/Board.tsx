import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { createColumn, getColumns } from '../api/columns';
import { CardDto, createCard, updateCard } from '../api/cards';
import CardModal from '../components/CardModal';

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';

interface Column {
  id: number;
  title: string;
  cards: CardDto[];
}

const BoardPage: React.FC = () => {
  const { userId } = useAuth();
  const [columns, setColumns] = useState<Column[]>([]);
  const [modalCard, setModalCard] = useState<CardDto | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  // let [ dragPreview, setDragPreview ] = useState<HTMLElement>();

  useEffect(() => {
    if (!userId) return;
    getColumns(userId).then(setColumns).catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!userId || columns.length === 0) return;

    const cleanups: (() => void)[] = [];

    columns.forEach(col =>
      col.cards.forEach((card, index) => {
        const el = document.getElementById(`card-${card.id}`);
        if (el) {
          cleanups.push(
            draggable({
              element: el,
              getInitialData: () => ({
                cardId: card.id,
                columnId: col.id,
                index,
              }),
            }),
          );
          cleanups.push(
            dropTargetForElements({
              element: el,
              getIsSticky: () => true,
              getData: () => ({
                type: 'card',
                cardId: card.id,
                columnId: col.id,
                index,
              }),
            }),
          );
        }
      }),
    );

    columns.forEach(col => {
      const el = document.querySelector(`[data-column-id="${col.id}"]`);
      if (el instanceof HTMLElement) {
        cleanups.push(
          dropTargetForElements({
            element: el,
            getData: () => ({
              type: 'column',
              columnId: col.id,
            }),
          }),
        );
      }
    });

    // let onDropCleanup: (()=>void) = ()=>{};
    const stopMonitor = monitorForElements({
      onDrop: async ({ source, location }) => {
        const { cardId, columnId: sourceColumnId, index: startIndex } = source.data as any;
        const target = location.current.dropTargets.at(-1);

        if (!target) {
          console.warn('No valid target for drop');
          return;
        }

        const targetData = target.data as any;

        const destColId = targetData.columnId as number;

        const targetColumn = columns.find(c => c.id === destColId);
        if (!targetColumn) {
          console.warn('Destination column not found');
          return;
        }

        const closestEdge = extractClosestEdge(location.current) as Edge | null;

        let destinationIndex = 0;

        if (targetData.type === 'card') { //TODO ADEQUATE CALCULATION
          const targetIndex = targetData.index as number;
          destinationIndex = getReorderDestinationIndex({
            startIndex,
            closestEdgeOfTarget: closestEdge,
            indexOfTarget: targetIndex,
            axis: 'vertical',
          });
        } else {
          // Бросили в пустую колонку
          destinationIndex = targetColumn.cards.length + 1;
        }

        await updateCard(userId, sourceColumnId, cardId, {
          columnId: destColId,
          order: destinationIndex,
        });
        // onDropCleanup?.();
        setColumns(await getColumns(userId));
      },
      // onGenerateDragPreview: ({ source, location }) => {
      //   const el = source.element;
      //   console.log(source.dragHandle);
        
      //   if (!el) return;
      
      //   const dragPreview = el.cloneNode(true) as HTMLElement;
      //   const { x:clientX, y:clientY } = el.getClientRects()[0];
      
      //   // Добавим анимацию через @keyframes
      //   const styleTagId = 'drag-preview-animation-style';
      //   if (!document.getElementById(styleTagId)) {
      //     const style = document.createElement('style');
      //     style.id = styleTagId;
      //     style.textContent = `
      //       @keyframes scaleIn {
      //         from { transform: scale(0.9); opacity: 0; }
      //         to { transform: scale(1); opacity: 1; }
      //       }
      //     `;
      //     document.head.appendChild(style);
      //   }
      
      //   Object.assign(dragPreview.style, {
      //     position: 'fixed',
      //     top: `${clientY}px`,
      //     left: `${clientX}px`,
      //     width: `${el.offsetWidth}px`,
      //     pointerEvents: 'none',
      //     opacity: '1',
      //     background: '#ffffff',
      //     boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      //     zIndex: '9999',
      //     transition: 'transform 0.2s ease',
      //     animation: 'scaleIn 120ms ease-out',
      //   });
      
      //   document.body.appendChild(dragPreview);
      
      //   onDropCleanup = () => {
      //       // window.removeEventListener('mousemove', move);
      //       dragPreview.remove();
      //     };
      // },
      // onDragStart: () => {
      //   if (!dragPreview) {
      //     console.warn("dragPreview is undefined or null !!!");
      //     return;
      //   }
      //   const move = (e: MouseEvent) => {
      //     dragPreview.style.left = `${e.clientX}px`;
      //     dragPreview.style.top = `${e.clientY}px`;
      //     dragPreview.style.transform = 'translate(-50%, -50%) scale(1)';
      //   };
      //   window.addEventListener('mousemove', move);
      //   onDropCleanup = combine(onDropCleanup, ()=>{window.removeEventListener('mousemove', move);})
      // } 
    });

    return () => {
      stopMonitor();
      cleanups.forEach(fn => fn());
    };
  }, [columns, userId]);

  const handleAddCard = async (colId: number) => {
    if (!userId) return;
    const title = prompt('Enter card title');
    if (!title) return;
    await createCard(userId, colId, title);
    setColumns(await getColumns(userId));
  };

  const handleAddColumn = async () => {
    if (!userId) return;
    const title = prompt('Enter column title');
    if (!title) return;
    await createColumn(userId, title);
    setColumns(await getColumns(userId));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Board</h2>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
        {columns.map(col => (
          <div
            key={col.id}
            data-column-id={col.id}
            style={{
              minWidth: 280,
              background: '#f8f9fa',
              borderRadius: 6,
              padding: 12,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3>{col.title}</h3>
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  id={`card-${card.id}`}
                  onClick={() => {
                    setModalCard(card);
                    setModalOpen(true);
                  }}
                  style={{
                    userSelect: 'none',
                    padding: 8,
                    margin: '0 0 8px 0',
                    background: '#fff',
                    borderRadius: 4,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={card.checked}
                      onClick={e => e.stopPropagation()}
                      onChange={async () => {
                        await updateCard(userId!, col.id, card.id, {
                          checked: !card.checked,
                        });
                        setColumns(await getColumns(userId!));
                      }}
                    />
                    <span>{card.title}</span>
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleAddCard(col.id)}
              style={{
                marginTop: 8,
                padding: '6px 8px',
                background: '#e2e6ea',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              + Add card
            </button>
          </div>
        ))}
        <button
              onClick={() => handleAddColumn()}
              style={{
                minWidth: 280,
                background: '#e2e6ea',
                borderRadius: 6,
                padding: 12,
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              Add column
            </button>
      </div>

      {modalCard && (
        <CardModal
          isOpen={isModalOpen}
          onRequestClose={() => setModalOpen(false)}
          card={modalCard}
        />
      )}
    </div>
  );
};

export default BoardPage;
