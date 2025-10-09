import React, { useState, useEffect } from 'react';
import type { Task } from '../../types/boards.types';

interface SetDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, deadline: string | null) => void;
  task: Task | null;
  isLoading?: boolean;
}

const SetDeadlineModal: React.FC<SetDeadlineModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Initialize form data when task changes
  useEffect(() => {
    if (task?.deadline) {
      const deadlineDate = new Date(task.deadline);
      setSelectedDate(deadlineDate.toISOString().split('T')[0]);
      setSelectedTime(deadlineDate.toTimeString().slice(0, 5));
    } else {
      setSelectedDate('');
      setSelectedTime('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SetDeadlineModal: handleSubmit called', { selectedDate, selectedTime, task: task?.id });
    if (task) {
      if (selectedDate) {
        // Create a proper Date object and convert to ISO string with timezone
        const dateTime = selectedTime ? `${selectedDate}T${selectedTime}:00` : `${selectedDate}T23:59:59`;
        const dateObj = new Date(dateTime);
        const isoString = dateObj.toISOString();
        console.log('SetDeadlineModal: Submitting deadline', { taskId: task.id, deadline: isoString });
        onSubmit(task.id, isoString);
      } else {
        console.log('SetDeadlineModal: Removing deadline', { taskId: task.id });
        onSubmit(task.id, null); // Remove deadline
      }
    }
  };

  const handleClose = () => {
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  const handleRemoveDeadline = () => {
    if (task) {
      onSubmit(task.id, null);
    }
  };

  const formatCurrentDeadline = () => {
    if (!task?.deadline) return 'Sin fecha límite';
    const date = new Date(task.deadline);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = task?.deadline && new Date(task.deadline) < new Date();

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-900">Establecer Fecha Límite</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Current Deadline Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Fecha límite actual</h3>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-800'}`}>
                  {formatCurrentDeadline()}
                </span>
                {isOverdue && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Vencida
                  </span>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Input */}
              <div>
                <label htmlFor="deadline-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  id="deadline-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Today's date
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  disabled={isLoading}
                />
              </div>

              {/* Time Input */}
              <div>
                <label htmlFor="deadline-time" className="block text-sm font-medium text-gray-700 mb-2">
                  Hora (opcional)
                </label>
                <input
                  type="time"
                  id="deadline-time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Si no se especifica hora, se establecerá a las 23:59
                </p>
              </div>

              {/* Preview */}
              {selectedDate && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="text-sm font-medium text-orange-800 mb-1">Vista previa:</h4>
                  <p className="text-sm text-orange-700">
                    {new Date(selectedTime ? `${selectedDate}T${selectedTime}:00` : `${selectedDate}T23:59:59`).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    ISO: {new Date(selectedTime ? `${selectedDate}T${selectedTime}:00` : `${selectedDate}T23:59:59`).toISOString()}
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-between space-x-3 pt-4">
                <div className="flex space-x-2">
                  {task.deadline && (
                    <button
                      type="button"
                      onClick={handleRemoveDeadline}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Establecer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SetDeadlineModal;
