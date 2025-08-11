import React, { useState } from 'react';
import type { CreateColumnDto } from '../../types/boards.types';

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (columnData: CreateColumnDto) => void;
  isLoading?: boolean;
  existingColumnsCount?: number;
}

const CreateColumnModal: React.FC<CreateColumnModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  existingColumnsCount = 0,
}) => {
  const [formData, setFormData] = useState<CreateColumnDto>({
    name: '',
    position: existingColumnsCount,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit({
        name: formData.name.trim(),
        position: formData.position,
      });
      setFormData({ name: '', position: existingColumnsCount });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', position: existingColumnsCount });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Columna</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nombre de la columna"
              maxLength={50}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Posición
            </label>
            <select
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isLoading}
            >
              {Array.from({ length: existingColumnsCount + 1 }, (_, index) => (
                <option key={index} value={index}>
                  {index === 0 ? 'Al inicio' : 
                   index === existingColumnsCount ? 'Al final' : 
                   `Posición ${index + 1}`}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona dónde quieres insertar la nueva columna
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Creando...' : 'Crear Columna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColumnModal;