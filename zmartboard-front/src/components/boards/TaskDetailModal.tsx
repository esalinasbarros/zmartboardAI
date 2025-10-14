import React, { useState } from 'react';
import type { Task } from '../../types/boards.types';
import { useUpdateTask } from '../../store/boards/boardsHooks';
import SetDeadlineModal from './SetDeadlineModal';
import SetEstimatedHoursModal from './SetEstimatedHoursModal';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showEstimatedHoursModal, setShowEstimatedHoursModal] = useState(false);
  const { updateTask, isLoading: isUpdatingTask } = useUpdateTask();
  if (!isOpen || !task) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date();

  const handleStartEditTitle = () => {
    setEditTitle(task.title);
    setIsEditingTitle(true);
  };

  const handleStartEditDescription = () => {
    setEditDescription(task.description || '');
    setIsEditingDescription(true);
  };

  const handleSaveTitle = async () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      try {
        await updateTask(task.id, { title: editTitle.trim() });
        setIsEditingTitle(false);
      } catch (error) {
        console.error('Error updating task title:', error);
      }
    } else {
      setIsEditingTitle(false);
    }
  };

  const handleSaveDescription = async () => {
    const newDescription = editDescription.trim() || undefined;
    if (newDescription !== task.description) {
      try {
        await updateTask(task.id, { description: newDescription });
        setIsEditingDescription(false);
      } catch (error) {
        console.error('Error updating task description:', error);
      }
    } else {
      setIsEditingDescription(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSetDeadline = async (taskId: string, deadline: string | null) => {
    console.log('TaskDetailModal: handleSetDeadline called', { taskId, deadline });
    try {
      console.log('TaskDetailModal: Calling updateTask with', { taskId, deadline: deadline || undefined });
      await updateTask(taskId, { deadline: deadline || undefined });
      console.log('TaskDetailModal: updateTask completed successfully');
      setShowDeadlineModal(false);
    } catch (error) {
      console.error('TaskDetailModal: Error setting deadline:', error);
    }
  };

  const handleCloseDeadlineModal = () => {
    setShowDeadlineModal(false);
  };

  const handleSetEstimatedHours = async (taskId: string, estimatedHours: number | null) => {
    console.log('TaskDetailModal: handleSetEstimatedHours called', { taskId, estimatedHours });
    try {
      console.log('TaskDetailModal: Calling updateTask with', { taskId, estimatedHours: estimatedHours || undefined });
      await updateTask(taskId, { estimatedHours: estimatedHours || undefined });
      console.log('TaskDetailModal: updateTask completed successfully');
      setShowEstimatedHoursModal(false);
    } catch (error) {
      console.error('TaskDetailModal: Error setting estimated hours:', error);
    }
  };

  const handleCloseEstimatedHoursModal = () => {
    setShowEstimatedHoursModal(false);
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            {isEditingTitle ? (
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-orange-500 focus:outline-none focus:border-orange-600 flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveTitle();
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors duration-200"
                  title="Guardar"
                  disabled={isUpdatingTask}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
                  title="Cancelar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 flex-1">
                <h2 className="text-xl font-semibold text-gray-900 truncate flex-1">
                  {task.title}
                </h2>
                <button
                  onClick={handleStartEditTitle}
                  className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors duration-200"
                  title="Editar título"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
            {task.archived && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Archivada
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descripción
                </h3>
                {!isEditingDescription && (
                  <button
                    onClick={handleStartEditDescription}
                    className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors duration-200"
                    title="Editar descripción"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100 min-h-[100px]">
                {isEditingDescription ? (
                  <div className="space-y-3">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                      rows={4}
                      placeholder="Describe los detalles de la tarea..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {editDescription.length}/1000 caracteres
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSaveDescription}
                          className="px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors duration-200 flex items-center space-x-1"
                          disabled={isUpdatingTask}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Guardar</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {task.description ? (
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{task.description}</p>
                    ) : (
                      <p className="text-gray-500 italic">Sin descripción</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Time Entries */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registro de tiempo
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100">
                {task.timeEntries && task.timeEntries.length > 0 ? (
                  <div className="space-y-3">
                    {task.timeEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {entry.user?.firstName?.charAt(0) || entry.user?.username?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {entry.user?.firstName && entry.user?.lastName
                                ? `${entry.user.firstName} ${entry.user.lastName}`
                                : entry.user?.username || 'Usuario'}
                            </p>
                            {entry.description && (
                              <p className="text-xs text-gray-600">{entry.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{entry.hours}h</p>
                          <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Sin registro de tiempo</p>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comentarios
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100">
                {task.comments && task.comments.length > 0 ? (
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-800 leading-relaxed">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDateTime(comment.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Sin comentarios</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 overflow-y-auto">
            {/* Task Details */}
            <div className="space-y-6">
              {/* Status & Position */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Estado</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${task.archived ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                  <span className="text-sm text-gray-800">
                    {task.archived ? 'Archivada' : 'Activa'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Posición #{task.position + 1}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Fecha límite</h3>
                <div className="flex items-center space-x-2">
                  {task.deadline ? (
                    <>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-800'}`}>
                          {formatDate(task.deadline)}
                        </span>
                        {isOverdue && (
                          <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full mt-1 inline-block">
                            Vencida
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">Sin fecha límite</span>
                  )}
                </div>
              </div>

              {/* Estimated Hours */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Horas estimadas</h3>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-800">
                    {task.estimatedHours ? `${task.estimatedHours}h` : 'Sin estimación'}
                  </span>
                </div>
              </div>

              {/* Assigned Users */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Usuarios asignados</h3>
                <div className="space-y-3">
                  {task.assignedUsers && task.assignedUsers.length > 0 ? (
                    task.assignedUsers.map((userTask) => (
                      <div key={userTask.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">
                            {userTask.user?.firstName?.charAt(0) || userTask.user?.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {userTask.user?.firstName && userTask.user?.lastName
                              ? `${userTask.user.firstName} ${userTask.user.lastName}`
                              : userTask.user?.username || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Asignado el {formatDate(userTask.assignedAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">Sin usuarios asignados</p>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Información</h3>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Creada:</span><br />
                    {formatDateTime(task.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Actualizada:</span><br />
                    {formatDateTime(task.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-gray-200 p-6 pb-8 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-wrap gap-3">
            {/* Placeholder buttons for future functionality */}
            <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Asignar usuarios</span>
            </button>

            <button 
              onClick={() => setShowDeadlineModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Establecer fecha límite</span>
            </button>

                    <button
                      onClick={() => setShowEstimatedHoursModal(true)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Establecer horas</span>
                    </button>

            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Agregar comentario</span>
            </button>

          </div>
        </div>
      </div>

      {/* Set Deadline Modal */}
      <SetDeadlineModal
        isOpen={showDeadlineModal}
        onClose={handleCloseDeadlineModal}
        onSubmit={handleSetDeadline}
        task={task}
        isLoading={isUpdatingTask}
      />

      {/* Set Estimated Hours Modal */}
      <SetEstimatedHoursModal
        isOpen={showEstimatedHoursModal}
        onClose={handleCloseEstimatedHoursModal}
        onSubmit={handleSetEstimatedHours}
        task={task}
        isLoading={isUpdatingTask}
      />
    </div>
  );
};

export default TaskDetailModal;
