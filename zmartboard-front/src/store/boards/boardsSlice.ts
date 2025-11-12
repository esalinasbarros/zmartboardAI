import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { boardsApi } from '../../services/boards.api';
import { tasksApi } from '../../services/tasks.api';
import type {
  Board,
  Column,
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
  async ({ columnId, moveData, oldPosition }: { columnId: string; moveData: MoveColumnDto; oldPosition: number }, { rejectWithValue }) => {
    try {
      const response = await boardsApi.moveColumn(columnId, moveData);
      return { column: response, newPosition: moveData.position, oldPosition };
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

// Async thunks for task assignment operations
export const assignUserToTask = createAsyncThunk(
  'boards/assignUserToTask',
  async ({ taskId, userId }: { taskId: string; userId: string }, { rejectWithValue }) => {
    try {
      await tasksApi.assignUserToTask(taskId, userId);
      // Fetch updated task to get full data including assignments
      const updatedTask = await tasksApi.getTaskById(taskId);
      return { task: updatedTask };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign user to task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const unassignUserFromTask = createAsyncThunk(
  'boards/unassignUserFromTask',
  async ({ taskId, userId }: { taskId: string; userId: string }, { rejectWithValue }) => {
    try {
      await tasksApi.unassignUserFromTask(taskId, userId);
      // Fetch updated task to get full data including assignments
      const updatedTask = await tasksApi.getTaskById(taskId);
      return { task: updatedTask };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unassign user from task';
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
        // Don't set isLoading for move operations to avoid affecting other UI elements
        state.error = null;
      })
      .addCase(moveColumn.fulfilled, (state, action) => {
        const { column: updatedColumn, newPosition, oldPosition } = action.payload;
        
        // Helper function to update column positions
        const updateColumnPositions = (columns: Column[]) => {
          // First, adjust positions of other columns that were affected by the move
          if (newPosition > oldPosition) {
            // Moving right: columns between old and new position shift left
            columns.forEach(col => {
              if (col.id !== updatedColumn.id && col.position > oldPosition && col.position <= newPosition) {
                col.position = col.position - 1;
              }
            });
          } else if (newPosition < oldPosition) {
            // Moving left: columns between new and old position shift right
            columns.forEach(col => {
              if (col.id !== updatedColumn.id && col.position >= newPosition && col.position < oldPosition) {
                col.position = col.position + 1;
              }
            });
          }
          
          // Update the moved column
          const columnIndex = columns.findIndex(c => c.id === updatedColumn.id);
          if (columnIndex !== -1) {
            columns[columnIndex] = updatedColumn;
          }
          
          // Sort by position
          columns.sort((a, b) => a.position - b.position);
        };
        
        // Update in current board
        if (state.currentBoard?.columns) {
          updateColumnPositions(state.currentBoard.columns);
        }
        
        // Update in boards list
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns && board.columns.some(c => c.id === updatedColumn.id)) {
              updateColumnPositions(board.columns);
            }
          });
        }
      })
      .addCase(moveColumn.rejected, (state, action) => {
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
        // Don't set isLoading for move operations to avoid affecting other UI elements
        state.error = null;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        
        // Update in current board
        if (state.currentBoard?.columns) {
          // Remove task from all columns (in case it moved)
          state.currentBoard.columns.forEach(column => {
            if (column.tasks) {
              column.tasks = column.tasks.filter(t => t.id !== updatedTask.id);
            }
          });
          
          // Add task to correct column
          const targetColumn = state.currentBoard.columns.find(c => c.id === updatedTask.columnId);
          if (targetColumn) {
            if (!targetColumn.tasks) {
              targetColumn.tasks = [];
            }
            targetColumn.tasks.push(updatedTask);
            // Re-sort tasks by position
            targetColumn.tasks.sort((a, b) => a.position - b.position);
          }
        }
        
        // Update in boards list
        if (state.boards) {
          state.boards.forEach(board => {
            if (board.columns) {
              // Remove task from all columns
              board.columns.forEach(column => {
                if (column.tasks) {
                  column.tasks = column.tasks.filter(t => t.id !== updatedTask.id);
                }
              });
              
              // Add task to correct column
              const targetColumn = board.columns.find(c => c.id === updatedTask.columnId);
              if (targetColumn) {
                if (!targetColumn.tasks) {
                  targetColumn.tasks = [];
                }
                targetColumn.tasks.push(updatedTask);
                // Re-sort tasks by position
                targetColumn.tasks.sort((a, b) => a.position - b.position);
              }
            }
          });
        }
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })

    // Assign user to task
      .addCase(assignUserToTask.pending, (state) => {
        state.error = null;
      })
      .addCase(assignUserToTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.task;
        
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
      .addCase(assignUserToTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })

    // Unassign user from task
      .addCase(unassignUserFromTask.pending, (state) => {
        state.error = null;
      })
      .addCase(unassignUserFromTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.task;
        
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
      .addCase(unassignUserFromTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentBoard, clearBoards } = boardsSlice.actions;
export default boardsSlice.reducer;