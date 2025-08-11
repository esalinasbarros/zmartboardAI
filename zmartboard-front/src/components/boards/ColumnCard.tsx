import React, { useState } from 'react';
import type { Column, UpdateColumnDto } from '../../types/boards.types';

interface ColumnCardProps {
  column: Column;
  onUpdate?: (columnId: string, data: UpdateColumnDto) => void;
  onDelete?: (columnId: string) => void;
  onMove?: (columnId: string, direction: 'left' | 'right') => void;
  onDrop?: (draggedColumnId: string, targetColumnId: string) => void;
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

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.dataTransfer.setData('text/plain', column.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isAdmin) return;
    // Only set isDragOver to false if we're leaving the column card itself
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    setIsDragOver(false);
    
    const draggedColumnId = e.dataTransfer.getData('text/plain');
    if (draggedColumnId && draggedColumnId !== column.id) {
      onDrop?.(draggedColumnId, column.id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl p-5 min-w-80 max-w-80 shadow-lg border transition-all duration-200 bg-gradient-to-br from-white to-gray-50 ${
        isDragOver 
          ? 'border-orange-400 shadow-xl ring-2 ring-orange-200 bg-gradient-to-br from-orange-50 to-white' 
          : 'border-gray-200 hover:shadow-xl'
      } ${
        isAdmin ? 'cursor-move' : ''
      }`}
      draggable={isAdmin && !isEditing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex-1 flex items-center space-x-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSaveEdit}
              className="flex-1 px-2 py-1 text-sm font-semibold bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength={50}
              autoFocus
            />
          </div>
        ) : (
          <h3 
            className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors"
            onClick={() => isAdmin && setIsEditing(true)}
            title={isAdmin ? 'Click para editar' : ''}
          >
            {column.name}
          </h3>
        )}
        
        {isAdmin && !isEditing && (
          <div className="flex items-center space-x-1">
            {/* Move buttons */}
            {canMoveLeft && (
              <button
                onClick={() => onMove?.(column.id, 'left')}
                className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                title="Mover a la izquierda"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {canMoveRight && (
              <button
                onClick={() => onMove?.(column.id, 'right')}
                className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                title="Mover a la derecha"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Eliminar columna"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Tasks Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {column.tasks?.length || 0} tareas
        </div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 min-h-32">
        {column.tasks && column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-orange-200 hover:bg-gradient-to-r hover:from-white hover:to-orange-50"
            >
              <h4 className="font-medium text-gray-900 text-sm mb-1">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-gray-600 text-xs line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium text-gray-500">No hay tareas</p>
          </div>
        )}
      </div>

      {/* Add Task Button (placeholder for future implementation) */}
      {isAdmin && (
        <button className="w-full mt-4 py-3 text-sm font-medium text-gray-500 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all duration-200 hover:shadow-sm">
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar tarea</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default ColumnCard;