import React, { useState, useEffect } from 'react';
import type { Task } from '../../types/boards.types';

interface SetEstimatedHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, estimatedHours: number | null) => void;
  task: Task | null;
  isLoading?: boolean;
}

const SetEstimatedHoursModal: React.FC<SetEstimatedHoursModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading = false,
}) => {
  const [estimatedHours, setEstimatedHours] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && task?.estimatedHours) {
      setEstimatedHours(task.estimatedHours.toString());
    } else if (isOpen) {
      setEstimatedHours('');
    }
    setError(null);
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const handleClose = () => {
    setEstimatedHours('');
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SetEstimatedHoursModal: handleSubmit called', { estimatedHours, task: task?.id });
    
    setError(null);
    
    if (!estimatedHours.trim()) {
      setError('Las horas estimadas son requeridas.');
      return;
    }

    const hours = parseFloat(estimatedHours);
    
    if (isNaN(hours)) {
      setError('Por favor ingresa un número válido.');
      return;
    }

    if (hours < 0.1) {
      setError('Las horas estimadas deben ser al menos 0.1.');
      return;
    }

    if (hours > 999) {
      setError('Las horas estimadas no pueden ser mayores a 999.');
      return;
    }

    console.log('SetEstimatedHoursModal: Submitting estimated hours', { taskId: task.id, estimatedHours: hours });
    onSubmit(task.id, hours);
  };

  const handleRemoveHours = () => {
    console.log('SetEstimatedHoursModal: Removing estimated hours', { taskId: task.id });
    onSubmit(task.id, null);
  };

  const formatCurrentHours = () => {
    if (!task?.estimatedHours) return 'Sin horas estimadas';
    return `${task.estimatedHours}h`;
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-900">Establecer Horas Estimadas</h2>
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
        <div className="p-6 overflow-y-auto">
          {/* Current Hours Display */}
          <div className="mb-4 p-3 rounded-lg border bg-orange-50 border-orange-200">
            <p className="text-sm font-medium text-orange-800">
              Horas estimadas actuales:
            </p>
            <p className="text-base text-orange-700">
              {formatCurrentHours()}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hours Input */}
            <div>
              <label htmlFor="estimated-hours" className="block text-sm font-medium text-gray-700 mb-2">
                Horas estimadas *
              </label>
              <input
                type="number"
                id="estimated-hours"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                min="0.1"
                max="999"
                step="0.1"
                placeholder="Ej: 8.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Ingresa el número de horas estimadas para completar esta tarea (0.1 - 999)
              </p>
            </div>

            {/* Preview */}
            {estimatedHours && !error && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="text-sm font-medium text-orange-800 mb-1">Vista previa:</h4>
                <p className="text-sm text-orange-700">
                  {parseFloat(estimatedHours) || 0}h estimadas
                </p>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </p>
            )}

            {/* Form Actions */}
            <div className="flex justify-between space-x-3 pt-4">
              <div className="flex space-x-2">
                {task.estimatedHours && (
                  <button
                    type="button"
                    onClick={handleRemoveHours}
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
  );
};

export default SetEstimatedHoursModal;
