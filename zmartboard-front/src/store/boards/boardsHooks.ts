import { useAppDispatch, useAppSelector } from '../hooks';
import {
  createBoard,
  getProjectBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  createColumn,
  updateColumn,
  deleteColumn,
  moveColumn,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  clearError,
  setCurrentBoard,
  clearBoards,
} from './boardsSlice';
import type {
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  MoveColumnDto,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  Board,
} from '../../types/boards.types';

// Hook to get boards state
export const useBoardsState = () => {
  return useAppSelector((state) => state.boards);
};

// Hook to get current board
export const useCurrentBoard = () => {
  return useAppSelector((state) => state.boards.currentBoard);
};

// Hook to get boards list
export const useBoards = () => {
  return useAppSelector((state) => state.boards.boards);
};

// Hook to get loading state
export const useBoardsLoading = () => {
  return useAppSelector((state) => state.boards.isLoading);
};

// Hook to get error state
export const useBoardsError = () => {
  return useAppSelector((state) => state.boards.error);
};

// Hook for board actions
export const useBoardActions = () => {
  const dispatch = useAppDispatch();

  return {
    createBoard: (projectId: string, boardData: CreateBoardDto) => 
      dispatch(createBoard({ projectId, boardData })),
    getProjectBoards: (projectId: string) => dispatch(getProjectBoards(projectId)),
    getBoardById: (boardId: string) => dispatch(getBoardById(boardId)),
    updateBoard: (boardId: string, boardData: UpdateBoardDto) => 
      dispatch(updateBoard({ boardId, boardData })),
    deleteBoard: (boardId: string) => dispatch(deleteBoard(boardId)),
    createColumn: (boardId: string, columnData: CreateColumnDto) => 
      dispatch(createColumn({ boardId, columnData })),
    updateColumn: (columnId: string, columnData: UpdateColumnDto) => 
      dispatch(updateColumn({ columnId, columnData })),
    deleteColumn: (columnId: string) => dispatch(deleteColumn(columnId)),
    moveColumn: (columnId: string, moveData: MoveColumnDto, oldPosition: number) => 
      dispatch(moveColumn({ columnId, moveData, oldPosition })),
    createTask: (columnId: string, taskData: CreateTaskDto) => 
      dispatch(createTask({ columnId, taskData })),
    updateTask: (taskId: string, taskData: UpdateTaskDto) => 
      dispatch(updateTask({ taskId, taskData })),
    deleteTask: (taskId: string) => dispatch(deleteTask(taskId)),
    moveTask: (taskId: string, moveData: MoveTaskDto) => 
      dispatch(moveTask({ taskId, moveData })),
    clearError: () => dispatch(clearError()),
    setCurrentBoard: (board: Board | null) => dispatch(setCurrentBoard(board)),
    clearBoards: () => dispatch(clearBoards()),
  };
};

// Hook for creating boards
export const useCreateBoard = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const createBoardAction = (projectId: string, boardData: CreateBoardDto) => {
    dispatch(clearError());
    return dispatch(createBoard({ projectId, boardData }));
  };

  return {
    createBoard: createBoardAction,
    isLoading,
    error,
  };
};

// Hook for fetching project boards
export const useFetchProjectBoards = () => {
  const dispatch = useAppDispatch();
  const { boards, isLoading, error } = useBoardsState();

  const fetchBoards = (projectId: string) => {
    dispatch(clearError());
    return dispatch(getProjectBoards(projectId));
  };

  return {
    boards,
    fetchBoards,
    isLoading,
    error,
  };
};

// Hook for fetching board by ID
export const useFetchBoardById = () => {
  const dispatch = useAppDispatch();
  const { currentBoard, isLoading, error } = useBoardsState();

  const fetchBoard = (boardId: string) => {
    dispatch(clearError());
    return dispatch(getBoardById(boardId));
  };

  return {
    board: currentBoard,
    fetchBoard,
    isLoading,
    error,
  };
};

// Hook for updating boards
export const useUpdateBoard = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const updateBoardAction = (boardId: string, boardData: UpdateBoardDto) => {
    dispatch(clearError());
    return dispatch(updateBoard({ boardId, boardData }));
  };

  return {
    updateBoard: updateBoardAction,
    isLoading,
    error,
  };
};

// Hook for deleting boards
export const useDeleteBoard = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const deleteBoardAction = (boardId: string) => {
    dispatch(clearError());
    return dispatch(deleteBoard(boardId));
  };

  return {
    deleteBoard: deleteBoardAction,
    isLoading,
    error,
  };
};

// Hook for managing columns
export const useColumnActions = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const createColumnAction = (boardId: string, columnData: CreateColumnDto) => {
    dispatch(clearError());
    return dispatch(createColumn({ boardId, columnData }));
  };

  const updateColumnAction = (columnId: string, columnData: UpdateColumnDto) => {
    dispatch(clearError());
    return dispatch(updateColumn({ columnId, columnData }));
  };

  const deleteColumnAction = (columnId: string) => {
    dispatch(clearError());
    return dispatch(deleteColumn(columnId));
  };

  const moveColumnAction = (columnId: string, moveData: MoveColumnDto, oldPosition: number) => {
    dispatch(clearError());
    return dispatch(moveColumn({ columnId, moveData, oldPosition }));
  };

  return {
    createColumn: createColumnAction,
    updateColumn: updateColumnAction,
    deleteColumn: deleteColumnAction,
    moveColumn: moveColumnAction,
    isLoading,
    error,
  };
};

// Hook for managing tasks
export const useTaskActions = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const createTaskAction = (columnId: string, taskData: CreateTaskDto) => {
    dispatch(clearError());
    return dispatch(createTask({ columnId, taskData }));
  };

  const updateTaskAction = (taskId: string, taskData: UpdateTaskDto) => {
    dispatch(clearError());
    return dispatch(updateTask({ taskId, taskData }));
  };

  const deleteTaskAction = (taskId: string) => {
    dispatch(clearError());
    return dispatch(deleteTask(taskId));
  };

  const moveTaskAction = (taskId: string, moveData: MoveTaskDto) => {
    dispatch(clearError());
    return dispatch(moveTask({ taskId, moveData }));
  };

  return {
    createTask: createTaskAction,
    updateTask: updateTaskAction,
    deleteTask: deleteTaskAction,
    moveTask: moveTaskAction,
    isLoading,
    error,
  };
};

// Hook for creating tasks
export const useCreateTask = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const createTaskAction = (columnId: string, taskData: CreateTaskDto) => {
    dispatch(clearError());
    return dispatch(createTask({ columnId, taskData }));
  };

  return {
    createTask: createTaskAction,
    isLoading,
    error,
  };
};

// Hook for updating tasks
export const useUpdateTask = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const updateTaskAction = (taskId: string, taskData: UpdateTaskDto) => {
    dispatch(clearError());
    return dispatch(updateTask({ taskId, taskData }));
  };

  return {
    updateTask: updateTaskAction,
    isLoading,
    error,
  };
};

// Hook for deleting tasks
export const useDeleteTask = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const deleteTaskAction = (taskId: string) => {
    dispatch(clearError());
    return dispatch(deleteTask(taskId));
  };

  return {
    deleteTask: deleteTaskAction,
    isLoading,
    error,
  };
};

// Hook for moving tasks
export const useMoveTask = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useBoardsState();

  const moveTaskAction = (taskId: string, moveData: MoveTaskDto) => {
    dispatch(clearError());
    return dispatch(moveTask({ taskId, moveData }));
  };

  return {
    moveTask: moveTaskAction,
    isLoading,
    error,
  };
};