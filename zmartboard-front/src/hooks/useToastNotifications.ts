import { useToast } from '../contexts/ToastContext';

// Custom hook with predefined common toast messages
export const useToastNotifications = () => {
  const toast = useToast();

  const authToasts = {
    loginSuccess: () => toast.showSuccess('Welcome back! You have been successfully logged in.'),
    loginError: (message?: string) => toast.showError(message || 'Login failed. Please check your credentials.'),
    registerSuccess: () => toast.showSuccess('Account created successfully! Welcome to ZmartBoard.'),
    registerError: (message?: string) => toast.showError(message || 'Registration failed. Please try again.'),
    logoutSuccess: () => toast.showSuccess('You have been successfully logged out.'),
    sessionExpired: () => toast.showWarning('Your session has expired. Please log in again.'),
    authError: (message?: string) => toast.showError(message || 'Authentication error. Please log in again.'),
  };

  const apiToasts = {
    networkError: () => toast.showError('Network error. Please check your connection and try again.'),
    serverError: () => toast.showError('Server error. Please try again later.'),
    unauthorized: () => toast.showError('You are not authorized to perform this action.'),
    forbidden: () => toast.showError('Access denied. You do not have permission to access this resource.'),
  };

  const projectToasts = {
    createSuccess: () => toast.showSuccess('¡Proyecto creado exitosamente!'),
    createError: (message?: string) => toast.showError(message || 'Error al crear el proyecto. Por favor intenta de nuevo.'),
    updateSuccess: (message?: string) => toast.showSuccess(message || '¡Proyecto actualizado exitosamente!'),
    updateError: (message?: string) => toast.showError(message || 'Error al actualizar el proyecto. Por favor intenta de nuevo.'),
    deleteSuccess: () => toast.showSuccess('¡Proyecto eliminado exitosamente!'),
    deleteError: (message?: string) => toast.showError(message || 'Error al eliminar el proyecto. Por favor intenta de nuevo.'),
    fetchError: (message?: string) => toast.showError(message || 'Error al cargar los proyectos. Por favor recarga la página.'),
    loadingCreate: () => toast.showLoading('Creando proyecto...'),
    loadingUpdate: () => toast.showLoading('Actualizando proyecto...'),
    loadingDelete: () => toast.showLoading('Eliminando proyecto...'),
  };

  const invitationToasts = {
    sendSuccess: () => toast.showSuccess('¡Invitación enviada exitosamente!'),
    sendError: (message?: string) => toast.showError(message || 'Error al enviar la invitación. Por favor intenta de nuevo.'),
    acceptSuccess: () => toast.showSuccess('¡Invitación aceptada! Ya eres miembro del proyecto.'),
    acceptError: (message?: string) => toast.showError(message || 'Error al aceptar la invitación. Por favor intenta de nuevo.'),
    rejectSuccess: () => toast.showSuccess('Invitación rechazada.'),
    rejectError: (message?: string) => toast.showError(message || 'Error al rechazar la invitación. Por favor intenta de nuevo.'),
    cancelSuccess: () => toast.showSuccess('¡Invitación cancelada exitosamente!'),
    cancelError: (message?: string) => toast.showError(message || 'Error al cancelar la invitación. Por favor intenta de nuevo.'),
    fetchError: (message?: string) => toast.showError(message || 'Error al cargar las invitaciones. Por favor recarga la página.'),
  };

  const boardToasts = {
    createSuccess: () => toast.showSuccess('¡Tablero creado exitosamente!'),
    createError: (message?: string) => toast.showError(message || 'Error al crear el tablero. Por favor intenta de nuevo.'),
    updateSuccess: () => toast.showSuccess('¡Tablero actualizado exitosamente!'),
    updateError: (message?: string) => toast.showError(message || 'Error al actualizar el tablero. Por favor intenta de nuevo.'),
    deleteSuccess: () => toast.showSuccess('¡Tablero eliminado exitosamente!'),
    deleteError: (message?: string) => toast.showError(message || 'Error al eliminar el tablero. Por favor intenta de nuevo.'),
    fetchError: (message?: string) => toast.showError(message || 'Error al cargar los tableros. Por favor recarga la página.'),
    loadingCreate: () => toast.showLoading('Creando tablero...'),
    loadingUpdate: () => toast.showLoading('Actualizando tablero...'),
    loadingDelete: () => toast.showLoading('Eliminando tablero...'),
  };

  const columnToasts = {
    createSuccess: () => toast.showSuccess('¡Columna creada exitosamente!'),
    createError: (message?: string) => toast.showError(message || 'Error al crear la columna. Por favor intenta de nuevo.'),
    updateSuccess: () => toast.showSuccess('¡Columna actualizada exitosamente!'),
    updateError: (message?: string) => toast.showError(message || 'Error al actualizar la columna. Por favor intenta de nuevo.'),
    deleteSuccess: () => toast.showSuccess('¡Columna eliminada exitosamente!'),
    deleteError: (message?: string) => toast.showError(message || 'Error al eliminar la columna. Por favor intenta de nuevo.'),
    moveSuccess: () => toast.showSuccess('¡Columna movida exitosamente!'),
    moveError: (message?: string) => toast.showError(message || 'Error al mover la columna. Por favor intenta de nuevo.'),
  };

  const generalToasts = {
    saveSuccess: () => toast.showSuccess('¡Cambios guardados exitosamente!'),
    saveError: () => toast.showError('Error al guardar los cambios. Por favor intenta de nuevo.'),
    deleteSuccess: () => toast.showSuccess('¡Elemento eliminado exitosamente!'),
    deleteError: () => toast.showError('Error al eliminar el elemento. Por favor intenta de nuevo.'),
    copySuccess: () => toast.showInfo('¡Copiado al portapapeles!'),
  };

  return {
    ...toast,
    auth: authToasts,
    api: apiToasts,
    project: projectToasts,
    invitation: invitationToasts,
    board: boardToasts,
    column: columnToasts,
    general: generalToasts,
  };
};