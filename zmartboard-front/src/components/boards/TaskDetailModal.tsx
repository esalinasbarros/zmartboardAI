import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Task, TimeEntry } from '../../types/boards.types';
import { useUpdateTask, useTaskAssignments, useComments, useTimeEntries } from '../../store/boards/boardsHooks';
import { createTimeEntry, updateTimeEntry, deleteTimeEntry } from '../../store/boards/boardsSlice';
import { useUser } from '../../store/auth/authHooks';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { tasksApi } from '../../services/tasks.api';
import SetDeadlineModal from './SetDeadlineModal';
import SetEstimatedHoursModal from './SetEstimatedHoursModal';
import AssignUsersModal from './AssignUsersModal';
import AddCommentModal from './AddCommentModal';
import AddTimeEntryModal from './AddTimeEntryModal';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task: initialTask,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showEstimatedHoursModal, setShowEstimatedHoursModal] = useState(false);
  const [showAssignUsersModal, setShowAssignUsersModal] = useState(false);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [showAddTimeEntryModal, setShowAddTimeEntryModal] = useState(false);
  const [editingTimeEntry, setEditingTimeEntry] = useState<TimeEntry | null>(null);
  const [task, setTask] = useState<Task | null>(initialTask);
  const { updateTask, isLoading: isUpdatingTask } = useUpdateTask();
  const { unassignUser, isLoading: isUnassigning } = useTaskAssignments();
  const { addComment, editComment, removeComment, isLoading: isAddingComment } = useComments();
  const { addTimeEntry, editTimeEntry, removeTimeEntry, isLoading: isTimeEntryLoading } = useTimeEntries();
  const currentUser = useUser();
  const toast = useToastNotifications();

  // Update task when initialTask prop changes or when modal opens
  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  // Refresh task data when assignments change (after modal closes)
  useEffect(() => {
    if (isOpen && initialTask && !showAssignUsersModal && !showAddCommentModal && !showAddTimeEntryModal) {
      const refreshTask = async () => {
        try {
          const refreshedTask = await tasksApi.getTaskById(initialTask.id);
          setTask(refreshedTask);
        } catch (error) {
          console.error('Error refreshing task:', error);
        }
      };
      refreshTask();
    }
  }, [isOpen, initialTask, showAssignUsersModal, showAddCommentModal, showAddTimeEntryModal]);

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
        toast.task.updateTitleSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.task.updateTitleError(errorMessage);
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
        toast.task.updateDescriptionSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.task.updateDescriptionError(errorMessage);
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
    try {
      await updateTask(taskId, { deadline: deadline || undefined });
      setShowDeadlineModal(false);
      toast.task.setDeadlineSuccess();
      // Refresh task data
      const refreshedTask = await tasksApi.getTaskById(taskId);
      setTask(refreshedTask);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.task.setDeadlineError(errorMessage);
    }
  };

  const handleCloseDeadlineModal = () => {
    setShowDeadlineModal(false);
  };

  const handleSetEstimatedHours = async (taskId: string, estimatedHours: number | null) => {
    try {
      await updateTask(taskId, { estimatedHours: estimatedHours || undefined });
      setShowEstimatedHoursModal(false);
      toast.task.setEstimatedHoursSuccess();
      // Refresh task data
      const refreshedTask = await tasksApi.getTaskById(taskId);
      setTask(refreshedTask);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.task.setEstimatedHoursError(errorMessage);
    }
  };

  const handleUnassignUser = async (userId: string) => {
    if (!task) return;
    if (window.confirm('¿Estás seguro de que quieres desasignar a este usuario?')) {
      try {
        await unassignUser(task.id, userId);
        toast.task.unassignUserSuccess();
        // Refresh task data
        const refreshedTask = await tasksApi.getTaskById(task.id);
        setTask(refreshedTask);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.task.unassignUserError(errorMessage);
      }
    }
  };

  const handleAddComment = async (taskId: string, content: string) => {
    try {
      await addComment(taskId, content);
      setShowAddCommentModal(false);
      toast.task.createCommentSuccess();
      // Refresh task data
      const refreshedTask = await tasksApi.getTaskById(taskId);
      setTask(refreshedTask);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.task.createCommentError(errorMessage);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!task) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await removeComment(commentId, task.id);
        toast.task.deleteCommentSuccess();
        // Refresh task data
        const refreshedTask = await tasksApi.getTaskById(task.id);
        setTask(refreshedTask);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.task.deleteCommentError(errorMessage);
      }
    }
  };

  const handleStartEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!task || !editCommentContent.trim()) return;
    try {
      await editComment(commentId, editCommentContent.trim());
      setEditingCommentId(null);
      setEditCommentContent('');
      toast.task.updateCommentSuccess();
      // Refresh task data
      const refreshedTask = await tasksApi.getTaskById(task.id);
      setTask(refreshedTask);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.task.updateCommentError(errorMessage);
    }
  };

  const handleAddTimeEntry = async (taskId: string, hours: number, description?: string, date?: string) => {
    try {
      const result = await addTimeEntry(taskId, hours, description, date);
      if (createTimeEntry.fulfilled.match(result)) {
        setShowAddTimeEntryModal(false);
        setEditingTimeEntry(null);
        toast.task.createTimeEntrySuccess();
        // Refresh task data - Redux already updates, but we need to sync local state
        if (result.payload?.task) {
          setTask(result.payload.task);
        } else {
          const refreshedTask = await tasksApi.getTaskById(taskId);
          setTask(refreshedTask);
        }
      } else {
        const errorMessage = result.payload as string || 'Error al registrar el tiempo';
        toast.task.createTimeEntryError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar el tiempo';
      toast.task.createTimeEntryError(errorMessage);
    }
  };

  const handleEditTimeEntry = async (timeEntryId: string, hours: number, description?: string, date?: string) => {
    try {
      const result = await editTimeEntry(timeEntryId, hours, description, date);
      if (updateTimeEntry.fulfilled.match(result)) {
        setShowAddTimeEntryModal(false);
        setEditingTimeEntry(null);
        toast.task.updateTimeEntrySuccess();
        // Refresh task data - Redux already updates, but we need to sync local state
        if (result.payload?.task) {
          setTask(result.payload.task);
        } else if (task) {
          const refreshedTask = await tasksApi.getTaskById(task.id);
          setTask(refreshedTask);
        }
      } else {
        const errorMessage = result.payload as string || 'Error al actualizar el tiempo';
        toast.task.updateTimeEntryError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el tiempo';
      toast.task.updateTimeEntryError(errorMessage);
    }
  };

  const handleDeleteTimeEntry = async (timeEntryId: string) => {
    if (!task) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de tiempo?')) {
      try {
        const result = await removeTimeEntry(timeEntryId, task.id);
        if (deleteTimeEntry.fulfilled.match(result)) {
          toast.task.deleteTimeEntrySuccess();
          // Refresh task data
          if (result.payload?.task) {
            setTask(result.payload.task);
          } else {
            const refreshedTask = await tasksApi.getTaskById(task.id);
            setTask(refreshedTask);
          }
        } else {
          const errorMessage = result.payload as string || 'Error al eliminar el tiempo';
          toast.task.deleteTimeEntryError(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el tiempo';
        toast.task.deleteTimeEntryError(errorMessage);
      }
    }
  };

  const handleStartEditTimeEntry = (timeEntry: TimeEntry) => {
    setEditingTimeEntry(timeEntry);
    setShowAddTimeEntryModal(true);
  };

  const handleCloseEstimatedHoursModal = () => {
    setShowEstimatedHoursModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-white px-3 py-1 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1"
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
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Guardar"
                  disabled={isUpdatingTask}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                  title="Cancelar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 flex-1 prose prose-sm max-w-none prose-headings:font-semibold prose-headings:my-0">
                  <ReactMarkdown>{task.title}</ReactMarkdown>
                </h2>
                <button
                  onClick={handleStartEditTitle}
                  className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors flex-shrink-0"
                  title="Editar título"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {task.archived && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                    Archivada
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1 hover:bg-gray-200 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(92vh-80px)]">
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Descripción
                </h3>
                {!isEditingDescription && (
                  <button
                    onClick={handleStartEditDescription}
                    className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Editar descripción"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[80px]">
                {isEditingDescription ? (
                  <div className="space-y-2">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-3 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-sm"
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
                          className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded transition-colors flex items-center space-x-1"
                          disabled={isUpdatingTask}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Guardar</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cursor-pointer" onClick={handleStartEditDescription}>
                    {task.description ? (
                      <div className="prose prose-sm max-w-none text-sm text-gray-700 leading-relaxed prose-headings:font-semibold prose-p:my-2">
                        <ReactMarkdown>{task.description}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Click para agregar descripción...</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Time Entries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tiempo registrado
                </h3>
                {task.assignedUsers && task.assignedUsers.some(ut => ut.userId === currentUser?.id) && (
                  <button
                    onClick={() => {
                      setEditingTimeEntry(null);
                      setShowAddTimeEntryModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Registrar tiempo"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <div className="max-h-96 overflow-y-auto p-3 space-y-2">
                  {task.timeEntries && task.timeEntries.length > 0 ? (
                    task.timeEntries.map((entry) => {
                      const isOwner = currentUser?.id === entry.userId;
                      return (
                        <div key={entry.id} className="p-2 bg-white rounded-lg border border-gray-200 hover:border-orange-200 transition-colors group">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-blue-600">
                                  {entry.user?.firstName?.charAt(0) || entry.user?.username?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate">
                                  {entry.user?.firstName && entry.user?.lastName
                                    ? `${entry.user.firstName} ${entry.user.lastName}`
                                    : entry.user?.username || 'Usuario'}
                                </p>
                                {entry.date && (
                                  <p className="text-xs text-gray-500">
                                    {formatDate(entry.date)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-gray-800">{entry.hours}h</span>
                              {isOwner && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleStartEditTimeEntry(entry)}
                                    className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                    title="Editar tiempo"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTimeEntry(entry.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Eliminar tiempo"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        {entry.description && (
                          <div className="prose prose-xs max-w-none text-xs text-gray-600 mt-1 pl-8 prose-p:my-1">
                            <ReactMarkdown>{entry.description}</ReactMarkdown>
                          </div>
                        )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-xs text-gray-400 mb-1">Sin tiempo registrado</p>
                      {task.assignedUsers && !task.assignedUsers.some(ut => ut.userId === currentUser?.id) && (
                        <p className="text-xs text-orange-600 italic">Debes estar asignado a esta tarea para registrar tiempo</p>
                      )}
                    </div>
                  )}
                </div>
                {task.timeEntries && task.timeEntries.length > 0 && (
                  <div className="px-3 py-2 border-t border-gray-200 bg-white rounded-b-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">Total:</span>
                      <span className="text-sm font-bold text-orange-600">
                        {task.timeEntries.reduce((sum, e) => sum + e.hours, 0).toFixed(1)}h
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comentarios
              </h3>
              <div className="space-y-3">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment) => {
                    const isOwner = currentUser?.id === comment.userId;
                    const isEditing = editingCommentId === comment.id;
                    const isEdited = new Date(comment.updatedAt).getTime() !== new Date(comment.createdAt).getTime();
                    return (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 group hover:border-orange-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-2 flex-1 min-w-0">
                            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {comment.user?.firstName?.charAt(0) || comment.user?.username?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-700">
                                {comment.user?.firstName && comment.user?.lastName
                                  ? `${comment.user.firstName} ${comment.user.lastName}`
                                  : comment.user?.username || 'Usuario'}
                              </p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500">
                                  {formatDateTime(comment.createdAt)}
                                </p>
                                {isEdited && (
                                  <span className="text-xs text-gray-400 italic">(editado)</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {isOwner && !isEditing && (
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEditComment(comment.id, comment.content)}
                                className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors flex-shrink-0"
                                title="Editar comentario"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                                title="Eliminar comentario"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <textarea
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              rows={4}
                              maxLength={2000}
                              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  handleCancelEditComment();
                                }
                              }}
                            />
                            <p className="text-xs text-gray-500">
                              {editCommentContent.length}/2000 caracteres
                            </p>
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={handleCancelEditComment}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveEditComment(comment.id)}
                                disabled={!editCommentContent.trim() || editCommentContent.trim() === comment.content}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Guardar</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none text-sm text-gray-800 leading-relaxed prose-p:my-2">
                            <ReactMarkdown>{comment.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-lg border border-gray-200">Sin comentarios</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            {/* Actions Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Acciones</h3>
              <div className="space-y-2">
                {/* Assign Users Button */}
                <button 
                  onClick={() => setShowAssignUsersModal(true)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-sm font-medium text-gray-700 hover:text-orange-600 rounded-lg transition-all flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span>Asignar usuario</span>
                </button>

                {/* Add Comment Button */}
                <button 
                  onClick={() => setShowAddCommentModal(true)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-sm font-medium text-gray-700 hover:text-orange-600 rounded-lg transition-all flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Agregar comentario</span>
                </button>
              </div>
            </div>

            {/* Deadline Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fecha límite</h3>
                <button 
                  onClick={() => setShowDeadlineModal(true)}
                  className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  title="Editar fecha"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              <div 
                onClick={() => setShowDeadlineModal(true)}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group"
              >
                {task.deadline ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800 group-hover:text-orange-600'}`}>
                        {formatDate(task.deadline)}
                      </span>
                      {isOverdue && (
                        <div className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded mt-1 inline-block">
                          Vencida
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400 group-hover:text-orange-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm">Agregar fecha límite</span>
                  </div>
                )}
              </div>
            </div>

            {/* Estimated Hours Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tiempo estimado</h3>
                <button 
                  onClick={() => setShowEstimatedHoursModal(true)}
                  className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  title="Editar horas"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              <div 
                onClick={() => setShowEstimatedHoursModal(true)}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group"
              >
                {task.estimatedHours ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-600">{task.estimatedHours}h estimadas</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400 group-hover:text-orange-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm">Agregar estimación</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Users Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Asignados</h3>
                {task.assignedUsers && task.assignedUsers.length > 0 && (
                  <button
                    onClick={() => setShowAssignUsersModal(true)}
                    className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                    title="Editar asignaciones"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {task.assignedUsers && task.assignedUsers.length > 0 ? (
                  task.assignedUsers.map((userTask) => {

                    return (
                      <div key={userTask.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-orange-200 transition-colors group">
                        <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {userTask.user?.firstName?.charAt(0) || userTask.user?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {userTask.user?.firstName && userTask.user?.lastName
                              ? `${userTask.user.firstName} ${userTask.user.lastName}`
                              : userTask.user?.username || 'Usuario'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassignUser(userTask.userId);
                          }}
                          disabled={isUnassigning}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          title="Desasignar usuario"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 text-center py-3 bg-white rounded-lg border border-gray-200">Sin asignar</p>
                )}
              </div>
            </div>

            {/* Status & Metadata */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Información</h3>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Estado:</span>
                  <span className={`font-medium ${task.archived ? 'text-gray-600' : 'text-green-600'}`}>
                    {task.archived ? 'Archivada' : 'Activa'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Posición:</span>
                  <span className="font-medium">#{task.position + 1}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="mb-1">
                    <span className="font-medium">Creada:</span>
                    <div className="text-gray-400">{formatDateTime(task.createdAt)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Actualizada:</span>
                    <div className="text-gray-400">{formatDateTime(task.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Assign Users Modal */}
      <AssignUsersModal
        isOpen={showAssignUsersModal}
        onClose={async () => {
          setShowAssignUsersModal(false);
          // Refresh task data after closing assignment modal
          if (task) {
            try {
              const refreshedTask = await tasksApi.getTaskById(task.id);
              setTask(refreshedTask);
            } catch (error) {
              console.error('Error refreshing task:', error);
            }
          }
        }}
        task={task}
      />

      {/* Add Comment Modal */}
      <AddCommentModal
        isOpen={showAddCommentModal}
        onClose={() => setShowAddCommentModal(false)}
        onSubmit={handleAddComment}
        task={task}
        isLoading={isAddingComment}
      />

      {/* Add/Edit Time Entry Modal */}
      <AddTimeEntryModal
        isOpen={showAddTimeEntryModal}
        onClose={() => {
          setShowAddTimeEntryModal(false);
          setEditingTimeEntry(null);
        }}
        onSubmit={editingTimeEntry 
          ? (_taskId, hours, description, date) => handleEditTimeEntry(editingTimeEntry.id, hours, description, date)
          : handleAddTimeEntry
        }
        task={task}
        timeEntry={editingTimeEntry}
        isLoading={isTimeEntryLoading}
      />
    </div>
  );
};

export default TaskDetailModal;
