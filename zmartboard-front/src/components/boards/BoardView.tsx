import React, { useState, useEffect } from 'react';
import { useBoardActions, useBoardsState, useCurrentBoard } from '../../store/boards/boardsHooks';
import type { Board, CreateColumnDto, UpdateColumnDto, MoveColumnDto } from '../../types/boards.types';
import ColumnCard from './ColumnCard';
import CreateColumnModal from './CreateColumnModal';

interface BoardViewProps {
  board: Board;
  isAdmin?: boolean;
  onBack: () => void;
}

const BoardView: React.FC<BoardViewProps> = ({ board: initialBoard, isAdmin = false, onBack }) => {
  const [showCreateColumnModal, setShowCreateColumnModal] = useState(false);
  const { isLoading } = useBoardsState();
  const currentBoard = useCurrentBoard();
  const { updateColumn, deleteColumn, createColumn, moveColumn } = useBoardActions();

  // Use currentBoard from Redux if available, fallback to prop
  const board = currentBoard || initialBoard;

  // Sort columns by position
  const sortedColumns = [...(board.columns || [])].sort((a, b) => a.position - b.position);

  const handleCreateColumn = async (columnData: CreateColumnDto) => {
    try {
      await createColumn(board.id, columnData);
      setShowCreateColumnModal(false);
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const handleUpdateColumn = async (columnId: string, data: UpdateColumnDto) => {
    try {
      await updateColumn(columnId, data);
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    try {
      await deleteColumn(columnId);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const handleMoveColumn = async (columnId: string, direction: 'left' | 'right') => {
    const currentColumn = sortedColumns.find(col => col.id === columnId);
    if (!currentColumn) return;

    const currentIndex = sortedColumns.findIndex(col => col.id === columnId);
    let newPosition: number;

    if (direction === 'left' && currentIndex > 0) {
      newPosition = sortedColumns[currentIndex - 1].position;
    } else if (direction === 'right' && currentIndex < sortedColumns.length - 1) {
      newPosition = sortedColumns[currentIndex + 1].position;
    } else {
      return; // Can't move in that direction
    }

    try {
      const moveData: MoveColumnDto = { position: newPosition };
      await moveColumn(columnId, moveData);
    } catch (error) {
      console.error('Error moving column:', error);
    }
  };

  const handleDropColumn = async (draggedColumnId: string, targetColumnId: string) => {
    const draggedColumn = sortedColumns.find(col => col.id === draggedColumnId);
    const targetColumn = sortedColumns.find(col => col.id === targetColumnId);
    
    if (!draggedColumn || !targetColumn || draggedColumnId === targetColumnId) {
      return;
    }

    try {
      const moveData: MoveColumnDto = { position: targetColumn.position };
      await moveColumn(draggedColumnId, moveData);
    } catch (error) {
      console.error('Error moving column:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver a tableros"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
            {board.description && (
              <p className="text-gray-600 mt-1">{board.description}</p>
            )}
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateColumnModal(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Columna</span>
          </button>
        )}
      </div>

      {/* Columns Container */}
      <div className="flex-1 overflow-hidden">
        {sortedColumns.length > 0 ? (
          <div className="h-full overflow-x-auto">
            <div className="flex space-x-6 h-full pb-4" style={{ minWidth: 'max-content' }}>
              {sortedColumns.map((column, index) => (
                <ColumnCard
                  key={column.id}
                  column={column}
                  onUpdate={isAdmin ? handleUpdateColumn : undefined}
                  onDelete={isAdmin ? handleDeleteColumn : undefined}
                  onMove={isAdmin ? handleMoveColumn : undefined}
                  onDrop={isAdmin ? handleDropColumn : undefined}
                  isAdmin={isAdmin}
                  canMoveLeft={index > 0}
                  canMoveRight={index < sortedColumns.length - 1}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay columnas</h3>
              <p className="text-gray-500 mb-4">Este tablero aún no tiene columnas.</p>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateColumnModal(true)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Crear Primera Columna
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Column Modal */}
      <CreateColumnModal
        isOpen={showCreateColumnModal}
        onClose={() => setShowCreateColumnModal(false)}
        onSubmit={handleCreateColumn}
        isLoading={isLoading}
        existingColumnsCount={sortedColumns.length}
      />
    </div>
  );
};

export default BoardView;