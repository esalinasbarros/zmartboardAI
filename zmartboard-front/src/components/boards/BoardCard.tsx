import React from 'react';
import type { Board } from '../../types/boards.types';

interface BoardCardProps {
  board: Board;
  onSelect: (board: Board) => void;
  onEdit?: (board: Board) => void;
  onDelete?: (boardId: string) => void;
  isAdmin?: boolean;
}

const BoardCard: React.FC<BoardCardProps> = ({ 
  board, 
  onSelect, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(board);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este tablero?')) {
      onDelete?.(board.id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={() => onSelect(board)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {board.title}
          </h3>
          {isAdmin && (
            <div className="flex space-x-1 ml-2">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                title="Editar tablero"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar tablero"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {board.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {board.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <span>{board.columns?.length || 0} columnas</span>
          </span>
          
          <span>
            {board.createdAt instanceof Date 
              ? board.createdAt.toLocaleDateString()
              : new Date(board.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;