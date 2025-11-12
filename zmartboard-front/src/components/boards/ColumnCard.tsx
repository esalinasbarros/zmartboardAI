import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Column, UpdateColumnDto, CreateTaskDto, Task } from '../../types/boards.types';
import { useCreateTask } from '../../store/boards/boardsHooks';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailModal from './TaskDetailModal';

interface ColumnCardProps {
  column: Column;
  onUpdate?: (columnId: string, data: UpdateColumnDto) => void;
  onDelete?: (columnId: string) => void;
  onMove?: (columnId: string, direction: 'left' | 'right') => void;
  onDrop?: (taskId: string, targetColumnId: string, sourceColumnId: string) => void;
  isAdmin?: boolean;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}

const ColumnCard: React.FC<ColumnCardProps> = ({
  column,
  onUpdate,
  onDelete,
  onMove,
  onDrop,
  isAdmin = false,
  canMoveLeft = false,
  canMoveRight = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(column.name);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const { createTask, isLoading: isCreatingTask } = useCreateTask();

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== column.name) {
      onUpdate?.(column.id, { name: editName.trim() });
    }
    setIsEditing(false);
    setEditName(column.name);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(column.name);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta columna? Se eliminarán todas las tareas.')) {
      onDelete?.(column.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Task Drag and Drop handlers
  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    if (!isAdmin) return;
    e.stopPropagation(); // Prevent column drag
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId, sourceColumnId: column.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    if (!isAdmin) return;
    // Only set isDragOver to false if we're leaving the column card itself
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.taskId) {
        // Drop task into this column (at the end)
        onDrop?.(data.taskId, column.id, data.sourceColumnId);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskDto) => {
    try {
      await createTask(column.id, taskData);
      setShowCreateTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setShowTaskDetailModal(true);
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetailModal(false);
    setSelectedTaskId(null);
  };

  // Get the current task data from Redux state
  const selectedTask = selectedTaskId ? column.tasks?.find(task => task.id === selectedTaskId) || null : null;

  return (
    <div 
      className={`flex flex-col bg-gray-50 rounded-lg min-w-72 max-w-72 h-full transition-all duration-200 ${
        isDragOver 
          ? 'ring-2 ring-orange-400 bg-orange-50 shadow-lg' 
          : 'shadow-sm'
      }`}
      onDragOver={handleColumnDragOver}
      onDragLeave={handleColumnDragLeave}
      onDrop={handleColumnDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSaveEdit}
              className="flex-1 px-2 py-1 text-sm font-medium bg-white border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength={50}
              autoFocus
            />
          ) : (
            <>
              <h3 
                className="text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:text-orange-600 transition-colors truncate"
                onClick={() => isAdmin && setIsEditing(true)}
                title={isAdmin ? column.name : ''}
              >
                {column.name}
              </h3>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {column.tasks?.length || 0}
              </span>
            </>
          )}
        </div>
        
        {isAdmin && !isEditing && (
          <div className="flex items-center space-x-0.5 ml-2">
            {/* Move buttons */}
            {canMoveLeft && (
              <button
                onClick={() => onMove?.(column.id, 'left')}
                className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                title="Mover a la izquierda"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {canMoveRight && (
              <button
                onClick={() => onMove?.(column.id, 'right')}
                className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                title="Mover a la derecha"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Eliminar columna"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {column.tasks && column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing group relative"
              draggable={isAdmin}
              onDragStart={(e) => handleTaskDragStart(e, task.id)}
              style={{
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Drag indicator - visible on hover */}
              {isAdmin && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="8" cy="6" r="1.5"/>
                    <circle cx="8" cy="12" r="1.5"/>
                    <circle cx="8" cy="18" r="1.5"/>
                    <circle cx="14" cy="6" r="1.5"/>
                    <circle cx="14" cy="12" r="1.5"/>
                    <circle cx="14" cy="18" r="1.5"/>
                  </svg>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-1.5">
                <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2 group-hover:text-orange-600 transition-colors prose prose-sm max-w-none prose-headings:font-semibold prose-headings:my-0 prose-headings:text-sm prose-p:my-0">
                  <ReactMarkdown>{task.title}</ReactMarkdown>
                </h4>
                {task.archived && (
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                )}
              </div>
              
              {task.description && (
                <div className="text-gray-600 text-xs line-clamp-2 mb-3 leading-relaxed prose prose-xs max-w-none prose-p:my-0 prose-p:text-xs prose-headings:text-xs prose-headings:my-0">
                  <ReactMarkdown>{task.description}</ReactMarkdown>
                </div>
              )}
              
              {/* Task metadata */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs flex-wrap">
                  {task.deadline && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium ${
                      new Date(task.deadline) < new Date() 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-orange-50 text-orange-700'
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(task.deadline).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {task.estimatedHours && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md text-blue-700 font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{task.estimatedHours}h</span>
                    </div>
                  )}
                </div>
                
                {/* Assigned users avatars */}
                {task.assignedUsers && task.assignedUsers.length > 0 && (
                  <div className="flex -space-x-1.5 ml-auto">
                    {task.assignedUsers.slice(0, 3).map((userTask) => (
                      <div 
                        key={userTask.id}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:scale-110 transition-transform"
                        title={userTask.user?.firstName && userTask.user?.lastName
                          ? `${userTask.user.firstName} ${userTask.user.lastName}`
                          : userTask.user?.username || 'Usuario'}
                      >
                        {userTask.user?.firstName?.charAt(0) || userTask.user?.username?.charAt(0) || 'U'}
                      </div>
                    ))}
                    {task.assignedUsers.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-md">
                        +{task.assignedUsers.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Subtle indicator bar on left edge - changes color on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 group-hover:bg-orange-500 rounded-l-lg transition-colors"></div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-xs font-medium">Arrastra tareas aquí</p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      {isAdmin && (
        <div className="px-2 pb-2 pt-1">
          <button 
            onClick={() => setShowCreateTaskModal(true)}
            className="w-full px-3 py-2.5 text-xs font-semibold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-dashed border-gray-300 hover:border-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
            disabled={isCreatingTask}
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{isCreatingTask ? 'Creando...' : 'Agregar tarea'}</span>
          </button>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={handleCreateTask}
        isLoading={isCreatingTask}
        existingTasksCount={column.tasks?.length || 0}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={showTaskDetailModal}
        onClose={handleCloseTaskDetail}
        task={selectedTask}
      />
    </div>
  );
};

export default ColumnCard;