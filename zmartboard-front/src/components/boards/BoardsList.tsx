import React, { useState, useEffect } from 'react';
import { useBoardActions, useBoardsState } from '../../store/boards/boardsHooks';
import { useAppDispatch } from '../../store/hooks';
import { getProjectBoards, getBoardById } from '../../store/boards/boardsSlice';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import type { Board, CreateBoardDto, UpdateBoardDto } from '../../types/boards.types';
import BoardCard from './BoardCard';
import CreateBoardModal from './CreateBoardModal';
import EditBoardModal from './EditBoardModal';
import BoardView from './BoardView';

interface BoardsListProps {
  projectId: string;
  isAdmin?: boolean;
}

const BoardsList: React.FC<BoardsListProps> = ({ projectId, isAdmin = false }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const { boards, isLoading, error } = useBoardsState();
  const { createBoard, updateBoard, deleteBoard } = useBoardActions();
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

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setShowEditModal(true);
  };

  const handleUpdateBoard = async (data: UpdateBoardDto) => {
    if (!editingBoard) return;
    
    try {
      await updateBoard(editingBoard.id, data);
      setShowEditModal(false);
      setEditingBoard(null);
      toast.board.updateSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.board.updateError(errorMessage);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      // If the deleted board was selected, go back to boards list
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(null);
      }
      toast.board.deleteSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.board.deleteError(errorMessage);
    }
  };

  const handleSelectBoard = async (board: Board) => {
    try {
      // Fetch the complete board data with columns
      const result = await dispatch(getBoardById(board.id));
      if (getBoardById.fulfilled.match(result)) {
        setSelectedBoard(result.payload);
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.board.fetchError(errorMessage);
    }
  };

  const handleBackToBoards = () => {
    setSelectedBoard(null);
  };

  // If a board is selected, show the board view
  if (selectedBoard) {
    return (
      <BoardView
        board={selectedBoard}
        isAdmin={isAdmin}
        onBack={handleBackToBoards}
      />
    );
  }

  // Show loading state
  if (isLoading && boards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tableros...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800">Error al cargar los tableros: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tableros del Proyecto</h2>
          <p className="text-gray-600 mt-1">
            {boards.length === 0 ? 'No hay tableros creados' : `${boards.length} tablero${boards.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Tablero</span>
          </button>
        )}
      </div>

      {/* Boards Grid */}
      {boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onSelect={() => handleSelectBoard(board)}
              onEdit={isAdmin ? handleEditBoard : undefined}
              onDelete={isAdmin ? handleDeleteBoard : undefined}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tableros</h3>
          <p className="text-gray-500 mb-6">Este proyecto aún no tiene tableros creados.</p>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Crear Primer Tablero
            </button>
          )}
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
        isLoading={isLoading}
      />

      {/* Edit Board Modal */}
      <EditBoardModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBoard(null);
        }}
        onSubmit={handleUpdateBoard}
        isLoading={isLoading}
        initialTitle={editingBoard?.title}
        initialDescription={editingBoard?.description}
      />
    </div>
  );
};

export default BoardsList;