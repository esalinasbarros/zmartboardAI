import React, { useState, useEffect } from 'react';
import type { Task } from '../../types/boards.types';
import type { ProjectMember } from '../../types/projects.types';
import { useTaskAssignments } from '../../store/boards/boardsHooks';
import { useCurrentProject } from '../../store/projects/projectsHooks';

interface AssignUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const AssignUsersModal: React.FC<AssignUsersModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const currentProject = useCurrentProject();
  const { assignUser, unassignUser, isLoading } = useTaskAssignments();
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Initialize selected users from task assignments
  useEffect(() => {
    if (task?.assignedUsers) {
      const assignedIds = new Set(task.assignedUsers.map(ut => ut.userId));
      setSelectedUserIds(assignedIds);
    }
  }, [task]);

  if (!isOpen || !task || !currentProject) return null;

  const projectMembers = currentProject.members || [];
  const assignedUserIds = task.assignedUsers?.map(ut => ut.userId) || [];

  const handleToggleUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const handleSave = async () => {
    if (!task) return;

    try {
      // Find users to assign (in selected but not in assigned)
      const toAssign = Array.from(selectedUserIds).filter(
        userId => !assignedUserIds.includes(userId)
      );

      // Find users to unassign (in assigned but not in selected)
      const toUnassign = assignedUserIds.filter(
        userId => !selectedUserIds.has(userId)
      );

      // Perform assignments sequentially to avoid race conditions
      for (const userId of toAssign) {
        await assignUser(task.id, userId);
      }
      
      for (const userId of toUnassign) {
        await unassignUser(task.id, userId);
      }

      onClose();
    } catch (error) {
      console.error('Error updating task assignments:', error);
    }
  };

  const getUserDisplayName = (member: ProjectMember) => {
    if (member.user.firstName && member.user.lastName) {
      return `${member.user.firstName} ${member.user.lastName}`;
    }
    return member.user.username || member.user.email;
  };

  const getUserInitials = (member: ProjectMember) => {
    if (member.user.firstName) {
      return member.user.firstName.charAt(0).toUpperCase();
    }
    return member.user.username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Asignar usuarios</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {projectMembers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No hay miembros en el proyecto
            </p>
          ) : (
            <div className="space-y-2">
              {projectMembers.map((member) => {
                const isSelected = selectedUserIds.has(member.user.id);
                return (
                  <label
                    key={member.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-white border-gray-200 hover:border-orange-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleUser(member.user.id)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                      disabled={isLoading}
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {getUserInitials(member)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getUserDisplayName(member)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.user.email}
                      </p>
                    </div>
                    {isSelected && (
                      <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUsersModal;

