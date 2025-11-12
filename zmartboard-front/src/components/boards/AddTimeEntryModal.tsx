import React, { useState, useEffect } from 'react';
import type { Task, TimeEntry } from '../../types/boards.types';

interface AddTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, hours: number, description?: string, date?: string) => void;
  task: Task | null;
  timeEntry?: TimeEntry | null;
  isLoading?: boolean;
}

const AddTimeEntryModal: React.FC<AddTimeEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  timeEntry = null,
  isLoading = false,
}) => {
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const isEditing = !!timeEntry;

  useEffect(() => {
    if (isOpen) {
      if (timeEntry) {
        setHours(timeEntry.hours.toString());
        setDescription(timeEntry.description || '');
        const entryDate = new Date(timeEntry.date);
        setSelectedDate(entryDate.toISOString().split('T')[0]);
      } else {
        setHours('');
        setDescription('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, timeEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && hours) {
      const hoursNum = parseFloat(hours);
      if (hoursNum >= 0.1 && !isNaN(hoursNum)) {
        // Format date properly - if date is provided, use it, otherwise don't send it
        let dateValue: string | undefined = undefined;
        if (selectedDate) {
          // Create date at midnight in local timezone, then convert to ISO
          const date = new Date(selectedDate + 'T00:00:00');
          dateValue = date.toISOString();
        }
        onSubmit(task.id, hoursNum, description.trim() || undefined, dateValue);
        if (!isEditing) {
          setHours('');
          setDescription('');
          setSelectedDate(new Date().toISOString().split('T')[0]);
        }
      }
    }
  };

  const handleClose = () => {
    setHours('');
    setDescription('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Tiempo' : 'Registrar Tiempo'}
            </h2>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hours Input */}
            <div>
              <label htmlFor="time-entry-hours" className="block text-sm font-medium text-gray-700 mb-2">
                Horas trabajadas *
              </label>
              <input
                type="number"
                id="time-entry-hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="0.1"
                step="0.1"
                placeholder="3.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                disabled={isLoading}
                autoFocus
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 0.1 horas
              </p>
            </div>

            {/* Date Input */}
            <div>
              <label htmlFor="time-entry-date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                id="time-entry-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                disabled={isLoading}
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="time-entry-description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                id="time-entry-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe qué trabajo realizaste..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
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
                disabled={isLoading || !hours || parseFloat(hours) < 0.1}
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
                    <span>{isEditing ? 'Guardar' : 'Registrar'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTimeEntryModal;

