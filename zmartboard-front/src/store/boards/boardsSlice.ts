import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { boardsApi } from '../../services/boards.api';
import { tasksApi } from '../../services/tasks.api';
import type {
  Board,
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  MoveColumnDto,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
} from '../../types/boards.types';

// Define the initial state
interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,
};

// Async thunks for board operations
export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async ({ projectId, boardData }: { projectId: string; boardData: CreateBoardDto }, { rejectWithValue }) => {
    try {
      const response = await boardsApi.createBoard(projectId, boardData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create board';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProjectBoards = createAsyncThunk(
  'boards/getProjectBoards',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await boardsApi.getProjectBoards(projectId);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch boards';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getBoardById = createAsyncThunk(
  'boards/getBoardById',
  async (boardId: string, { rejectWithValue }) => {
    try {
      const response = await boardsApi.getBoardById(boardId);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch board';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ boardId, boardData }: { boardId: string; boardData: UpdateBoardDto }, { rejectWithValue }) => {
    try {
      const response = await boardsApi.updateBoard(boardId, boardData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update board';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId: string, { rejectWithValue }) => {
    try {
      await boardsApi.deleteBoard(boardId);
      return boardId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete board';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunks for column operations
export const createColumn = createAsyncThunk(
  'boards/createColumn',
  async ({ boardId, columnData }: { boardId: string; columnData: CreateColumnDto }, { rejectWithValue }) => {
    try {
      const response = await boardsApi.createColumn(boardId, columnData);
      return { boardId, column: response };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create column';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateColumn = createAsyncThunk(
  'boards/updateColumn',
  async ({ columnId, columnData }: { columnId: string; columnData: UpdateColumnDto }, { rejectWithValue }) => {
    try {
      const response = await boardsApi.updateColumn(columnId, columnData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update column';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteColumn = createAsyncThunk(
  'boards/deleteColumn',
  async (columnId: string, { rejectWithValue }) => {
    try {
      await boardsApi.deleteColumn(columnId);
      return columnId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete column';
      return rejectWithValue(errorMessage);
    }
  }
);

export const moveColumn = createAsyncThunk(
  'boards/moveColumn',
  async ({ columnId, moveData }: { columnId: string; moveData: MoveColumnDto }, { rejectWithValue }) => {
    try {
      const response = await boardsApi.moveColumn(columnId, moveData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to move column';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunks for task operations
export const createTask = createAsyncThunk(
  'boards/createTask',
  async ({ columnId, taskData }: { columnId: string; taskData: CreateTaskDto }, { rejectWithValue }) => {
    try {
      const response = await tasksApi.createTask(columnId, taskData);
      return { columnId, task: response };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTask = createAsyncThunk(
  'boards/updateTask',
  async ({ taskId, taskData }: { taskId: string; taskData: UpdateTaskDto }, { rejectWithValue }) => {
    try {
      const response = await tasksApi.updateTask(taskId, taskData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'boards/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await tasksApi.deleteTask(taskId);
      return taskId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const moveTask = createAsyncThunk(
  'boards/moveTask',
  async ({ taskId, moveData }: { taskId: string; moveData: MoveTaskDto }, { rejectWithValue }) => {
    try {
      const response = await tasksApi.moveTask(taskId, moveData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to move task';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create the slice
const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },
    clearBoards: (state) => {
      state.boards = [];
      state.currentBoard = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create board
    builder
      .addCase(createBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.boards) {
          state.boards = [];
        }
        state.boards.push(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get project boards
      .addCase(getProjectBoards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards = action.payload;
      })
      .addCase(getProjectBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get board by ID
      .addCase(getBoardById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBoardById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBoard = action.payload;
      })
      .addCase(getBoardById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Update board
      .addCase(updateBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.boards) {
          state.boards = [];
        }
        const index = state.boards.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
        if (state.currentBoard?.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Delete board
      .addCase(deleteBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.boards) {
          state.boards = [];
        }
        state.boards = state.boards.filter(b => b.id !== action.payload);
        if (state.currentBoard?.id === action.payload) {
          state.currentBoard = null;
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Create column
      .addCase(createColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        const { boardId, column } = action.payload;
        
        // Add to current board if it matches
        if (state.currentBoard?.id === boardId) {
          if (!state.currentBoard.columns) {
            state.currentBoard.columns = [];
          }
          state.currentBoard.columns.push(column);
          // Sort columns by position
          state.currentBoard.columns.sort((a, b) => a.position - b.position);
        }
        
        // Add to boards list if it exists
        if (state.boards) {
          const board = state.boards.find(b => b.id === boardId);
          if (board) {
            if (!board.columns) {
              board.columns = [];
            }
            board.columns.push(column);
            board.columns.sort((a, b) => a.position - b.position);
          }
        }
      })
      .addCase(createColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Update column
      .addCase(updateColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedColumn = action.payload;
        
        // Update in current board
        if (state.currentBoard?.columns) {
          const columnIndex = state.currentBoard.columns.findIndex(c => c.id === updatedColumn.id);
          if (columnIndex !== -1) {
            state.currentBoard.columns[columnIndex] = updatedColumn;
          }
        }
        
        // Update in boards list
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              const columnIndex = board.columns.findIndex(c => c.id === updatedColumn.id);
              if (columnIndex !== -1) {
                board.columns[columnIndex] = updatedColumn;
              }
            }
          });
        }
      })
      .addCase(updateColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Delete column
      .addCase(deleteColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        const columnId = action.payload;
        
        // Remove from current board
        if (state.currentBoard?.columns) {
          state.currentBoard.columns = state.currentBoard.columns.filter(c => c.id !== columnId);
        }
        
        // Remove from boards list
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              board.columns = board.columns.filter(c => c.id !== columnId);
            }
          });
        }
      })
      .addCase(deleteColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Move column
      .addCase(moveColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedColumn = action.payload;
        
        // Update in current board and re-sort
        if (state.currentBoard?.columns) {
          const columnIndex = state.currentBoard.columns.findIndex(c => c.id === updatedColumn.id);
          if (columnIndex !== -1) {
            state.currentBoard.columns[columnIndex] = updatedColumn;
            state.currentBoard.columns.sort((a, b) => a.position - b.position);
          }
        }
        
        // Update in boards list and re-sort
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              const columnIndex = board.columns.findIndex(c => c.id === updatedColumn.id);
              if (columnIndex !== -1) {
                board.columns[columnIndex] = updatedColumn;
                board.columns.sort((a, b) => a.position - b.position);
              }
            }
          });
        }
      })
      .addCase(moveColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const { columnId, task } = action.payload;
        
        // Add to current board if it matches
        if (state.currentBoard?.columns) {
          const column = state.currentBoard.columns.find(c => c.id === columnId);
          if (column) {
            if (!column.tasks) {
              column.tasks = [];
            }
            column.tasks.push(task);
            // Sort tasks by position
            column.tasks.sort((a, b) => a.position - b.position);
          }
        }
        
        // Add to boards list if it exists
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              const column = board.columns.find(c => c.id === columnId);
              if (column) {
                if (!column.tasks) {
                  column.tasks = [];
                }
                column.tasks.push(task);
                column.tasks.sort((a, b) => a.position - b.position);
              }
            }
          });
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTask = action.payload;
        
        // Update in current board
        if (state.currentBoard?.columns) {
          state.currentBoard.columns.forEach(column => {
            if (column.tasks) {
              const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
              if (taskIndex !== -1) {
                column.tasks[taskIndex] = updatedTask;
              }
            }
          });
        }
        
        // Update in boards list
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              board.columns.forEach(column => {
                if (column.tasks) {
                  const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
                  if (taskIndex !== -1) {
                    column.tasks[taskIndex] = updatedTask;
                  }
                }
              });
            }
          });
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const taskId = action.payload;
        
        // Remove from current board
        if (state.currentBoard?.columns) {
          state.currentBoard.columns.forEach(column => {
            if (column.tasks) {
              column.tasks = column.tasks.filter(t => t.id !== taskId);
            }
          });
        }
        
        // Remove from boards list
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              board.columns.forEach(column => {
                if (column.tasks) {
                  column.tasks = column.tasks.filter(t => t.id !== taskId);
                }
              });
            }
          });
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Move task
      .addCase(moveTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTask = action.payload;
        
        // Remove task from old column and add to new column in current board
        if (state.currentBoard?.columns) {
          // Remove from all columns first
          state.currentBoard.columns.forEach(column => {
            if (column.tasks) {
              column.tasks = column.tasks.filter(t => t.id !== updatedTask.id);
            }
          });
          
          // Add to the new column
          const targetColumn = state.currentBoard.columns.find(c => c.id === updatedTask.columnId);
          if (targetColumn) {
            if (!targetColumn.tasks) {
              targetColumn.tasks = [];
            }
            targetColumn.tasks.push(updatedTask);
            targetColumn.tasks.sort((a, b) => a.position - b.position);
          }
        }
        
        // Remove task from old column and add to new column in boards list
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              // Remove from all columns first
              board.columns.forEach(column => {
                if (column.tasks) {
                  column.tasks = column.tasks.filter(t => t.id !== updatedTask.id);
                }
              });
              
              // Add to the new column
              const targetColumn = board.columns.find(c => c.id === updatedTask.columnId);
              if (targetColumn) {
                if (!targetColumn.tasks) {
                  targetColumn.tasks = [];
                }
                targetColumn.tasks.push(updatedTask);
                targetColumn.tasks.sort((a, b) => a.position - b.position);
              }
            }
          });
        }
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentBoard, clearBoards } = boardsSlice.actions;
export default boardsSlice.reducer;