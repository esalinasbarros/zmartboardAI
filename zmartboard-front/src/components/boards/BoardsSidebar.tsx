import React, { useEffect, useState } from 'react';
import { useBoardsState, useBoardActions } from '../../store/boards/boardsHooks';
import { useAppDispatch } from '../../store/hooks';
import { getProjectBoards } from '../../store/boards/boardsSlice';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import type { Board, CreateBoardDto } from '../../types/boards.types';
import CreateBoardModal from './CreateBoardModal';

interface BoardsSidebarProps {
  projectId: string;
  selectedBoardId?: string | null;
  onSelectBoard: (board: Board) => void;
  isAdmin?: boolean;
}

const BoardsSidebar: React.FC<BoardsSidebarProps> = ({ 
  projectId, 
  selectedBoardId, 
  onSelectBoard,
  isAdmin = false 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { boards, isLoading, error } = useBoardsState();
  const { createBoard } = useBoardActions();
  const dispatch = useAppDispatch();
  const toast = useToastNotifications();

  // Fetch boards when component mounts or projectId changes
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        await dispatch(getProjectBoards(projectId));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.board.fetchError(errorMessage);
      }
    };
    
    fetchBoards();
  }, [projectId]);

  const handleCreateBoard = async (boardData: CreateBoardDto) => {
    try {
      await createBoard(projectId, boardData);
      setShowCreateModal(false);
      toast.board.createSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.board.createError(errorMessage);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tableros</h2>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              title="Crear nuevo tablero"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {boards.length === 0 ? 'Sin tableros' : `${boards.length} tablero${boards.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Boards List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && boards.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-800">Error al cargar tableros</p>
          </div>
        ) : boards.length > 0 ? (
          <div className="space-y-2">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => onSelectBoard(board)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedBoardId === board.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      selectedBoardId === board.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {board.title}
                    </h3>
                    {board.description && (
                      <p className={`text-xs mt-1 line-clamp-2 ${
                        selectedBoardId === board.id ? 'text-orange-100' : 'text-gray-600'
                      }`}>
                        {board.description}
                      </p>
                    )}
                  </div>
                  {selectedBoardId === board.id && (
                    <svg className="w-5 h-5 text-white flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              <p className="text-sm text-gray-600 mb-2">Sin tableros</p>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Crear uno
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BoardsSidebar;

