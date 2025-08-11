import React, { useState, useEffect } from 'react';
import type { UpdateBoardDto } from '../../types/boards.types';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (boardData: UpdateBoardDto) => void;
  isLoading?: boolean;
  initialTitle?: string;
  initialDescription?: string;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialTitle = '',
  initialDescription = '',
}) => {
  const [formData, setFormData] = useState<UpdateBoardDto>({
    title: initialTitle,
    description: initialDescription,
  });

  // Update form data when initial values change
  useEffect(() => {
    setFormData({
      title: initialTitle,
      description: initialDescription,
    });
  }, [initialTitle, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title?.trim()) {
      onSubmit({
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
      });
    }
  };

  const handleClose = () => {
    setFormData({
      title: initialTitle,
      description: initialDescription,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Editar Tablero</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ingresa el título del tablero"
              maxLength={100}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Descripción opcional del tablero"
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.title?.trim()}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBoardModal;