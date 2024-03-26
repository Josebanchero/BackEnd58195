
// Función para generar un ID único
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Función para verificar si un usuario tiene permisos de administrador
function isAdmin(user) {
  return user && user.role === 'admin';
}

// Exportar las funciones para que estén disponibles en otros archivos
module.exports = {
  generateId,
  isAdmin
};
