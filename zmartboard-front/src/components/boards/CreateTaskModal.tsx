import React, { useState } from 'react';
import type { CreateTaskDto } from '../../types/boards.types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskDto) => void;
  isLoading?: boolean;
  existingTasksCount?: number;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  existingTasksCount = 0,
}) => {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    position: existingTasksCount,
  });

  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'El título no puede exceder 200 caracteres';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        position: formData.position,
      });
      setFormData({ title: '', description: '', position: existingTasksCount });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', position: existingTasksCount });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof CreateTaskDto, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Tarea</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                errors.title 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              placeholder="Título de la tarea"
              maxLength={200}
              required
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none ${
                errors.description 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              placeholder="Descripción de la tarea (opcional)"
              maxLength={1000}
              rows={3}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.description?.length || 0}/1000 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Posición
            </label>
            <select
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            >
              {Array.from({ length: existingTasksCount + 1 }, (_, index) => (
                <option key={index} value={index}>
                  {index === 0 ? 'Al inicio' : 
                   index === existingTasksCount ? 'Al final' : 
                   `Posición ${index + 1}`}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona dónde quieres insertar la nueva tarea
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
